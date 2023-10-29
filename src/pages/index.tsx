import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PostItem from "~/components/PostItem";
import ResultsCount from "~/components/ResultsCount";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

const formSchema = z.object({
  keywords: z.string().min(4, {
    message: "Search term must be at least 4 characters.",
  }),
});

export default function Home() {
  const [search, setSearch] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keywords: "",
    },
  });

  const {
    data,
    isFetched,
    status,
    refetch: getPosts,
  } = api.post.search.useQuery(
    { keywords: search },
    {
      enabled: false,
    },
  );

  // Hacky fix to update search before calling query
  const updateSearch = async (val: string) => setSearch(val.trim());

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Need to await for the search value to update before fetching posts
    await updateSearch(values.keywords);
    await getPosts();
    form.reset();
  };

  const length = data?.results.length ?? 0;

  return (
    <>
      <Head>
        <title>Blog App</title>
        <meta name="description" content="Search through my blog!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col p-4">
        <div className="container flex justify-center gap-12 px-4 py-16">
          <h1 className="text-4xl font-extrabold">DictateMD Blog</h1>
        </div>
        <section className="grid-re grid grid-cols-5 gap-8 py-10 md:gap-16">
          {/* Search bar */}
          <div className="col-span-5 md:col-span-3">
            <h2 className="pb-10 text-2xl font-bold">Search</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full items-end gap-2"
              >
                <div className="relative w-full">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="keywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                className=""
                                placeholder="Search for a blog post"
                                {...field}
                              />
                              {search && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSearch("");
                                  }}
                                  className="absolute right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-400"
                                >
                                  <X className="h-3 w-3 text-white" />
                                </button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <Button type="submit">Search</Button>
              </form>
            </Form>

            {/* Search results */}
            <div className="pt-5">
              {status === "success" && <ResultsCount count={length} />}
              <div className="grid grid-cols-1 divide-y divide-neutral-300 pt-5">
                {isFetched &&
                  data?.results.map((post) => (
                    <PostItem key={post.id} {...post} keywords={search} />
                  ))}
              </div>
            </div>
          </div>
          <div className="order-first col-span-5 md:order-last md:col-span-2">
            <aside className="flex flex-col gap-6 rounded border-2 border-neutral-200 p-3 text-lg">
              <p className="">
                <span className="font-bold">dictatemd. </span>Unlock Data and
                Eliminate Inaccuracy. Have confidence with accurate medical
                notes with subspecialty-specific knowledge.
              </p>
              <Link href="/write">
                <Button>Add Post</Button>
              </Link>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
