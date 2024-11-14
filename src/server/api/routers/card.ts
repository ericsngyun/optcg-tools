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
        Image: true
      }
    });
    return cards;
  }),
});
