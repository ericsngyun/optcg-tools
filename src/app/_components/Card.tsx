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
          <DialogHeader>
            <DialogTitle className="text-3xl">{card.name}</DialogTitle>
            <DialogDescription>{card.effect}</DialogDescription>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Card;
