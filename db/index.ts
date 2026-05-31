import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import * as schema from "./schema/index"

const sqlite = new Database(process.env.DB_URL || "./db/data.sqlite")
sqlite.pragma("journal_mode = WAL")
sqlite.pragma("foreign_keys = ON")

export const db = drizzle(sqlite, { shema })
export { schema}

