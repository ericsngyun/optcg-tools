import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const colorRouter = createTRPCRouter({
  getColors: publicProcedure.query(async ({ ctx }) => {
    const colors = await ctx.db.color.findMany();
    return colors;
  }),
});
