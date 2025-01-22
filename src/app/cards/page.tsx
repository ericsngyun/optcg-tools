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
import { useDebounce } from "~/hooks/use-debounce";
import { FilterSelect } from "../_components/FilterSelect";

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

type Label = typeof SELECT_LABELS[number];

const labelToKey: Record<Label, Exclude<keyof FilterState, "search" | "searcheffect">> = {
  Set: "set",
  Attribute: "attribute",
  Type: "type",
  Category: "category",
  Color: "color",
  Rarity: "rarity",
};

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

  const debouncedNameInput = useDebounce(nameInput, 300);
  const debouncedEffectInput = useDebounce(effectInput, 300);


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
    setFilterState(prev => ({
      ...prev,
      search: debouncedNameInput || null,
      searcheffect: debouncedEffectInput || null
    }));
  }, [debouncedNameInput, debouncedEffectInput]);



  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const selectGroup = useMemo(
    () => [set, attribute, type, category, color, rarity] as const,
    [set, attribute, type, category, color, rarity],
  );

  const handleSelectChange = useCallback(
    (key: Exclude<keyof FilterState, "search" | "searcheffect">, value: string) => {
      setFilterState((prev) => ({
        ...prev,
        [key]: prev[key] === value ? null : value,
      }));

      setSelectedValues((prev) => ({
        ...prev,
        [key]: prev[key] === value ? null : value,
      }));
    },
    []
  );
  const selectOptions = useMemo(
    () =>
      selectGroup.map((group, index) => {
        const label = SELECT_LABELS[index]!;
        const key = labelToKey[label];

        return (
          <FilterSelect
            key={label}
            label={label}
            value={selectedValues[key] ?? null}
            options={group ?? []}
            onChange={(value) => handleSelectChange(key, value)}
          />
        );
      }),
    [selectGroup, handleSelectChange, selectedValues],
  );

  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
  };

  const handleEffectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEffectInput(e.target.value);
  };

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
      return Array.from({ length: 12 }).map((_, index) => (
        <Skeleton
          key={`skeleton-${index}`}
          className="aspect-[2/3] h-auto w-full rounded-xl"
        />
      ));
    }
  
    return (
      <>
        {filteredCards.map((card) => (
          <MyCard key={card.card_id} card={card} />
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 12 }).map((_, index) => (
            <Skeleton
              key={`loading-${index}`}
              className="aspect-[2/3] h-auto w-full rounded-xl"
            />
          ))}
      </>
    );
  }, [filteredCards, isLoading, isFetchingNextPage]);
  

  return (
    <div className="mx-auto w-full max-w-screen-2xl space-y-4 px-2 py-3 sm:space-y-6 sm:px-4 sm:py-4 md:space-y-8 md:px-6 md:py-6">
      {/* Filter Card */}
      <Card className="rounded-lg">
        <CardHeader className="px-3 py-2 sm:p-4 md:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-xl font-bold sm:text-2xl">
                Card List
              </CardTitle>
              <CardDescription className="mt-1 text-sm sm:text-base">
                Total Results: {filteredCards.length}
              </CardDescription>
            </div>
            <Button
              onClick={handleClear}
              variant="outline"
              className="mt-2 w-full sm:mt-0 sm:w-auto"
              size="sm"
            >
              Clear Filters
              <XIcon className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-3 py-2 sm:p-4 md:p-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Search Inputs */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={nameInput}
                onChange={handleNameInputChange}
                placeholder="Search by Name/Code"
                className="h-10 rounded-lg sm:h-12"
              />
              <Input
                value={effectInput}
                onChange={handleEffectInputChange}
                placeholder="Search by Effect"
                className="h-10 rounded-lg sm:h-12"
              />
            </div>

            {/* Filter Selects */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {selectOptions}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Grid */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:grid-cols-4 md:gap-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {renderCards()}
        <div ref={ref} className="col-span-full h-2" />
      </div>
    </div>
  );
}

