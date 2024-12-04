import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const setRouter = createTRPCRouter({
  getSets: publicProcedure.query(async ({ ctx }) => {
    const sets = await ctx.db.set.findMany();
    return sets;
  }),
});
