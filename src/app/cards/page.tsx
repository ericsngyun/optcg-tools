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
  set: string | null;
  attribute: string | null;
  type: string | null;
  category: string | null;
  color: string | null;
  rarity: string | null;
  search: string | null;
  searcheffect: string | null;
  power: number | null;
  counter: number | null;
  cost: number | null;
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
  Set: "set",
  Attribute: "attribute",
  Type: "type",
  Category: "category",
  Color: "color",
  Rarity: "rarity",
} as const;

export default function Cards() {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px",
  });

  const [nameInput, setNameInput] = useState("");
  const [effectInput, setEffectInput] = useState("");
  const [selectedValues, setSelectedValues] = useState<
    Record<string, string | null>
  >({});
  const [filterState, setFilterState] = useState<FilterState>({
    set: null,
    attribute: null,
    type: null,
    category: null,
    color: null,
    rarity: null,
    search: "",
    searcheffect: "",
    power: null,
    counter: null,
    cost: null,
  });


  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    api.card.getCards.useInfiniteQuery(
      {
        limit: 52,
        filters: filterState,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  // Static data queries
  const { data: set } = api.set.getSets.useQuery();
  const { data: attribute } = api.attribute.getAttributes.useQuery();
  const { data: type } = api.type.getTypes.useQuery();
  const { data: category } = api.category.getCategories.useQuery();
  const { data: color } = api.color.getColors.useQuery();
  const { data: rarity } = api.rarity.getRarity.useQuery();

  const cards = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data?.pages],
  );

  const filteredCards = useMemo(() => {
    if (!cards) return [];

    const searchTerm = filterState.search?.toLowerCase() ?? "";
    const effectTerm = filterState.searcheffect?.toLowerCase() ?? "";

    return cards.filter((card) => {
      // Breaking down conditions for better readability and potential optimization
      if (filterState.set && card.set !== filterState.set) return false;
      if (filterState.attribute && card.attribute !== filterState.attribute)
        return false;
      if (filterState.type && card.type !== filterState.type) return false;
      if (filterState.category && card.category !== filterState.category)
        return false;
      if (filterState.color && card.color !== filterState.color) return false;
      if (filterState.rarity && card.rarity !== filterState.rarity)
        return false;

      // Search terms
      const nameMatches =
        !searchTerm ||
        card.name?.toLowerCase().includes(searchTerm) ||
        card.card_id?.toLowerCase().includes(searchTerm);
      if (!nameMatches) return false;

      const effectMatches =
        !effectTerm || card.effect?.toLowerCase().includes(effectTerm);
      if (!effectMatches) return false;

      // Numeric filters
      if (filterState.power !== null && card.power !== filterState.power)
        return false;
      if (filterState.counter !== null && card.counter !== filterState.counter)
        return false;

      return true;
    });
  }, [cards, filterState]); 


  useEffect(() => {
    if ( filteredCards )
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const selectGroup = useMemo(
    () => [set, attribute, type, category, color, rarity] as const,
    [set, attribute, type, category, color, rarity],
  );

  const handleSelectChange = useCallback(
    (key: keyof Omit<FilterState, "search">, value: string) => {
      setFilterState((prev) => ({
        ...prev,
        [key]: prev[key] === value ? null : value,
      }));

      setSelectedValues((prev) => ({
        ...prev,
        [key]: prev[key] === value ? null : value,
      }));
    },
    [],
  );
  const selectOptions = useMemo(
    () =>
      selectGroup.map((group, index) => {
        const label = SELECT_LABELS[index]!;
        const key = labelToKey[label];

        return (
          <Select
            key={index}
            value={selectedValues[key] ?? undefined}
            onValueChange={(value) => handleSelectChange(key, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{label}</SelectLabel>
                {Array.isArray(group) &&
                  group.map((value) => (
                    <SelectItem key={value.id} value={value.id}>
                      {value.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      }),
    [selectGroup, handleSelectChange, selectedValues],
  );

  const handleNameInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setNameInput(value);
      setFilterState((prev) => ({
        ...prev,
        search: value,
      }));
    },
    [],
  );

  const handleEffectInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setEffectInput(value);
      setFilterState((prev) => ({
        ...prev,
        searcheffect: value,
      }));
    },
    [],
  );

  const handleClear = useCallback(() => {
    setFilterState({
      set: null,
      attribute: null,
      type: null,
      category: null,
      color: null,
      rarity: null,
      search: '',
      searcheffect: '',
      power: null,
      counter: null,
      cost: null,
    });
    setNameInput("");
    setEffectInput("");
    setSelectedValues({});

    toast({
      variant: "destructive",
      title: "Cleared filters",
    });
  }, []);

  // Update the renderCards function to use filteredCards
  const renderCards = useCallback(() => {
    if (isLoading) {
      return Array.from({ length: 52 }).map((_, index) => (
        <Skeleton key={`skeleton-${index}`} className="h-[250px]" />
      ));
    }

    return (
      <>
        {filteredCards.map((card) => (
          <MyCard key={card.Image?.image_url} card={card} />
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 52 }).map((_, index) => (
            <Skeleton key={`loading-${index}`} className="h-[275px] rounded-lg" />
          ))}
      </>
    );
  }, [filteredCards, isLoading, isFetchingNextPage]);

  return (
    <div className="mx-auto w-full max-w-screen-2xl space-y-8 px-2.5 py-6 md:px-12 lg:px-20 xl:px-28">
      <Card>
        <CardHeader>
          <CardTitle>Card List</CardTitle>
          <CardDescription>Total Results: {filteredCards.length}</CardDescription>
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
            <div className="grid grid-cols-2 gap-4">
              <h2 className="text-md text-center">Power</h2>
            </div>
            <Button onClick={handleClear}>
              Clear
              <XIcon />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-4 gap-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
        {renderCards()}
        <div ref={ref} className="col-span-full h-1" />
      </div>
    </div>
  );
}