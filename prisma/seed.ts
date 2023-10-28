const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function reset() {
  console.info(`[${new Date().toLocaleTimeString()}] Resetting database...`);
  await prisma.post.deleteMany({});
  console.info(`[${new Date().toLocaleTimeString()}] Done resetting database!`);
}

async function main() {
  const testPost = await prisma.post.create({
    data: {
      title: "My First Blog Post",
      author: "Johnny Test",
      content:
        "Curabitur elementum massa mauris, et scelerisque enim mollis in. In venenatis magna lobortis, hendrerit magna eget, elementum erat. Fusce dignissim vestibulum nunc a condimentum. Aliquam rhoncus finibus finibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris congue leo lacinia nulla tristique, quis rhoncus quam rhoncus. Maecenas fringilla purus in venenatis mattis. Vestibulum pretium eros lacus, elementum aliquam est feugiat sit amet.",
      slug: "first-blog-post",
    },
  });

  console.info(
    `[${new Date().toLocaleTimeString()}] Created new post: `,
    testPost,
  );
}

reset()
  .then(async () => {
    await main();
  })
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
