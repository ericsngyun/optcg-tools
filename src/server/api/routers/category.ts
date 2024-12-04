import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  getSets: publicProcedure.query(async ({ ctx }) => {
    const categories= await ctx.db.category.findMany();
    return categories;
  }),
});
