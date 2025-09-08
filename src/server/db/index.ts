import { drizzle } from "drizzle-orm/node-postgres"
import { env } from "@/env/server"
import * as schema from "./schema"

export const db = drizzle({
  connection: env.DATABASE_URL,
  casing: "snake_case",
  schema
})

export type db = typeof db

export default db
