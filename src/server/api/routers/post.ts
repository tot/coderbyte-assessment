import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateKey, isValidData } from "~/utils/cache";
import { z } from "zod";
import { cachedPosts } from "~/utils/types";
import { stringToJSON } from "zod_utilz";
import { CACHE_TTL } from "~/utils/constants";

export const postRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ keywords: z.string() }))
    .query(async ({ ctx: { db, redis }, input: { keywords } }) => {
      // Case insensitive keywords for searching
      const searchTerms = keywords.toLowerCase();
      const cacheKey = generateKey(searchTerms);

      // Check if cache contains relevant data
      if (await isValidData(cacheKey)) {
        // Retrieve data from the cache
        const cachedData = await redis.getex(cacheKey);
        if (cachedData) {
          // Parse cached data and return the results
          const data = cachedPosts.parse(stringToJSON().parse(cachedData));
          return { results: data };
        }
      }

      // Search through database if no valid data in cache
      const results = await db.post.findMany({
        where: {
          OR: [
            {
              title: {
                contains: searchTerms,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: searchTerms,
                mode: "insensitive",
              },
            },
          ],
        },
      });

      console.log(results);
      // Update cache with database results
      await redis.set(cacheKey, JSON.stringify(results), "EX", CACHE_TTL);

      return { results };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
        },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
});
