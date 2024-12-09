import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const cardRouter = createTRPCRouter({
  getCards: publicProcedure.query(async ({ ctx }) => {
    const cards = await ctx.db.card.findMany({
      take: 50,
      include: {
        Image: true,
        Category: true,
        Rarity: true,
        Set: true,
        Type: true,
        Attribute: true,
        Color: true,
      },
      orderBy: [
        {
          card_id: "asc" // Order by card_id first
        },
        {
          Color: {
            name: "asc" // Then order by color
          },
        },
        {
          is_alt_art: "asc" // Finally order by is_alt_art
        }
      ]
    });
    return cards
  }),
});
