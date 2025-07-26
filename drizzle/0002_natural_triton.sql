PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`profileId` integer NOT NULL,
	`serverId` integer NOT NULL,
	`serverType` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_profiles`("id", "name", "profileId", "serverId", "serverType") SELECT "id", "name", "profileId", "serverId", "serverType" FROM `profiles`;--> statement-breakpoint
DROP TABLE `profiles`;--> statement-breakpoint
ALTER TABLE `__new_profiles` RENAME TO `profiles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;