import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
const sqlite = new Database("src/products.db");
const db = drizzle(sqlite);
export { db };
