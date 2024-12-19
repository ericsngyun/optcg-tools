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
        // Add filter inputs
        sets: z.string().nullish(),
        attribute: z.string().nullish(),
        type: z.string().nullish(),
        category: z.string().nullish(),
        color: z.string().nullish(),
        rarity: z.string().nullish(),
        search: z.string().nullish(),
        searcheffect: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, ...filters } = input;
      
      const items = await ctx.db.card.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          // Add filter conditions
          ...(filters.sets && { set: filters.sets }),
          ...(filters.attribute && { attribute: filters.attribute }),
          ...(filters.type && { type: filters.type }),
          ...(filters.category && { category: filters.category }),
          ...(filters.color && { color: filters.color }),
          ...(filters.rarity && { rarity: filters.rarity }),
          ...(filters.search && {
            OR: [
              { name: { contains: filters.search, mode: 'insensitive' } },
              { card_id: { contains: filters.search, mode: 'insensitive' } },
            ],
          }),
          ...(filters.searcheffect && {
            effect: { contains: filters.searcheffect, mode: 'insensitive' },
          }),
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
