import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const product = sqliteTable("products", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	image_url: text("image_url"),
	deleted: integer("deleted", { mode: "boolean" }).default(0).notNull(),
});
