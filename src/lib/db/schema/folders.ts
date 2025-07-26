import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const foldersTable = sqliteTable("folders", {
  id: int().primaryKey(),
  path: text().notNull(),
  serverId: int().notNull(),
  serverType: text().notNull(),
});

// Type exports
export type Folder = typeof foldersTable.$inferSelect;
export type NewFolder = typeof foldersTable.$inferInsert;
