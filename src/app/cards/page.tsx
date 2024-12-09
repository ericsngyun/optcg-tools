'use client'
import React from "react";
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

export default function Cards() {
  const { data: cards } = api.card.getCards.useQuery();
  const { data: sets } = api.set.getSets.useQuery();
  const { data: attribute } = api.attribute.getAttributes.useQuery();
  const { data: type } = api.type.getTypes.useQuery();
  const { data: category } = api.category.getCategories.useQuery()
  const { data: color } = api.color.getColors.useQuery()
  const { data: rarity } = api.rarity.getRarity.useQuery()

  const selectGroup = [sets, attribute, type, category, color, rarity];
  console.log(selectGroup)

  // First, add labels for each group
  const selectLabels = ["Sets", "Attributes", "Types", "Categories", "Colors", "Rarities"];
  
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-2.5 md:px-12 lg:px-20 xl:px-28 space-y-12 py-12">
      {/* this is for the filter box */}
      <Card className="">
        <CardHeader>
          <CardTitle>Card List</CardTitle>
          <CardDescription>
            Total Results: {cards?.length ?? 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 grid-flow-col gap-4">
            {selectGroup.map((group, index) => (
              <Select key={index}>
                <SelectTrigger className="w-[180px]">
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
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {cards?.map((card) => <MyCard key={card.id} card={card}/>)}
      </div>
    </div>
  );
}
