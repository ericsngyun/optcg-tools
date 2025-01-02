"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { api } from "~/trpc/react";
import MyCard from "../_components/Card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { XIcon } from "lucide-react";
import { toast } from "~/hooks/use-toast";
import { useInView } from "react-intersection-observer";

type FilterState = {
  sets: string | null;
  attribute: string | null;
  type: string | null;
  category: string | null;
  color: string | null;
  rarity: string | null;
  search: string | null;
  searcheffect: string | null;
  power: number | null;
  counter: number | null;
};

const SELECT_LABELS = [
  "Set",
  "Attribute",
  "Type",
  "Category",
  "Color",
  "Rarity",
] as const;

const labelToKey = {
  Set: "sets",
  Attribute: "attribute",
  Type: "type",
  Category: "category",
  Color: "color",
  Rarity: "rarity",
} as const;

export default function Cards() {
  const { ref, inView } = useInView();

  const [filterState, setFilterState] = useState<FilterState>({
    sets: null,
    attribute: null,
    type: null,
    category: null,
    color: null,
    rarity: null,
    search: null,
    searcheffect: null,
    power: null,
    counter: null,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    api.card.getCards.useInfiniteQuery(
      {
        limit: 48,
        ...filterState,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  // Fetch next page when the last element comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Flatten the pages array
  const cards = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data?.pages],
  );

  const { data: sets } = api.set.getSets.useQuery();
  const { data: attribute } = api.attribute.getAttributes.useQuery();
  const { data: type } = api.type.getTypes.useQuery();
  const { data: category } = api.category.getCategories.useQuery();
  const { data: color } = api.color.getColors.useQuery();
  const { data: rarity } = api.rarity.getRarity.useQuery();

  const selectGroup = useMemo(
    () =>
      [
        sets,
        attribute,
        type,
        category,
        color,
        rarity,
      ] as const satisfies readonly (
        | { id: string; name: string }[]
        | undefined
      )[],
    [sets, attribute, type, category, color, rarity],
  );

  const handleSelectChange = useCallback(
    (key: keyof Omit<FilterState, "search">, value: string) => {
      setFilterState((prev) => ({
        ...prev,
        [key]: prev[key] === value ? null : value,
      }));
    },
    [],
  );

  const filteredCards = useMemo(
    () =>
      cards?.filter((card) => {
        const searchTerm = filterState.search?.toLowerCase();
        const effectTerm = filterState.searcheffect?.toLowerCase();
        return (
          (filterState.sets ? card.set === filterState.sets : true) &&
          (filterState.attribute
            ? card.attribute === filterState.attribute
            : true) &&
          (filterState.type ? card.type === filterState.type : true) &&
          (filterState.category
            ? card.category === filterState.category
            : true) &&
          (filterState.color ? card.color === filterState.color : true) &&
          (filterState.rarity ? card.rarity === filterState.rarity : true) &&
          (searchTerm
            ? card.name?.toLowerCase().includes(searchTerm) ||
              card.card_id?.toLowerCase().includes(searchTerm)
            : true) &&
          (effectTerm ? card.effect?.toLowerCase().includes(effectTerm) : true)
        );
      }),
    [cards, filterState],
  );

  const selectOptions = useMemo(
    () =>
      selectGroup.map((group, index) => (
        <Select
          key={index}
          onValueChange={(value) =>
            handleSelectChange(labelToKey[SELECT_LABELS[index]!], value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Select ${SELECT_LABELS[index]}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{SELECT_LABELS[index]}</SelectLabel>
              {Array.isArray(group) &&
                group.map((value) => (
                  <SelectItem key={value.id} value={value.id}>
                    {value.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )),
    [selectGroup, handleSelectChange],
  );

  // Add state for input values
  const [nameInput, setNameInput] = useState("");
  const [effectInput, setEffectInput] = useState("");
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {},
  );

  // Update the clear function
  const handleClear = () => {
    setFilterState({
      sets: null,
      attribute: null,
      type: null,
      category: null,
      color: null,
      rarity: null,
      search: null,
      searcheffect: null,
      power: null,
      counter: null,
    });
    setNameInput("");
    setEffectInput("");
    setSelectedValues({});
    toast({
      variant: "destructive",
      title: "Cleared filters",
    });
  };

  // Update the input handlers to be more responsive
  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNameInput(value);
    setFilterState((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const handleEffectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEffectInput(value);
    setFilterState((prev) => ({
      ...prev,
      searcheffect: value,
    }));
  };

  return (
    <div
      className="mx-auto w-full max-w-screen-2xl space-y-8 px-2.5 py-6 md:px-12 lg:px-20 xl:px-28"
      style={{
        backgroundImage:
          'url("/Users/ericyun/code-stuff/bustertools/public/background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      {/* this is for the filter box */}
      <Card className="">
        <CardHeader>
          <CardTitle>Card List</CardTitle>
          <CardDescription>
            Total Results: {filteredCards?.length ?? 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                value={nameInput}
                onChange={handleNameInputChange}
                type="text"
                placeholder="Name/Code"
              />
              <Input
                value={effectInput}
                onChange={handleEffectInputChange}
                type="text"
                placeholder="Effect"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">{selectOptions}</div>
            <div className="grid grid-cols-2 gap-4"> </div>
            <Button onClick={handleClear}>
              Clear
              <XIcon />
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-4 gap-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
        {isLoading ? (
          Array.from({ length: 32 }).map((_, index) => (
            <Skeleton key={index} className="h-[250px]" />
          ))
        ) : (
          <>
            {cards.map((card) => (
              <MyCard key={card.id} card={card} />
            ))}
            {isFetchingNextPage &&
              Array.from({ length: 24 }).map((_, index) => (
                <Skeleton key={`loading-${index}`} className="h-[275px]"/>
              ))}
            <div ref={ref} className="col-span-full h-1" />
          </>
        )}
      </div>
    </div>
  );
}
