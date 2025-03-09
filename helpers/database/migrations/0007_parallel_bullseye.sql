ALTER TABLE "members" DROP CONSTRAINT "members_email_unique";--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "email" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "phone" DROP NOT NULL;