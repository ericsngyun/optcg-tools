import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  getCategories: publicProcedure.query(async ({ ctx }) => {
    const categories= await ctx.db.category.findMany();
    return categories;
  }),
});
