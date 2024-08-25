DO $$ BEGIN
 CREATE TYPE "public"."file_type" AS ENUM('txt', 'md');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('FOLDER', 'FILE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"data" text,
	"is_completed" boolean,
	"is_important" boolean,
	"user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trees" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" "type" NOT NULL,
	"file_type" "file_type",
	"level" integer NOT NULL,
	"is_open" boolean NOT NULL,
	"parent_id" text,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
