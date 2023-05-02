import * as dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({
  path: path.join(__dirname, "..", "..", ".env"),
});

const configSchema = z.object({
  MODE: z.enum(["local", "production", "staging", "dev", "qa"]),
  PORT: z.string(),
  DATABASE_URL: z.string(),

  AUTH0_DOMAIN: z.string(),
  AUTH0_DEFAULT_DOMAIN: z.string(),
  AUTH0_API_AUDIENCE: z.string().url(),
  AUTH0_API_APP_RESOURCE_ID: z.string(),
  AUTH0_API_APP_IDENTIFIER: z.string().url(),
  AUTH0_MGMT_CLIENT_ID: z.string(),
  AUTH0_MGMT_CLIENT_SECRET: z.string(),
  AUTH0_FRONT_END_CLIENT_ID: z.string(),

  AZURE_STORAGE_BLOB_PUBLIC_CONTAINER_NAME: z.string(),
  AZURE_STORAGE_CONNECTION_STRING: z.string(),
  SENDGRID_API_KEY: z.string(),
});

export const getConfig = () => {
  const config = configSchema.parse(process.env);
  return config;
};
