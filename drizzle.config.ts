import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  out: "./src/lib/db/migrations",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  migrations: {
    table: "migrations",
    schema: "drizzle"
  },
  verbose: true,
  strict: true
})
