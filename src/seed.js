// @ts-check

import Database from "better-sqlite3";
import esMain from "es-main";

import { readFileSync } from "fs";
export async function seed() {
  const sqlite = new Database(":memory:");

  sqlite.exec(readFileSync("src/products.sql", "utf8"));
  await sqlite.backup("src/products.db");
}

export function wipe() {
  const sqlite = new Database("src/products.db");
  sqlite.prepare("DELETE FROM products").run();
  sqlite.close();
}

if (esMain(import.meta)) {
  await seed();
}