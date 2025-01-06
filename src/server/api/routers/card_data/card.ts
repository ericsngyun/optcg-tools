import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const cardRouter = createTRPCRouter({
  getCards: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(24),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input; // Removed filters
      
      const items = await ctx.db.card.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {

        },
        include: {
          Category: true,
          Image: true,
          Rarity: true,
          Set: true,
          Attribute: true,
          Color: true,
          Type: true,
        },
        orderBy: {
          card_id: 'asc'
        }
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),
});