import React from "react";
import type { Card, Category, Image, Rarity, Set } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import NextImage from "next/image";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

type CardWithRelations = Card & {
  Category: Category | null;
  Image: Image | null;
  Rarity: Rarity | null;
  Set: Set | null;
};

type CardProps = {
  card: CardWithRelations;
};

const Card: React.FC<CardProps> = ({ card }) => {
  return (
    <Dialog>
      <DialogTrigger>
        {card.Image?.image_url ? (
          <NextImage
            src={card.Image.image_url}
            alt="card image"
            height={500}
            width={250}
          />
        ) : (
          <div>No image available</div>
        )}
      </DialogTrigger>
      <DialogContent className="w-full max-w-3xl rounded-lg border-r-2">
        <div className="flex gap-4">
          {card.Image?.image_url ? (
            <NextImage
              src={card.Image.image_url}
              alt="card image"
              height={150}
              width={150}
              className="max-w-full h-auto"
              style={{ height: 'auto', width: '100%'}}
            />
          ) : (
            <div>No image available</div>
          )}
          <DialogHeader className="gap-2">
            <DialogTitle className="md:text-3xl text-xl text-center w-full">{card.name}</DialogTitle>
            <Separator />
            <DialogDescription className="gap-2">
              <div className="grid grid-cols-3 gap-4 p-2 text-sm md:text-lg">
                <div className="flex flex-col">
                  <h1 className="font-semibold text-slate-700">Power</h1>
                  <p>{card.power}</p>
                </div>
                <div className="flex flex-col">
                  <h1 className="font-semibold text-slate-700">Set</h1>
                  <p>{card.Set?.set_name}</p>
                </div>
                <div className="flex flex-col">
                  <h1 className="font-semibold text-slate-700">Rarity</h1>
                  <p>{card.Rarity?.rarity_name}</p>
                </div>
                <div className="flex flex-col">
                  <h1 className="font-semibold text-slate-700">Type</h1>
                  <p>{card.Category?.category_name}</p>
                </div>

              </div>
              <Separator />
              <div className="flex flex-col gap-2 text-xs md:text-lg">
                <h1 className="text-slate-700 font-bold">Effect</h1>
                {card.effect}
              </div>
            </DialogDescription>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Card;
