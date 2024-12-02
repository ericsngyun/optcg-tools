import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const cardRouter = createTRPCRouter({
  getCards: publicProcedure.query(async ({ ctx }) => {
    const cards = await ctx.db.card.findMany({
      take: 1000,
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
          Color: {
            color_name: "asc"
          },
        },
        {
          name: "asc"
        }
      ]
    });
    return cards
  }),
});
