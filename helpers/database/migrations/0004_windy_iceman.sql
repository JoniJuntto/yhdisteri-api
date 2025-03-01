CREATE TABLE "members_organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "members" DROP CONSTRAINT "members_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "members_organizations" ADD CONSTRAINT "members_organizations_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members_organizations" ADD CONSTRAINT "members_organizations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN "organization_id";