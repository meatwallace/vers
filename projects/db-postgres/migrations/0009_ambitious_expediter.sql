ALTER TABLE "sessions" ALTER COLUMN "refresh_token" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "verified" boolean DEFAULT false NOT NULL;