import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const log = console.log.bind(console);
const main = async (): Promise<void> => {
  const app = createApp();
  const server = app.listen(env.PORT, () => {
    log(
      `The Application Api running on http://localhost:${env.PORT}${env.API_PREFIX} [${env.NODE_ENV}]`,
    );
  });

  // shotdown gracefully
  const shotdown = async function (signal: string) {
    log(`\n${signal} - recevied shoting down gracefully..`);
    server.close(async () => {
      log(`closed http server and database connenction successfully.`);
      await prisma.$disconnect();
      process.exit(0);
    });

    setTimeout(() => {
      log("Forcein exit after shotdown timeout");
      process.exit(1);
    }, 10_000).unref();
  };

  process.on("SIGINT", () => shotdown("SIGINT"));
  process.on("SIGTERM", () => shotdown("SIGTERM"));
};

main().catch((err) => {
  log("Fatal error while starting the server");
  log(err);
  process.exit(1);
});
