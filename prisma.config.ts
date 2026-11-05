import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config({ path: "./prisma/.env" });

const databaseUrl = process.env.DATABASE_URL;

export default defineConfig({
  schema: "./prisma/schema.prisma",
  ...(databaseUrl ? { datasource: { url: databaseUrl } } : {}),
  migrations: {
    seed: "node prisma/seed.ts",
  },
});
