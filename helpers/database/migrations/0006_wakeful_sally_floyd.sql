CREATE TABLE "organization_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "members_organizations" ADD COLUMN "status" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "members_organizations" ADD COLUMN "join_date" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "members_organizations" ADD COLUMN "role" varchar(50);--> statement-breakpoint
ALTER TABLE "organization_plans" ADD CONSTRAINT "organization_plans_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_plans" ADD CONSTRAINT "organization_plans_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN "join_date";--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN "role";