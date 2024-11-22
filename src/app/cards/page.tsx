import React from "react";
import { api, HydrateClient } from "~/trpc/server";
import MaxWidthWrapper from "../_components/MaxWidthWrapper";
import MyCard from "../_components/Card";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function cards() {
  const cards = await api.card.getCards();

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-2.5 md:px-12 lg:px-20 xl:px-28 space-y-12 py-12">
      {/* this is for the filter box */}
      <Card className="">
        <CardHeader>
          <CardTitle>Card List</CardTitle>
          <CardDescription>Total Results: {cards.length}</CardDescription>
        </CardHeader>
        <CardContent>
          
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {cards?.map((card) => <MyCard key={card.id} card={card} />)}
      </div>
    </div>
  );
}
