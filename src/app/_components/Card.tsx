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
      <DialogContent className="w-full max-w-4xl rounded-lg border-r-2 bg-slate-200">
        <div className="flex gap-2">
          {card.Image?.image_url ? (
            <NextImage
              src={card.Image.image_url}
              alt="card image"
              height={500}
              width={350}
              className="max-w-full h-auto"
            />
          ) : (
            <div>No image available</div>
          )}
          <DialogHeader className="gap-4">
            <DialogTitle className="text-3xl">{card.name}</DialogTitle>
            <DialogDescription className="text-xl">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <h1 className="font-bold text-slate-700">Power</h1>
                  <p>{card.power}</p>
                </div>
                <div className="flex flex-col">
                  <h1 className="font-bold text-slate-700">Set</h1>
                  <p>{card.Set?.set_name}</p>
                </div>

              </div>
              
                {card.effect}
            </DialogDescription>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Card;
