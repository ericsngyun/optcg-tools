"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { api } from "~/trpc/react";
import MyCard from "../_components/Card";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import debounce from "lodash/debounce";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { Trash2, XIcon } from "lucide-react";

type FilterState = {
  sets: string | null;
  attribute: string | null;
  type: string | null;
  category: string | null;
  color: string | null;
  rarity: string | null;
  search: string | null;
  searcheffect: string | null;
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
  const { data: cards = [], isLoading } = api.card.getCards.useQuery();
  const { data: sets } = api.set.getSets.useQuery();
  const { data: attribute } = api.attribute.getAttributes.useQuery();
  const { data: type } = api.type.getTypes.useQuery();
  const { data: category } = api.category.getCategories.useQuery();
  const { data: color } = api.color.getColors.useQuery();
  const { data: rarity } = api.rarity.getRarity.useQuery();

  const [filterState, setFilterState] = useState<FilterState>({
    sets: null,
    attribute: null,
    type: null,
    category: null,
    color: null,
    rarity: null,
    search: null,
    searcheffect: null,
  });

  const selectGroup = useMemo(() => [
    sets, attribute, type, category, color, rarity
  ] as const satisfies readonly ({ id: string; name: string; }[] | undefined)[], [sets, attribute, type, category, color, rarity]);

  const handleSelectChange = useCallback(
    (key: keyof Omit<FilterState, 'search'>, value: string) => {
      setFilterState((prev) => ({
        ...prev,
        [key]: prev[key] === value ? null : value,
      }));
    },
    [],
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilterState((prev) => ({
          ...prev,
          search: value,
        }));
      }, 300),
    [], // Ensure it only initializes once
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel(); // Cleanup on unmount
    };
  }, [debouncedSearch]);
  
  const handleSearchChange = (value: string) => {
    debouncedSearch(value);
  };

  // Add another debounced search for effect
  const debouncedEffectSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilterState((prev) => ({
          ...prev,
          searcheffect: value,
        }));
      }, 300),
    [],
  );

  // Add handler for effect search
  const handleEffectSearchChange = (value: string) => {
    debouncedEffectSearch(value);
  };

  const filteredCards = useMemo(() => 
    cards?.filter(card => {
      const searchTerm = filterState.search?.toLowerCase();
      const effectTerm = filterState.searcheffect?.toLowerCase();
      return (
        (filterState.sets ? card.set === filterState.sets : true) &&
        (filterState.attribute ? card.attribute === filterState.attribute : true) &&
        (filterState.type ? card.type === filterState.type : true) &&
        (filterState.category ? card.category === filterState.category : true) &&
        (filterState.color ? card.color === filterState.color : true) &&
        (filterState.rarity ? card.rarity === filterState.rarity : true) &&
        (searchTerm ? 
          (card.name?.toLowerCase().includes(searchTerm) || 
           card.card_id?.toLowerCase().includes(searchTerm))
          : true) &&
        (effectTerm ? 
          card.effect?.toLowerCase().includes(effectTerm)
          : true)
      );
    }), [cards, filterState]
  );

  const selectOptions = useMemo(
    () =>
      selectGroup.map((group, index) => (
        <Select
          key={index}
          onValueChange={(value) =>
            handleSelectChange(
              labelToKey[SELECT_LABELS[index]!],
              value,
            )
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
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});

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
    });
    setNameInput("");
    setEffectInput("");
    setSelectedValues({});
  };

  return (
    <div className="mx-auto w-full max-w-screen-2xl space-y-12 px-2.5 py-12 md:px-12 lg:px-20 xl:px-28">
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
                onChange={(e) => {
                  setNameInput(e.target.value);
                  handleSearchChange(e.target.value);
                }}
                type="text"
                placeholder="Name/Code"
              />
              <Input
                value={effectInput}
                onChange={(e) => {
                  setEffectInput(e.target.value);
                  handleEffectSearchChange(e.target.value);
                }}
                type="text"
                placeholder="Effect"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">{selectOptions}</div>

            <Button onClick={handleClear}>
              Clear<XIcon/>
            </Button>
          </div>
          
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {isLoading ? (
        // Render skeleton loaders for each expected card
        Array.from({ length: cards?.length} || 6).map((_, index) => (
          <Skeleton key={index} className="h-[125px]" />
        ))
      ) : (
        filteredCards?.map((card) => <MyCard key={card.id} card={card} />)
      )}
    </div>
    </div>
  );
}
