import React from "react";

type CardProps = {
  card: {
    id: string;
    name: string;
    imageUrl: string;
    set: string;
    rarity: string;
    category: string;
    power: number;
    effect: string;
    counter: number;
  };
};

const Card: React.FC<CardProps> = ({ card }) => {
  return <div>Card</div>; 
};

export default Card;
