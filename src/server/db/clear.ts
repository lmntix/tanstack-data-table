import { sql } from "drizzle-orm"
import db from "./index"

const clearDatabase = async () => {
  try {
    console.log("Clearing database...")
    await db.execute(sql`DROP SCHEMA IF EXISTS auth CASCADE;`)
    console.log("SCHEMA: auth deleted successfully.")
    await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE;`)
    console.log("SCHEMA: public deleted successfully.")
    await db.execute(sql`DROP SCHEMA IF EXISTS drizzle CASCADE;`)
    console.log("SCHEMA: drizzle deleted successfully.")
    await db.execute(sql`CREATE SCHEMA public;`)
    console.log("SCHEMA: public recreated successfully.")
  } catch (error) {
    console.error("Error clearing database:", error)
  } finally {
    process.exit()
  }
}

clearDatabase()
