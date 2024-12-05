import { cardRouter } from "~/server/api/routers/card";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { setRouter } from "./routers/set";
import { categoryRouter } from "./routers/category";
import { attributeRouter } from "./routers/attribute";
import { typeRouter } from "./routers/type";
import { rarityRouter } from "./routers/rarity";
import { colorRouter } from "./routers/color";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  card: cardRouter,
  set: setRouter,
  category: categoryRouter,
  attribute: attributeRouter,
  type: typeRouter,
  rarity: rarityRouter,
  color: colorRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
