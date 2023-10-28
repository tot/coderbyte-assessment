import { X } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import PostItem from "~/components/PostItem";
import { Input } from "~/components/ui/input";

import { api } from "~/utils/api";

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 100);

  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    console.log(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <>
      <Head>
        <title>Blog App</title>
        <meta name="description" content="Search through my blog!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col">
        <div className="container flex justify-center gap-12 px-4 py-16">
          <h1 className="text-4xl font-extrabold">My Blog App</h1>
        </div>
        <section className="grid grid-cols-5 gap-16 py-10">
          {/* Search bar */}
          <div className="col-span-3">
            <h2 className="pb-10 text-2xl font-bold">Search</h2>
            <div className="relative">
              <Input
                className=""
                placeholder="Search for a blog post"
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-400"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              )}
            </div>

            {/* Search results */}
            <div className="pt-5">
              {search && (
                <p className="">
                  <span className="font-bold">{count} posts</span> were found.
                </p>
              )}

              <div className="grid grid-cols-1 divide-neutral-300 pt-5">
                <PostItem />
                <PostItem />
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <aside className="rounded border-2 border-neutral-200 p-3 text-lg">
              <p className="">
                <span className="font-bold">dictatemd. </span>Unlock Data and
                Eliminate Inaccuracy. Have confidence with accurate medical
                notes with subspecialty-specific knowledge.
              </p>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
