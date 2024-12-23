import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const setRouter = createTRPCRouter({
  getSets: publicProcedure.query(async ({ ctx }) => {
    const sets = await ctx.db.set.findMany({
      orderBy: {
        name: "asc"
      }
    });
    return sets;
  }),
});
