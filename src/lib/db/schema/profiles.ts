import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const profilesTable = sqliteTable("profiles", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  profileId: int().notNull(),
  serverId: int().notNull(),
  serverType: text().notNull(),
});

// Type exports
export type Profile = typeof profilesTable.$inferSelect;
export type NewProfile = typeof profilesTable.$inferInsert;
