import { int, sqliteTable, text, SQLiteTextJson } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const serversTable = sqliteTable("servers", {
  id: int().primaryKey({ autoIncrement: true }),
  serverId: int().notNull(),
  name: text().notNull(),
  serverType: text().notNull(), // "radarr" or "sonarr"
  is4k: int({ mode: 'boolean' }),
  isDefault: int({ mode: 'boolean' }),
  activeDirectory: text(),
  activeProfileId: int(),
  activeTags: text("active_tags", { mode: "json" }).$type<number[]>(), // JSON array of tag IDs
  profiles: text("profiles", { mode: "json" }).$type<ServerProfile[]>().notNull(), // JSON array of profile objects
  rootFolders: text("root_folders", { mode: "json" }).$type<ServerRootFolder[]>().notNull(), // JSON array of root folder objects
  tags: text("tags", { mode: "json" }).$type<ServerTag[]>(), // JSON array of tag objects
  updatedAt: int({ mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// Type exports
export type Server = typeof serversTable.$inferSelect;
export type NewServer = typeof serversTable.$inferInsert;

// Helper types for the JSON fields
export interface ServerProfile {
  id: number;
  name: string;
}

export interface ServerRootFolder {
  id: number;
  freeSpace: number;
  path: string;
}

export interface ServerTag {
  label: string;
  id: number;
}