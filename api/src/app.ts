import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { checkJwt } from "./middleware/authz.middleware";
import morgan from "morgan";
import { getConfig } from "./common/config";
import healthchecksRouter from "./healthchecks";
import coursesRouter from "./courses/courses.router";
import usersRouter from "./users/users.router";
import utilityApiRouter from "./utility-api/utilityApiRouter.router";

const app = express();

/**
 * Middlewares
 */
app.use(morgan("dev"));
app.use(helmet());

app.use(
  cors({
    origin: {
      local: "http://localhost:3000",
      qa: "https://digital-lync.qa.konalms.com",
      staging: "https://digital-lync.staging.konalms.com",
      production: ["https://digital-lync.konalms.com"],
      dev: "https://digital-lync.dev.konalms.com",
    }[getConfig().MODE],
  })
);
app.use(express.json());

// Auth
// Keeping it before authentication middleware to get server status without having a access token
app.use("/", healthchecksRouter);
app.use(checkJwt);

// Routers
app.use("/courses", coursesRouter);
app.use("/users", usersRouter);
app.use("/utility-api", utilityApiRouter);

// Error and 404
app.use(errorHandler);
app.use(notFoundHandler);

export default app;
