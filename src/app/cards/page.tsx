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
import { Check, ChevronsUpDown, XIcon } from "lucide-react";
import { toast } from "~/hooks/use-toast";
import { useInView } from "react-intersection-observer";
import { Slider } from "~/components/ui/slider";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { cn } from "~/lib/utils";

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
  Set: "sets",
  Attribute: "attribute",
  Type: "type",
  Category: "category",
  Color: "color",
  Rarity: "rarity",
} as const;

export default function Cards() {
  const { ref, inView } = useInView();
  const [nameInput, setNameInput] = useState("");
  const [effectInput, setEffectInput] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({});
  
  const [selectedValues, setSelectedValues] = useState<Record<string, string | null>>(
    {},
  );

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
    cost: null,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    api.card.getCards.useInfiniteQuery(
      {
        limit: 52,
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
      // Update selectedValues state
      setSelectedValues((prev) => ({
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
          (effectTerm ? card.effect?.toLowerCase().includes(effectTerm) : true) &&
          (filterState.power !== null ? card.power === filterState.power : true) &&
          (filterState.counter !== null ? card.counter === filterState.counter : true)
        );
      }),
    [cards, filterState],
  );

  const selectOptions = useMemo(
    () =>
      selectGroup.map((group, index) => (
        <Select
          key={index}
          value={selectedValues[SELECT_LABELS[index]!] ?? undefined}
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
    [selectGroup, handleSelectChange, selectedValues],
  );


  // const selectOptions2 = useMemo(
  //   () => 
  //     selectGroup.map((group, index) => (
  //         <Popover open={open} onOpenChange={setOpen} key = {index}>
  //           <PopoverTrigger asChild>
  //             <Button
  //               variant="outline"
  //               role="combobox"
  //               aria-expanded={open}
  //               className="w-[200px] justify-between"
  //             >
  //               {selectGroup[index]
  //                 ? selectGroup[index].find((value) => value.value === value)?.label
  //                 : "Select framework..."}
  //               <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
  //             </Button>
  //           </PopoverTrigger>
  //           <PopoverContent className="w-[200px] p-0">
  //             <Command>
  //               <CommandInput placeholder="Search framework..." />
  //               <CommandList>
  //                 <CommandEmpty>No framework found.</CommandEmpty>
  //                 <CommandGroup>
  //                   {frameworks.map((framework) => (
  //                     <CommandItem
  //                       key={framework.value}
  //                       value={framework.value}
  //                       onSelect={(currentValue) => {
  //                         setValue(currentValue === value ? "" : currentValue)
  //                         setOpen(false)
  //                       }}
  //                     >
  //                       <Check
  //                         className={cn(
  //                           "mr-2 h-4 w-4",
  //                           value === framework.value ? "opacity-100" : "opacity-0"
  //                         )}
  //                       />
  //                       {framework.label}
  //                     </CommandItem>
  //                   ))}
  //                 </CommandGroup>
  //               </CommandList>
  //             </Command>
  //           </PopoverContent>
  //       </Popover>
  //     )),
  //     [selectGroup, handleSelectChange, selectedValues]
  // )

  

  // Add state for input values


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
      cost: null,
    });
  
    setNameInput("");
    setEffectInput("");
  
    // Reset selectedValues for each SELECT_LABEL
    const resetValues = SELECT_LABELS.reduce((acc, label) => {
      acc[label] = null;
      console.log(acc)
      return acc;
    }, {} as Record<string, string | null>);
    
    setSelectedValues(resetValues);
  
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
        {isLoading ? (
          Array.from({ length: 36 }).map((_, index) => (
            <Skeleton key={index} className="h-[250px]" />
          ))
        ) : (
          <>
            {cards.map((card) => (
              <MyCard key={card.id} card={card} />
            ))}
            {isFetchingNextPage &&
              Array.from({ length: 36 }).map((_, index) => (
                <Skeleton key={`loading-${index}`} className="h-[275px] rounded-lg"/>
              ))}
            <div ref={ref} className="col-span-full h-1" />
          </>
        )}
      </div>
    </div>
  );
}
