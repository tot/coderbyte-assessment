import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";

export default function Page({
  post,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { title, author, createdAt, content } = post;

  return (
    <>
      <Head>
        <title>Blog App</title>
        <meta name="description" content="Search through my blog!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col p-4 py-24">
        <div className="pb-10">
          <h1 className="text-4xl font-extrabold">{title}</h1>
          <h2 className="pt-2 text-lg font-medium">
            Written by {author} on {format(createdAt, "MMM dd, yyyy")}
          </h2>
        </div>

        <p className="leading-7">{content}</p>
        <div className="py-10">
          <Link href="/">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>To home page</span>
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { params } = ctx;

  if (!params)
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };

  const { slug } = params;

  // Get the post from the database
  const post = await db.post.findUnique({
    where: {
      slug: slug as string,
    },
  });

  if (!post)
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };

  return {
    props: {
      post,
    },
  };
}
