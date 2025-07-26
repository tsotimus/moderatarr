import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const profilesTable = sqliteTable("profiles", {
  id: int().primaryKey(),
  name: text().notNull(),
//   profileId: int().notNull(),
  serverId: int().notNull(),
  serverType: text().notNull(),
});
