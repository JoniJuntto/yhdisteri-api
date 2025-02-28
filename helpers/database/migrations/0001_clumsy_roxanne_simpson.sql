ALTER TABLE "organizations" ADD COLUMN "code" varchar(6) NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_code_unique" UNIQUE("code");