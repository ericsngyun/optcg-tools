import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const typeRouter = createTRPCRouter({
  getTypes: publicProcedure.query(async ({ ctx }) => {
    const types = await ctx.db.type.findMany()
    return types;
  }),
});
