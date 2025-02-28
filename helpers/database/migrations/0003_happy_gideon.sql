ALTER TABLE "members" ADD COLUMN "external_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_external_id_unique" UNIQUE("external_id");