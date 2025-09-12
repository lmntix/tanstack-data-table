import { defineConfig } from "drizzle-kit"
import { env } from "@/lib/env/server"

export default defineConfig({
  schema: ["./src/lib/db/schema.ts", "./src/lib/db/enums.ts"],
  dialect: "postgresql",
  out: "./src/lib/db/migrations",
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
