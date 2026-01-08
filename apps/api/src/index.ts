import { assertEnv, env } from "./utils/env";
import { connectDb } from "./utils/db";
import { createApp } from "./app";

async function main() {
  assertEnv();
  await connectDb();

  const app = createApp();
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
