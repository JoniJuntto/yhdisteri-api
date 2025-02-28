import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  boolean,
  timestamp,
  numeric,
  integer,
  json,
  foreignKey,
  primaryKey,
} from "drizzle-orm/pg-core";

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  street: varchar("street", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  zipCode: varchar("zip_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const OrganizationAddresses = pgTable("organization_addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id),
  street: varchar("street", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  zipCode: varchar("zip_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ORGANIZATION TABLES
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  paymentsActive: boolean("payments_active").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// MEMBER TABLES
export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  joinDate: date("join_date").notNull(),
  status: varchar("status", { length: 10 })
    .notNull()
    .$type<"active" | "inactive" | "pending" | "deleted" | "suspended">(),
  profileImageUrl: varchar("profile_image_url", { length: 255 }),
  role: varchar("role", { length: 50 }).$type<"admin" | "member" | "guest">(),
  lastActive: timestamp("last_active"),
  notes: text("notes"),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const memberRelations = relations(members, ({ one, many }) => ({
  address: one(addresses),
  membership: one(memberships),
  communicationPreferences: one(communicationPreferences),
  subscriptions: many(subscriptions),
  dataExportRequests: many(dataExportRequests),
  dataDeletionRequests: many(dataDeletionRequests),
  manualPayments: many(manualPayments),
}));

export const organizationRelations = relations(
  organizations,
  ({ one, many }) => ({
    address: one(OrganizationAddresses),
    members: many(members),
    gdprSettings: one(gdprSettings),
    plans: one(plans),
    subscriptions: one(subscriptions),
    invoices: many(invoices),
    manualPayments: many(manualPayments),
    dataExportRequests: many(dataExportRequests),
    dataDeletionRequests: many(dataDeletionRequests),
  })
);

export const memberships = pgTable("memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 20 })
    .notNull()
    .$type<"standard" | "premium" | "lifetime">(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  paymentStatus: varchar("payment_status", { length: 20 })
    .notNull()
    .$type<"paid" | "pending" | "overdue">(),
  autoRenew: boolean("auto_renew").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const communicationPreferences = pgTable("communication_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  email: boolean("email").notNull(),
  sms: boolean("sms").notNull(),
  push: boolean("push").notNull(),
  marketing: boolean("marketing").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// GDPR TABLES
export const gdprSettings = pgTable("gdpr_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  dataRetentionId: uuid("data_retention_id")
    .notNull()
    .references(() => dataRetentionPolicies.id),
  consentSettingsId: uuid("consent_settings_id")
    .notNull()
    .references(() => consentSettings.id),
  dataProtectionOfficerId: uuid("data_protection_officer_id")
    .notNull()
    .references(() => dataProtectionOfficers.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dataRetentionPolicies = pgTable("data_retention_policies", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberDataValue: integer("member_data_value"),
  memberDataUnit: varchar("member_data_unit", { length: 10 }).$type<
    "days" | "months" | "years" | null
  >(),
  memberDataIndefinite: boolean("member_data_indefinite").default(false),
  activityLogsValue: integer("activity_logs_value"),
  activityLogsUnit: varchar("activity_logs_unit", { length: 10 }).$type<
    "days" | "months" | "years" | null
  >(),
  activityLogsIndefinite: boolean("activity_logs_indefinite").default(false),
  communicationHistoryValue: integer("communication_history_value"),
  communicationHistoryUnit: varchar("communication_history_unit", {
    length: 10,
  }).$type<"days" | "months" | "years" | null>(),
  communicationHistoryIndefinite: boolean(
    "communication_history_indefinite"
  ).default(false),
  paymentInformationValue: integer("payment_information_value"),
  paymentInformationUnit: varchar("payment_information_unit", {
    length: 10,
  }).$type<"days" | "months" | "years" | null>(),
  paymentInformationIndefinite: boolean(
    "payment_information_indefinite"
  ).default(false),
  inactiveAccountsValue: integer("inactive_accounts_value"),
  inactiveAccountsUnit: varchar("inactive_accounts_unit", { length: 10 }).$type<
    "days" | "months" | "years" | null
  >(),
  inactiveAccountsIndefinite: boolean("inactive_accounts_indefinite").default(
    false
  ),
  automaticDeletion: boolean("automatic_deletion").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const consentSettings = pgTable("consent_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  requireExplicitConsent: boolean("require_explicit_consent").notNull(),
  allowConsentWithdrawal: boolean("allow_consent_withdrawal").notNull(),
  consentExpiryDays: integer("consent_expiry_days").notNull(),
  privacyPolicyUrl: varchar("privacy_policy_url", { length: 255 }).notNull(),
  lastPrivacyPolicyUpdate: date("last_privacy_policy_update").notNull(),
  notifyOnPolicyChanges: boolean("notify_on_policy_changes").notNull(),
  cookieConsentSettingsId: uuid("cookie_consent_settings_id")
    .notNull()
    .references(() => cookieConsentSettings.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cookieConsentSettings = pgTable("cookie_consent_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  requireCookieConsent: boolean("require_cookie_consent").notNull(),
  allowEssentialCookiesOnly: boolean("allow_essential_cookies_only").notNull(),
  cookieBannerEnabled: boolean("cookie_banner_enabled").notNull(),
  cookiePolicyUrl: varchar("cookie_policy_url", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dataProtectionOfficers = pgTable("data_protection_officers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dataExportRequests = pgTable("data_export_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id),
  memberName: varchar("member_name", { length: 255 }).notNull(),
  requestDate: date("request_date").notNull(),
  status: varchar("status", { length: 20 })
    .notNull()
    .$type<"pending" | "processing" | "completed" | "failed">(),
  dataFormat: varchar("data_format", { length: 10 })
    .notNull()
    .$type<"json" | "csv" | "pdf">(),
  includePersonalData: boolean("include_personal_data").notNull(),
  includeActivityLogs: boolean("include_activity_logs").notNull(),
  includePaymentHistory: boolean("include_payment_history").notNull(),
  completionDate: date("completion_date"),
  downloadUrl: varchar("download_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dataDeletionRequests = pgTable("data_deletion_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id),
  memberName: varchar("member_name", { length: 255 }).notNull(),
  requestDate: date("request_date").notNull(),
  status: varchar("status", { length: 20 })
    .notNull()
    .$type<"pending" | "processing" | "completed" | "rejected">(),
  reason: text("reason").notNull(),
  scheduledDeletionDate: date("scheduled_deletion_date"),
  completionDate: date("completion_date"),
  handledBy: varchar("handled_by", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// PAYMENT TABLES
export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  interval: varchar("interval", { length: 10 })
    .notNull()
    .$type<"month" | "year">(),
  features: json("features").$type<string[]>().notNull(),
  isPopular: boolean("is_popular").default(false),
  metadata: json("metadata").$type<Record<string, string>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id),
  status: varchar("status", { length: 20 })
    .notNull()
    .$type<"active" | "canceled" | "past_due" | "trialing" | "incomplete">(),
  currentPeriodStart: date("current_period_start").notNull(),
  currentPeriodEnd: date("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull(),
  canceledAt: timestamp("canceled_at"),
  endedAt: timestamp("ended_at"),
  trialStart: date("trial_start"),
  trialEnd: date("trial_end"),
  paymentMethod: varchar("payment_method", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  number: varchar("number", { length: 100 }).notNull(),
  date: date("date").notNull(),
  dueDate: date("due_date").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 })
    .notNull()
    .$type<
      | "paid"
      | "pending"
      | "overdue"
      | "draft"
      | "open"
      | "void"
      | "uncollectible"
    >(),
  currency: varchar("currency", { length: 3 }).notNull(),
  memberId: uuid("member_id").references(() => members.id),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id),
  invoiceNumber: varchar("invoice_number", { length: 100 }),
  invoiceDate: date("invoice_date"),
  pdf: varchar("pdf", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const invoiceItems = pgTable("invoice_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const invoiceLineItems = pgTable("invoice_line_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  periodStart: date("period_start"),
  periodEnd: date("period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const manualPayments = pgTable("manual_payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  status: varchar("status", { length: 20 })
    .notNull()
    .$type<"pending" | "completed" | "failed">(),
  description: text("description").notNull(),
  paymentDate: date("payment_date").notNull(),
  adminId: varchar("admin_id", { length: 255 }).notNull(),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
