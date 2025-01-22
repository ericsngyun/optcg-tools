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
      <DialogTrigger className="flex justify-center">
        {card.Image?.image_url ? (
          <NextImage
            src={card.Image.image_url}
            alt="card image"
            height={300}
            width={300}
            className="object-cover w-full h-auto max-w-[200px] md:max-w-[300px]"
          />
        ) : (
          <div>No image available</div>
        )}
      </DialogTrigger>
      <DialogContent className="w-full max-w-[95%] md:max-w-4xl rounded-lg border-r-2">
        <div className="flex flex-col md:flex-row gap-4 p-2">
          {/* Image Section */}
          <div className="md:flex-1 flex justify-center">
            {card.Image?.image_url ? (
              <NextImage
                placeholder="blur"
                blurDataURL="/loading/opcardback_02.jpg"
                src={card.Image.image_url}
                alt="card image"
                height={500}
                width={500}
                className="w-full h-auto max-w-[300px] md:max-w-none object-contain"
              />
            ) : (
              <div>No image available</div>
            )}
          </div>

          {/* Content Section */}
          <DialogHeader className="md:flex-1 gap-2">
            <DialogTitle className="text-xl md:text-3xl text-center w-full">
              {card.name}
            </DialogTitle>
            <Separator className="my-2 md:my-4" />

            <DialogDescription>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 p-1 md:p-2 text-sm md:text-base">
                {/* Dynamic Fields */}
                {card.Category?.name === "CHARACTER" && (
                  <>
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-slate-700">Power</h1>
                      <p>{card.power}</p>
                    </div>
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-slate-700">Counter</h1>
                      <p>{card.counter}</p>
                    </div>
                  </>
                )}

                {/* Common Fields */}
                <div className="flex flex-col">
                  <h1 className="font-semibold text-slate-700">Set</h1>
                  <p className="text-xs md:text-sm">{card.Set?.name}</p>
                </div>
                <div className="flex flex-col">
                  <h1 className="font-semibold text-slate-700">Rarity</h1>
                  <p className="text-xs md:text-sm">{card.Rarity?.name}</p>
                </div>
                <div className="flex flex-col">
                  <h1 className="font-semibold text-slate-700">Type</h1>
                  <p className="text-xs md:text-sm">{card.Type?.name}</p>
                </div>

                {/* Conditional Category */}
                {["CHARACTER", "EVENT", "STAGE", "Leader"].includes(
                  card.Category?.name ?? ""
                ) && (
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-slate-700">Category</h1>
                    <p className="text-xs md:text-sm">{card.Category?.name}</p>
                  </div>
                )}
              </div>

              <Separator className="my-2 md:my-4" />

              <div className="flex flex-col gap-1 md:gap-2 mt-1 md:mt-2">
                <h1 className="text-slate-700 font-bold text-sm md:text-base">
                  Effect
                </h1>
                <p className="text-left text-xs md:text-sm leading-relaxed">
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

export default MyCard