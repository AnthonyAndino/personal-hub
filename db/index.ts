import { drizzle } from "drizzle-orm/sql-js"
import initSqlJs from "sql.js"
import * as schema from "./schema/index"
import { readFileSync, writeFileSync, existsSync } from "fs"

const DB_PATH = process.env.DB_URL || "./db/data.sqlite"

async function initDb() {
  const SQL = await initSqlJs()
  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH)
    return new SQL.Database(buffer)
  }
  return new SQL.Database()
}

const sqlite = await initDb()

function persistDb() {
  const data = sqlite.export()
  writeFileSync(DB_PATH, Buffer.from(data))
}

export const db = drizzle(sqlite, { schema })
export { schema, sqlite, persistDb }

