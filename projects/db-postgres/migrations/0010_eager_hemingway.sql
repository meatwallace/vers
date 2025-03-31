CREATE TABLE "characters" (
	"id" text PRIMARY KEY NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;