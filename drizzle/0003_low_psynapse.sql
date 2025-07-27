CREATE TABLE `servers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`serverId` integer NOT NULL,
	`name` text NOT NULL,
	`serverType` text NOT NULL,
	`is4k` integer,
	`isDefault` integer,
	`activeDirectory` text,
	`activeProfileId` integer,
	`active_tags` text,
	`activeAnimeProfileId` integer,
	`activeAnimeDirectory` text,
	`activeLanguageProfileId` integer,
	`activeAnimeLanguageProfileId` integer,
	`active_anime_tags` text,
	`profiles` text NOT NULL,
	`root_folders` text NOT NULL,
	`tags` text,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
DROP TABLE `folders`;--> statement-breakpoint
DROP TABLE `profiles`;