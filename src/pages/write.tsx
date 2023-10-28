import Head from "next/head";
import PostForm from "~/components/PostForm";

export default function Write() {
  return (
    <>
      <Head>
        <title>Blog App</title>
        <meta name="description" content="Search through my blog!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col p-4">
        <div className="container flex justify-center gap-12 px-4 py-16">
          <h1 className="text-4xl font-extrabold">Write an Article</h1>
        </div>
        <section className="gap-16 py-10">
          <div className="">
            <PostForm />
          </div>
        </section>
      </main>
    </>
  );
}
