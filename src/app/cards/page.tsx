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

export default function Cards() {
  const { data: cards } = api.card.getCards.useQuery();
  const { data: sets } = api.set.getSets.useQuery();
  const { data: attribute } = api.attribute.getAttributes.useQuery();
  const { data: type } = api.type.getTypes.useQuery();
  const { data: category } = api.category.getCategories.useQuery()
  const { data: color } = api.color.getColors.useQuery()

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
          <div className="grid grid-cols-3 grid-flow-col gap-4">
            
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {cards?.map((card) => <MyCard key={card.id} card={card}/>)}
      </div>
    </div>
  );
}
