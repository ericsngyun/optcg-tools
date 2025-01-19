import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const cardRouter = createTRPCRouter({
  getCards: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(52),
        cursor: z.string().nullish(),
        filters: z.object({
          set: z.string().nullish(),
          attribute: z.string().nullish(),
          type: z.string().nullish(),
          category: z.string().nullish(),
          color: z.string().nullish(),
          rarity: z.string().nullish(),
          search: z.string().nullish(),
          searcheffect: z.string().nullish(),
        }).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, filters } = input;

      // Build your query based on filters
      const query = {
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          // Apply filtering logic based on the filters object
          ...(filters?.set && { set: filters.set }),
          ...(filters?.attribute && { attribute: filters.attribute }),
          ...(filters?.type && { type: filters.type }),
          ...(filters?.category && { category: filters.category }),
          ...(filters?.color && { color: filters.color }),
          ...(filters?.rarity && { rarity: filters.rarity }),
          // Add search logic if needed
        },
        // Include any necessary relations
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
          card_id: 'asc' as const,
        },
      };

      const items = await ctx.db.card.findMany(query);

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