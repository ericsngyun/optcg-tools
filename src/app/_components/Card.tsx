import React from "react";
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

// Update the CardWithRelations type definition to allow Color to be null
type CardWithRelations = {
  Category: { id: string; name: string; } | null;
  Image: { id: string; image_url: string; image_name: string | null; } | null;
  Rarity: { id: string; name: string; } | null;
  Set: { id: string; name: string; } | null;
  Attribute: { id: string; name: string; } | null;
  Color: { id: string; name: string; } | null;
  Type: { id: string; name: string; } | null;
  power: number | null;
  effect: string | null;
  name: string | null;
  card_id: string | null;
  counter: number | null;
};

type CardProps = {
  card: CardWithRelations;
};

const MyCard: React.FC<CardProps> = ({ card }) => {
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
      <DialogContent className="w-full max-w-4xl rounded-lg border-r-2">
        <div className="flex gap-4">
          {card.Image?.image_url ? (
            <NextImage
              src={card.Image.image_url}
              alt="card image"
              height={350}
              width={350}
              style={{ height: 'auto', width: '60%'}}
            />
          ) : (
            <div>No image available</div>
          )}
          <DialogHeader className="gap-2">
            <DialogTitle className="md:text-3xl text-xl text-center w-full ">{card.name}</DialogTitle>
            <Separator />
            <DialogDescription>
              <div className="grid grid-cols-3 gap-4 p-2 text-base md:text-lg–">
                {card.Category?.name == "CHARACTER" ? 
                  (
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-slate-700">Power</h1>
                      <p>{card.power}</p>
                    </div>
                  )
                  :
                    null
                }
                {card.Category?.name == "CHARACTER" ? 
                  (
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-slate-700">Counter</h1>
                      <p>{card.counter}</p>
                    </div>
                  )
                  :
                    null
                }
                <div className="flex flex-col">
                  <h1 className="font-semibold text-slate-700">Set</h1>
                  <p>{card.Set?.name}</p>
                </div>
                <div className="flex flex-col">
                  <h1 className="font-semibold text-slate-700">Rarity</h1>
                  <p>{card.Rarity?.name}</p>
                </div>
                <div className="flex flex-col">
                  <h1 className="font-semibold text-slate-700">Category</h1>
                  <p>{card.Category?.name}</p>
                </div>
                {card.Category?.name == "CHARACTER" || card.Category?.name == "EVENT" || card.Category?.name == "STAGE" || card.Category?.name == "Leader" ? 
                  (
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-slate-700">Type</h1>
                      <p>{card.Category?.name}</p>
                    </div>
                  )
                  :
                    null
                }
              </div>
              <Separator />
              <div className="flex flex-col gap-2 text-xs md:text-lg max-w-2xl mt-2">
                <h1 className="text-slate-700 font-bold">Effect</h1>
                <p className="text-left">
                 {card.effect}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
};



export default MyCard;
