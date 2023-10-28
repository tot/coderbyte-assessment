import { db } from "~/server/db";

async function reset() {
  console.info(`[${new Date().toLocaleTimeString()}] Resetting database...`);
  console.info(`[${new Date().toLocaleTimeString()}] Done resetting database!`);
}

async function main() {
  const testAuthor = await db.author.create({
    data: {
      name: "Johnny",
    },
  });

  console.info(
    `[${new Date().toLocaleTimeString()}] Created new user: `,
    testAuthor,
  );
}

reset()
  .then(async () => {
    await main();
  })
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
