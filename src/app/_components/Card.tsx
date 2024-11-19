import React from "react";
import type { Card, Category, Image, Rarity, Set} from "@prisma/client"

type CardWithRelations = Card & {
  Category: Category | null;
  Image: Image | null;
  Rarity: Rarity | null;
  Set: Set | null;
}

type CardProps = {
  card: CardWithRelations
}

const Card: React.FC<CardProps> = ({ card }) => {
  return (
    <div>
      {card.name}
    </div>
  ); 
};

export default Card;
