import { z } from "zod";

const cachedPosts = z.array(
  z.object({
    id: z.string(),
    author: z.string(),
    title: z.string(),
    content: z.string(),
    slug: z.string(),
    createdAt: z.string().pipe(z.coerce.date()),
    updatedAt: z.string().pipe(z.coerce.date()),
  }),
);

export { cachedPosts };
