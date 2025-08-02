PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`profileId` integer NOT NULL DEFAULT 0,
	`serverId` integer NOT NULL,
	`serverType` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_profiles`("id", "name", "serverId", "serverType") SELECT "id", "name", "serverId", "serverType" FROM `profiles`;--> statement-breakpoint
DROP TABLE `profiles`;--> statement-breakpoint
ALTER TABLE `__new_profiles` RENAME TO `profiles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;