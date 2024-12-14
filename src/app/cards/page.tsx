'use client'
import React, { useState } from "react";
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Input } from "~/components/ui/input";

type FilterState = {
  sets: string | null;
  attribute: string | null;
  type: string | null;
  category: string | null;
  color: string | null;
  rarity: string | null;
  search: string | null;
}

export default function Cards() {
  const { data: cards } = api.card.getCards.useQuery();
  const { data: sets } = api.set.getSets.useQuery();
  const { data: attribute } = api.attribute.getAttributes.useQuery();
  const { data: type } = api.type.getTypes.useQuery();
  const { data: category } = api.category.getCategories.useQuery()
  const { data: color } = api.color.getColors.useQuery()
  const { data: rarity } = api.rarity.getRarity.useQuery()

  const [filterState, setFilterState] = useState<FilterState>({
    sets: null,
    attribute: null,
    type: null,
    category: null,
    color: null,
    rarity: null,
    search: null,
  });

  const selectGroup = [sets, attribute, type, category, color, rarity];

  // First, add labels for each group
  const selectLabels = ["Set", "Attribute", "Type", "Category", "Color", "Rarity"];

  const labelToKey: Record<string, keyof FilterState> = {
    set: 'sets',
    attribute: 'attribute',
    types: 'type',
    category: 'category',
    color: 'color',
    rarity: 'rarity'
  };

  const handleSelectChange = (key: keyof FilterState, value: string) => {
    setFilterState((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const handleSearchChange = (value: string) => {
    setFilterState((prev) => ({
      ...prev,
      search: value,
    }))

    console.log(filterState)
  }

  const filteredCards = cards?.filter(card => {
    const searchTerm = filterState.search?.toLowerCase();
    return(
      (filterState.sets ? card.set === filterState.sets : true) &&
      (filterState.attribute ? card.attribute === filterState.attribute : true) &&
      (filterState.type ? card.type === filterState.type : true) &&
      (filterState.category ? card.category === filterState.category : true) &&
      (filterState.color ? card.color === filterState.color : true) &&
      (filterState.rarity ? card.rarity === filterState.rarity : true) &&
      (searchTerm ? 
        (card.name?.toLowerCase().includes(searchTerm) || 
         card.card_id?.toLowerCase().includes(searchTerm))
        : true)
    )
  })
  
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-2.5 md:px-12 lg:px-20 xl:px-28 space-y-12 py-12">
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
            <Input 
              onChange={(e) => handleSearchChange(e.target.value)} 
              type="text" 
              placeholder="Name/Code"
            />
            <div className="grid grid-cols-3 gap-4">
              {selectGroup.map((group, index) => (
                <Select 
                  key={index} 
                  onValueChange={(value) => handleSelectChange(
                    labelToKey[selectLabels[index]!.toLowerCase()]!, 
                    value
                  )}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${selectLabels[index]}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{selectLabels[index]}</SelectLabel>
                      {Array.isArray(group) && group.map((value) => (
                        <SelectItem key={value.id} value={value.id}>
                          {value.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {filteredCards?.map((card) => <MyCard key={card.id} card={card}/>)}
      </div>
    </div>
  );
}