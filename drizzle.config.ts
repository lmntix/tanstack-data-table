import { defineConfig } from "drizzle-kit"
import { env } from "@/env/server"

export default defineConfig({
  schema: ["./src/server/db/schema.ts", "./src/server/db/enums.ts"],
  dialect: "postgresql",
  out: "./src/server/db/migrations",
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL
  },
  migrations: {
    table: "migrations",
    schema: "drizzle"
  },
  schemaFilter: ["public", "auth"],
  tablesFilter: ["*"],
  verbose: true,
  strict: true
})
