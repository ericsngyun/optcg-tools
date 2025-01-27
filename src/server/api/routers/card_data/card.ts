import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { Prisma } from "@prisma/client";

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
          // Existing filters
          ...(filters?.set ? { set: filters.set }: undefined ),
          ...(filters?.attribute ? { attribute: filters.attribute }: undefined),
          ...(filters?.type ? { type: filters.type }: undefined),
          ...(filters?.category ? { category: filters.category }: undefined),
          ...(filters?.color ? { color: filters.color }: undefined),
          ...(filters?.rarity ? { rarity: filters.rarity }: undefined),
        
          // Add search filters
          ...(filters?.search && {
            OR: [
              { name: { contains: filters.search, mode: Prisma.QueryMode.insensitive } },
              { card_id: { contains: filters.search, mode: Prisma.QueryMode.insensitive } }
            ]
          }),
          ...(filters?.searcheffect && {
            effect: { contains: filters.searcheffect, mode: Prisma.QueryMode.insensitive }
          })
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
        orderBy: [
          {card_id: 'asc' as const},
          {name: 'asc' as const}
        ],
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



    getCardDetails: publicProcedure
      .input(z.string()) // card_id
      .query(async ({ ctx, input }) => {
        const cardDetails = ctx.db.card.findMany(
          {
            where: {
              card_id: input,
              is_alt_art: '-'
            }
          }
        )

        return cardDetails
      })
       
});

