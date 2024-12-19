import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const attributeRouter = createTRPCRouter({
  getAttributes: publicProcedure.query(async ({ ctx }) => {
    const attributes = await ctx.db.attribute.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    return attributes;
  }),
});
