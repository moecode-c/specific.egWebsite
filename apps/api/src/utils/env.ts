import dotenv from "dotenv";
import path from "path";

// Always load the API's .env regardless of where the process is started from.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
  MONGO_URI: process.env.MONGO_URI ?? "",
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:3000",
  SEED_ADMIN_NAME: process.env.SEED_ADMIN_NAME ?? "Admin",
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL ?? "admin@cases.com",
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD ?? "Admin12345!",
} as const;

export function assertEnv() {
  const missing: string[] = [];
  if (!env.MONGO_URI) missing.push("MONGO_URI");
  if (!env.JWT_SECRET) missing.push("JWT_SECRET");

  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}
