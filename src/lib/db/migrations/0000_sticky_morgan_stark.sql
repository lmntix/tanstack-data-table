CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE TYPE "public"."acc_type" AS ENUM('SAVINGS', 'CURRENT', 'FIXED', 'RECURRING');--> statement-breakpoint
CREATE TYPE "public"."account_primary_group" AS ENUM('INCOME', 'EXPENSE', 'ASSET', 'LIABILITY');--> statement-breakpoint
CREATE TYPE "public"."account_status" AS ENUM('OPEN', 'CLOSE', 'SUSPENDED');--> statement-breakpoint
CREATE TYPE "public"."account_type" AS ENUM('TRAVEL', 'OFFICE_SUPPLIES', 'SOFTWARE', 'RENT', 'INCOME', 'EQUIPMENT', 'INTERNET_AND_TELEPHONE', 'FACILITIES_EXPENSES', 'TAXES', 'CASH', 'SHARES', 'FEES', 'SAVINGS_DEPOSIT', 'RECURRING_DEPOSIT', 'RECURRING_DEPOSIT_INTEREST', 'FIXED_DEPOSIT', 'FIXED_DEPOSIT_INTEREST', 'LOAN', 'INVESTMENT', 'DIVIDEND_PAYABLE', 'SALARY', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."address_proof" AS ENUM('AADHAR_CARD', 'BANK_STATEMENT_PASS_BOOK', 'DOMESTIC_CERTIFICATE', 'DRIVING_LICENSE', 'ELECTRICITY_BILL', 'HOUSE_RENT_AGREEMENT', 'INCOME_TAX_CHALLAN', 'PASSPORT', 'RATION_CARD', 'RESIDENCY_PROOF_ANY_GOVT_OFFICE', 'TELEPHONE_BILL', 'VOTER_ID');--> statement-breakpoint
CREATE TYPE "public"."account_balance_type" AS ENUM('DEBIT', 'CREDIT', 'BOTH');--> statement-breakpoint
CREATE TYPE "public"."broken_period" AS ENUM('360_BASIS', '365_BASIS');--> statement-breakpoint
CREATE TYPE "public"."calendar_day_type" AS ENUM('WEEKLY_OFF', 'HOLIDAY');--> statement-breakpoint
CREATE TYPE "public"."compounding_frequency" AS ENUM('MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY');--> statement-breakpoint
CREATE TYPE "public"."fd_account_type" AS ENUM('REGULAR', 'SENIOR_CITIZEN', 'FEMALE', 'WIDOW', 'HANDICAPPED', 'EMPLOYEE', 'FREEDOM_FIGHTER');--> statement-breakpoint
CREATE TYPE "public"."fd_plan_type" AS ENUM('FIXED_DEPOSIT', 'DOUBLE_MONEY', 'CASH_CERTIFICATE', 'PENSION', 'CALL_DEPOSIT');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."identity_proof" AS ENUM('AADHAR_CARD', 'DRIVING_LICENSE', 'EMPLOYMENT_ID', 'PAN_CARD', 'PASSPORT', 'VOTER_ID');--> statement-breakpoint
CREATE TYPE "public"."interest_calculation_frequency" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY');--> statement-breakpoint
CREATE TYPE "public"."interest_type" AS ENUM('SIMPLE', 'COMPOUND');--> statement-breakpoint
CREATE TYPE "public"."loan_plan_type" AS ENUM('SECURED_LOAN', 'UNSECURED_LOAN', 'MEMBER_LOAN', 'DEPOSIT_LOAN', 'RECURRING_LOAN', 'NON_REFUNDABLE_LOAN', 'CASH_CREDIT_LOAN', 'DAILY_LOAN', 'IN_DAYS');--> statement-breakpoint
CREATE TYPE "public"."member_status" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED');--> statement-breakpoint
CREATE TYPE "public"."month" AS ENUM('JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER');--> statement-breakpoint
CREATE TYPE "public"."occupation" AS ENUM('SERVICE_PROFESSIONAL', 'GENERAL_JOB', 'OTHER', 'HOMEMAKER', 'BUSINESS_OWNER', 'EX_SERVICEPERSON', 'ADVOCATE', 'STUDENT', 'DOCTOR', 'TEACHER', 'UNEMPLOYED');--> statement-breakpoint
CREATE TYPE "public"."prefix" AS ENUM('Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Shrimati', 'Shri');--> statement-breakpoint
CREATE TYPE "public"."relation" AS ENUM('Wife', 'Husband', 'Daughter', 'Son', 'Mother', 'Father', 'Brother', 'Sister', 'Self', 'Uncle', 'Other');--> statement-breakpoint
CREATE TYPE "public"."tenure_type" AS ENUM('DAYS', 'MONTHS', 'YEARS');--> statement-breakpoint
CREATE TYPE "public"."transaction_mode" AS ENUM('CASH', 'UPI', 'CHEQUE', 'BANK_TRANSFER', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."voucher_master" AS ENUM('OPENING_BALANCE', 'CREDIT', 'DEBIT', 'JOURNAL_VOUCHER', 'CONTRA');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_type" "account_type" NOT NULL,
	"balance_type" "account_balance_type" NOT NULL,
	"name" text NOT NULL,
	"status" "account_status" DEFAULT 'OPEN' NOT NULL,
	"memberwise_account" boolean NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "bank_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sub_accounts_id" uuid,
	"name" text,
	"acc_no" text,
	"branch" text,
	"address" text,
	"acc_type" "acc_type" DEFAULT 'SAVINGS' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "calender" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"financial_years_id" uuid NOT NULL,
	"month" "month" NOT NULL,
	"day_type" "calendar_day_type",
	"day_end" boolean DEFAULT false NOT NULL,
	"current_day" boolean DEFAULT false NOT NULL,
	"description" text,
	CONSTRAINT "unique_current_day_per_fy" UNIQUE("financial_years_id","current_day")
);
--> statement-breakpoint
CREATE TABLE "fd_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sub_accounts_id" uuid NOT NULL,
	"fd_plans_id" uuid NOT NULL,
	"members_id" uuid NOT NULL,
	"tenure_months" numeric DEFAULT 0 NOT NULL,
	"tenure_days" numeric DEFAULT 0 NOT NULL,
	"fd_amount" numeric(10, 2) NOT NULL,
	"open_date" date NOT NULL,
	"interest_start_date" date NOT NULL,
	"interest_rate" numeric(10, 2) NOT NULL,
	"maturity_date" date NOT NULL,
	"maturity_amount" numeric(10, 2) NOT NULL,
	"receipt_no" text NOT NULL,
	"receipt_date" date NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"discounted_interest_rate" numeric(10, 2),
	"account_type" "fd_account_type" DEFAULT 'REGULAR' NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1,
	CONSTRAINT "unique_receipt_no" UNIQUE("receipt_no","organization_id"),
	CONSTRAINT "tenure_months_positive" CHECK ("fd_accounts"."tenure_months" >= 0),
	CONSTRAINT "tenure_days_positive" CHECK ("fd_accounts"."tenure_days" >= 0)
);
--> statement-breakpoint
CREATE TABLE "fd_interest_post" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sub_accounts_id" uuid NOT NULL,
	"transaction_head_id" uuid,
	"amount" numeric(10, 2) NOT NULL,
	"int_date" date NOT NULL,
	"rate" numeric(10, 2) NOT NULL,
	"posted" boolean DEFAULT false NOT NULL,
	"changed_manually" boolean DEFAULT false NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "fd_interest_rate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fd_plans_id" uuid NOT NULL,
	"tenure" numeric NOT NULL,
	"tenure_type" "tenure_type" NOT NULL,
	"int_rate" numeric(10, 2) NOT NULL,
	"end_date" date NOT NULL,
	"organization_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fd_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accounts_id" uuid NOT NULL,
	"type" "fd_plan_type" NOT NULL,
	"name" text NOT NULL,
	"multiplier" smallint DEFAULT 0 NOT NULL,
	"interest_type" "interest_type" DEFAULT 'SIMPLE' NOT NULL,
	"compounding_frequency" "compounding_frequency" NOT NULL,
	"return_amt_by" smallint NOT NULL,
	"auto_renewal" boolean DEFAULT false NOT NULL,
	"open_ended" boolean DEFAULT false NOT NULL,
	"status" "account_status" DEFAULT 'OPEN' NOT NULL,
	"broken_period" "broken_period" DEFAULT '360_BASIS' NOT NULL,
	"int_rate_snr_citizen" numeric(10, 2),
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "financial_years" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"locked" boolean DEFAULT false,
	"is_active" boolean DEFAULT false,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1,
	CONSTRAINT "unique_active_org_year" UNIQUE("organization_id","is_active")
);
--> statement-breakpoint
CREATE TABLE "auth"."invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"team_id" uuid,
	"status" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"organization_id" uuid NOT NULL,
	"inviter_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "member_address" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"present_address" text,
	"present_pin" numeric,
	"present_telephone" text,
	"present_mobile" numeric,
	"permanent_address" text,
	"permanent_pin" numeric,
	"permanent_telephone" text,
	"permanent_mobile" numeric,
	"is_same_address" boolean DEFAULT false NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "member_kyc_document" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"members_id" uuid NOT NULL,
	"identity_proof" "identity_proof",
	"address_proof" "address_proof",
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_no" numeric NOT NULL,
	"occupation" "occupation",
	"application_date" date DEFAULT now(),
	"prefix" "prefix",
	"full_name" text NOT NULL,
	"gender" "gender",
	"birth_date" date,
	"pan_no" text,
	"adhaar_id" text,
	"photo" text,
	"sign" text,
	"email" text,
	"mobile" text,
	"status" "member_status" DEFAULT 'ACTIVE' NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1,
	CONSTRAINT "unique_member_no_org" UNIQUE("member_no","organization_id")
);
--> statement-breakpoint
CREATE TABLE "nominee" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sub_accounts_id" uuid,
	"relation" "relation",
	"prefix" "prefix",
	"full_name" text,
	"age" smallint,
	"address" text,
	"nomination_date" date,
	"shares_percentage" numeric(10, 2),
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1,
	CONSTRAINT "age_non_negative" CHECK ("nominee"."age" > 0),
	CONSTRAINT "age_reasonable" CHECK ("nominee"."age" <= 150)
);
--> statement-breakpoint
CREATE TABLE "org_branches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address" text,
	"reg_no" text,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "auth"."org_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"team_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text,
	"logo" text,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "recurring_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sub_accounts_id" uuid NOT NULL,
	"recurring_plans_id" uuid NOT NULL,
	"members_id" uuid NOT NULL,
	"open_date" date NOT NULL,
	"monthly_amount" numeric(10, 2) NOT NULL,
	"period" numeric NOT NULL,
	"interest_rate" numeric(10, 2) NOT NULL,
	"maturity_date" date NOT NULL,
	"maturity_amount" numeric(10, 2) NOT NULL,
	"status" "account_status" DEFAULT 'OPEN' NOT NULL,
	"close_date" date,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1,
	CONSTRAINT "period_positive" CHECK ("recurring_accounts"."period" > 0)
);
--> statement-breakpoint
CREATE TABLE "recurring_interest_post" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sub_accounts_id" uuid NOT NULL,
	"transaction_head_id" uuid,
	"amount" numeric(10, 2) NOT NULL,
	"int_date" date NOT NULL,
	"rate" numeric(10, 2) NOT NULL,
	"posted" boolean DEFAULT false NOT NULL,
	"changed_manually" boolean DEFAULT false NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "recurring_interest_rate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recurring_plans_id" uuid NOT NULL,
	"tenure" numeric NOT NULL,
	"int_rate" numeric(10, 2) NOT NULL,
	"end_date" date NOT NULL,
	"is_active" boolean DEFAULT true,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "recurring_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accounts_id" uuid NOT NULL,
	"name" text NOT NULL,
	"open_ended" boolean DEFAULT false NOT NULL,
	"interest_type" "interest_type" DEFAULT 'SIMPLE' NOT NULL,
	"compounding_frequency" "compounding_frequency",
	"is_active" boolean DEFAULT true,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "saving_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sub_accounts_id" uuid NOT NULL,
	"saving_plans_id" uuid NOT NULL,
	"members_id" uuid NOT NULL,
	"open_date" date NOT NULL,
	"interest_rate" numeric(10, 2) NOT NULL,
	"status" "account_status" DEFAULT 'OPEN' NOT NULL,
	"close_date" date,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "saving_interest_post" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sub_accounts_id" uuid NOT NULL,
	"transaction_head_id" uuid,
	"amount" numeric(10, 2) NOT NULL,
	"int_date" date NOT NULL,
	"rate" numeric(10, 2) NOT NULL,
	"posted" boolean DEFAULT false NOT NULL,
	"changed_manually" boolean DEFAULT false NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "saving_interest_rate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"saving_plans_id" uuid NOT NULL,
	"int_rate" numeric(10, 2) NOT NULL,
	"end_date" date NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"organization_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saving_joint_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"saving_accounts_id" uuid NOT NULL,
	"members_id" uuid NOT NULL,
	"minor" boolean NOT NULL,
	"organization_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saving_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accounts_id" uuid NOT NULL,
	"name" text NOT NULL,
	"min_balance" numeric(10, 2) NOT NULL,
	"max_withdrawal" numeric(10, 2) NOT NULL,
	"min_withdrawal" numeric(10, 2) NOT NULL,
	"max_deposit" numeric(10, 2) NOT NULL,
	"min_deposit" numeric(10, 2) NOT NULL,
	"interest_calc_frequency" "interest_calculation_frequency" DEFAULT 'DAILY' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "auth"."sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	"active_organization_id" uuid,
	"impersonated_by" uuid,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "sub_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accounts_id" uuid,
	"members_id" uuid,
	"sub_account_no" text,
	"status" "account_status" DEFAULT 'OPEN' NOT NULL,
	"balance" numeric(10, 2),
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1,
	CONSTRAINT "unique_sub_account_no" UNIQUE("sub_account_no","organization_id")
);
--> statement-breakpoint
CREATE TABLE "transaction_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_head_id" uuid NOT NULL,
	"accounts_id" uuid NOT NULL,
	"sub_accounts_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "transaction_head" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"financial_years_id" uuid NOT NULL,
	"branch_id" uuid,
	"voucher_master" "voucher_master" NOT NULL,
	"voucher_no" text NOT NULL,
	"date" date NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"narration" text,
	"mode" "transaction_mode",
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"version" bigint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "auth"."accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text
);
--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"version" bigint DEFAULT 1,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "auth"."verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fd_accounts" ADD CONSTRAINT "fd_accounts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fd_interest_post" ADD CONSTRAINT "fd_interest_post_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fd_interest_rate" ADD CONSTRAINT "fd_interest_rate_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fd_plans" ADD CONSTRAINT "fd_plans_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_years" ADD CONSTRAINT "financial_years_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."invitations" ADD CONSTRAINT "invitations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."invitations" ADD CONSTRAINT "invitations_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_address" ADD CONSTRAINT "member_address_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_kyc_document" ADD CONSTRAINT "member_kyc_document_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nominee" ADD CONSTRAINT "nominee_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."org_members" ADD CONSTRAINT "org_members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."org_members" ADD CONSTRAINT "org_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "recurring_accounts" ADD CONSTRAINT "recurring_accounts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_interest_post" ADD CONSTRAINT "recurring_interest_post_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_interest_rate" ADD CONSTRAINT "recurring_interest_rate_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_plans" ADD CONSTRAINT "recurring_plans_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saving_accounts" ADD CONSTRAINT "saving_accounts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saving_interest_post" ADD CONSTRAINT "saving_interest_post_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saving_interest_rate" ADD CONSTRAINT "saving_interest_rate_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saving_joint_accounts" ADD CONSTRAINT "saving_joint_accounts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saving_plans" ADD CONSTRAINT "saving_plans_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_accounts" ADD CONSTRAINT "sub_accounts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_details" ADD CONSTRAINT "transaction_details_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_head" ADD CONSTRAINT "transaction_head_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;