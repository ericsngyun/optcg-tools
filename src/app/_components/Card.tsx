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
          <NextImage src={card.Image.image_url} alt="card image" height={500} width={350}/>
        ) : (
          <div>No image available</div>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{card.name}</DialogTitle>
          <DialogDescription>
            {card.effect}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Card;
