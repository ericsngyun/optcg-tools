import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import type { Card } from "@prisma/client"


export const cardRouter = createTRPCRouter({
  getAllCards: publicProcedure.query(async (): Promise<Card[]> => {
    try {
      const myCards = await db.card.findMany();
      return myCards;
    } catch (error) {
      console.error("Error fetching cards:", error);
      return [];
    }
  })
});
