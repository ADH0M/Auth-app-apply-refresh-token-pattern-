import express, { type Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { env } from "./config/env";
import { notFoundHandler } from "./common/middleware/not-found";
import { errorHandler } from "./common/middleware/error-handler";
import { authRouter } from "./modules/auth/routes";

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  if (env.NODE_ENV !== "test") {
    app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
  }

  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ limit: "10kb", extended: false }));

  // routes
  app.get("/test", (req, res, next) => {
    res.json({ tst: "OK" });
  });

  app.use(`${env.API_PREFIX}/auth`,authRouter);

  //----------------------------------------
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
