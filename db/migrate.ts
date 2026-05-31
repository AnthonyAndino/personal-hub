import { migrate } from "drizzle-orm/sql-js/migrator"
import { db, persistDb } from "./index"

migrate(db, { migrationsFolder: "./db/migrations" })
persistDb()

console.log("Migration completed successfully")
