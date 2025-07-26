CREATE TABLE `folders` (
	`id` integer PRIMARY KEY NOT NULL,
	`path` text NOT NULL,
	`serverId` integer NOT NULL,
	`serverType` text NOT NULL
);
