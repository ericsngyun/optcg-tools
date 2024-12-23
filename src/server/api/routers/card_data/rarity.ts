import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const rarityRouter = createTRPCRouter({
  getRarity: publicProcedure.query(async ({ ctx }) => {
    const rarities = await ctx.db.rarity.findMany();
    return rarities;
  }),
});
