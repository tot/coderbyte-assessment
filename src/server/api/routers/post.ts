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
    .input(
      z.object({
        author: z.string().min(2).max(200),
        title: z.string().min(2).max(200),
        slug: z.string().min(2),
        content: z.string().min(2),
      }),
    )
    .mutation(async ({ ctx: { db, redis }, input }) => {
      const newPost = await db.post.create({
        data: {
          ...input,
        },
      });

      // Get all keys in cache
      const keys = await redis.keys("*");

      // Check if any of the keys are keywords in the new post
      keys.forEach(async (key) => {
        if (
          newPost.title.toLowerCase().includes(key) ||
          newPost.content.toLowerCase().includes(key)
        ) {
          // Get TTL and current data for the key
          const ttl = await redis.ttl(key);
          const cachedData = await redis.get(key);

          // If it there is an entry in the cache with keywords that are in the new post,
          // Add the new post to the key's entry and update the cache
          if (cachedData) {
            const data = cachedPosts.parse(stringToJSON().parse(cachedData));
            data.push(newPost);

            await redis.set(key, JSON.stringify(data), "EX", ttl, "NX");
          }
        }
      });
      return {};
    }),
});
