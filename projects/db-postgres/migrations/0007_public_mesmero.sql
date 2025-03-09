ALTER TABLE "verifications" ALTER COLUMN "expires_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "public"."verifications" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."verification_type";--> statement-breakpoint
CREATE TYPE "public"."verification_type" AS ENUM('2fa', '2fa-setup', 'onboarding', 'change-email');--> statement-breakpoint
ALTER TABLE "public"."verifications" ALTER COLUMN "type" SET DATA TYPE "public"."verification_type" USING "type"::"public"."verification_type";