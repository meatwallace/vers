DO $$ BEGIN
 CREATE TYPE "archetype" AS ENUM('Steampunk', 'Dieselpunk', 'Cyberpunk');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "atmosphere" AS ENUM('Dark', 'Neutral', 'Light');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "fantasy_type" AS ENUM('Low', 'Medium', 'High');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "geography_features" AS ENUM('Deserts', 'Forest', 'Mountains', 'Plains', 'Swamps', 'Tundra');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "geography_type" AS ENUM('Supercontinent', 'Continents', 'Islands', 'Archipelago');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "population" AS ENUM('Sparse', 'Average', 'Dense');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "technology_level" AS ENUM('Ancient', 'Medieval', 'Modern', 'Futuristic');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "worlds" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"fantasy_type" "fantasy_type" NOT NULL,
	"technology_level" "technology_level" NOT NULL,
	"archetype" "archetype",
	"atmosphere" "atmosphere" NOT NULL,
	"population" "population" NOT NULL,
	"geography_type" "geography_type" NOT NULL,
	"geography_features" geography_features[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "worlds" ADD CONSTRAINT "worlds_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
