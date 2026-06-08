-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "public"."AuthProvider" AS ENUM ('GOOGLE', 'CREDENTIALS');

-- CreateEnum
CREATE TYPE "public"."VerificationTokenType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'MAGIC_LINK');

-- CreateEnum
CREATE TYPE "public"."FinancialAccountType" AS ENUM ('CHECKING', 'SAVINGS', 'CASH', 'DIGITAL_WALLET', 'CREDIT_CARD', 'INVESTMENT');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('INCOME', 'EXPENSE', 'DEBT_PAYMENT', 'TRANSFER', 'SUBSCRIPTION_PAYMENT', 'GOAL_CONTRIBUTION', 'LOAN_GIVEN', 'LOAN_REPAYMENT', 'CREDIT_CARD_PAYMENT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "public"."TransactionEntryDirection" AS ENUM ('IN', 'OUT');

-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('COMPLETED', 'PENDING', 'SCHEDULED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."BucketType" AS ENUM ('FREE', 'COMMITTED', 'EMERGENCY', 'GOAL', 'DEBT', 'SUBSCRIPTION', 'CAREER');

-- CreateEnum
CREATE TYPE "public"."DebtType" AS ENUM ('PERSONAL_LOAN', 'AUTO_LOAN', 'MORTGAGE', 'INSTALLMENT_PURCHASE', 'BNPL', 'STORE_CREDIT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."DebtStatus" AS ENUM ('ACTIVE', 'PAID_OFF', 'PAUSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."PaymentFrequency" AS ENUM ('ONE_TIME', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'BIMONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "public"."ScheduledPaymentStatus" AS ENUM ('PENDING', 'PAID', 'SKIPPED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."SubscriptionCategory" AS ENUM ('ENTERTAINMENT', 'PRODUCTIVITY', 'CAREER', 'SOFTWARE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."GoalCategory" AS ENUM ('EMERGENCY', 'TECH', 'TRAVEL', 'CAREER', 'VEHICLE', 'LIFESTYLE', 'PET', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."GoalStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."LoanGivenStatus" AS ENUM ('ACTIVE', 'PARTIALLY_REPAID', 'PAID', 'OVERDUE', 'WRITTEN_OFF');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('SUBSCRIPTION_DUE', 'DEBT_DUE', 'CREDIT_CARD_DUE', 'CREDIT_CARD_CUTOFF', 'LOAN_GIVEN_DUE', 'SCHEDULED_PAYMENT_DUE', 'LOW_BALANCE', 'GOAL_PROGRESS', 'SYSTEM');

-- CreateEnum
CREATE TYPE "public"."NotificationStatus" AS ENUM ('SCHEDULED', 'SENT', 'READ', 'DISMISSED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'PUSH');

-- CreateEnum
CREATE TYPE "public"."NotificationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."NotificationEntityType" AS ENUM ('SUBSCRIPTION', 'DEBT', 'FINANCIAL_ACCOUNT', 'LOAN_GIVEN', 'SCHEDULED_PAYMENT', 'GOAL');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "defaultCurrency" TEXT NOT NULL DEFAULT 'MXN',
    "timezone" TEXT NOT NULL DEFAULT 'America/Mexico_City',
    "locale" TEXT NOT NULL DEFAULT 'es-MX',
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_credentials" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "passwordUpdatedAt" TIMESTAMP(3),
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "public"."AuthProvider" NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "tokenType" TEXT,
    "scope" TEXT,
    "idToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "type" "public"."VerificationTokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."financial_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."FinancialAccountType" NOT NULL,
    "initialBalance" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currentBalance" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "creditLimit" DECIMAL(14,2),
    "statementDay" INTEGER,
    "paymentDueDay" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "status" "public"."TransactionStatus" NOT NULL DEFAULT 'COMPLETED',
    "notes" TEXT,
    "debtId" TEXT,
    "subscriptionId" TEXT,
    "goalId" TEXT,
    "loanGivenId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transaction_entries" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "financialAccountId" TEXT NOT NULL,
    "direction" "public"."TransactionEntryDirection" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."buckets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."BucketType" NOT NULL,
    "targetAmount" DECIMAL(14,2),
    "currentAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isProtected" BOOLEAN NOT NULL DEFAULT false,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buckets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bucket_allocations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bucketId" TEXT NOT NULL,
    "financialAccountId" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bucket_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."debts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "linkedFinancialAccountId" TEXT,
    "name" TEXT NOT NULL,
    "type" "public"."DebtType" NOT NULL,
    "originalAmount" DECIMAL(14,2) NOT NULL,
    "currentBalance" DECIMAL(14,2) NOT NULL,
    "monthlyPayment" DECIMAL(14,2),
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "dueDay" INTEGER,
    "dueDate" TIMESTAMP(3),
    "interestRate" DECIMAL(5,2),
    "installmentsTotal" INTEGER,
    "installmentsPaid" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."DebtStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "debts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."scheduled_payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentFinancialAccountId" TEXT,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "frequency" "public"."PaymentFrequency" NOT NULL DEFAULT 'ONE_TIME',
    "category" TEXT,
    "status" "public"."ScheduledPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "linkedDebtId" TEXT,
    "linkedSubscriptionId" TEXT,
    "linkedLoanGivenId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduled_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentFinancialAccountId" TEXT,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "billingDay" INTEGER NOT NULL,
    "frequency" "public"."PaymentFrequency" NOT NULL DEFAULT 'MONTHLY',
    "category" "public"."SubscriptionCategory" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "public"."GoalCategory" NOT NULL,
    "targetAmount" DECIMAL(14,2) NOT NULL,
    "currentAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "targetDate" TIMESTAMP(3),
    "status" "public"."GoalStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."loans_given" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "borrowerName" TEXT NOT NULL,
    "borrowerContact" TEXT,
    "principalAmount" DECIMAL(14,2) NOT NULL,
    "amountRepaid" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "expectedReturnDate" TIMESTAMP(3),
    "status" "public"."LoanGivenStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loans_given_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
    "defaultDaysBeforeDue" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "status" "public"."NotificationStatus" NOT NULL DEFAULT 'SCHEDULED',
    "channel" "public"."NotificationChannel" NOT NULL DEFAULT 'IN_APP',
    "priority" "public"."NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "dismissedAt" TIMESTAMP(3),
    "relatedEntityType" "public"."NotificationEntityType",
    "relatedEntityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_credentials_userId_key" ON "public"."user_credentials"("userId");

-- CreateIndex
CREATE INDEX "user_credentials_userId_idx" ON "public"."user_credentials"("userId");

-- CreateIndex
CREATE INDEX "auth_accounts_userId_idx" ON "public"."auth_accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_accounts_provider_providerAccountId_key" ON "public"."auth_accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshTokenHash_key" ON "public"."sessions"("refreshTokenHash");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "public"."sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "public"."sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "sessions_revokedAt_idx" ON "public"."sessions"("revokedAt");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_tokenHash_key" ON "public"."verification_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "verification_tokens_email_idx" ON "public"."verification_tokens"("email");

-- CreateIndex
CREATE INDEX "verification_tokens_tokenHash_idx" ON "public"."verification_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "verification_tokens_expiresAt_idx" ON "public"."verification_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "financial_accounts_userId_idx" ON "public"."financial_accounts"("userId");

-- CreateIndex
CREATE INDEX "financial_accounts_userId_isActive_idx" ON "public"."financial_accounts"("userId", "isActive");

-- CreateIndex
CREATE INDEX "financial_accounts_userId_type_idx" ON "public"."financial_accounts"("userId", "type");

-- CreateIndex
CREATE INDEX "transactions_userId_date_idx" ON "public"."transactions"("userId", "date");

-- CreateIndex
CREATE INDEX "transactions_userId_type_idx" ON "public"."transactions"("userId", "type");

-- CreateIndex
CREATE INDEX "transactions_debtId_idx" ON "public"."transactions"("debtId");

-- CreateIndex
CREATE INDEX "transactions_subscriptionId_idx" ON "public"."transactions"("subscriptionId");

-- CreateIndex
CREATE INDEX "transactions_goalId_idx" ON "public"."transactions"("goalId");

-- CreateIndex
CREATE INDEX "transactions_loanGivenId_idx" ON "public"."transactions"("loanGivenId");

-- CreateIndex
CREATE INDEX "transaction_entries_transactionId_idx" ON "public"."transaction_entries"("transactionId");

-- CreateIndex
CREATE INDEX "transaction_entries_financialAccountId_idx" ON "public"."transaction_entries"("financialAccountId");

-- CreateIndex
CREATE INDEX "buckets_userId_idx" ON "public"."buckets"("userId");

-- CreateIndex
CREATE INDEX "buckets_userId_type_idx" ON "public"."buckets"("userId", "type");

-- CreateIndex
CREATE INDEX "bucket_allocations_userId_idx" ON "public"."bucket_allocations"("userId");

-- CreateIndex
CREATE INDEX "bucket_allocations_financialAccountId_idx" ON "public"."bucket_allocations"("financialAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "bucket_allocations_bucketId_financialAccountId_key" ON "public"."bucket_allocations"("bucketId", "financialAccountId");

-- CreateIndex
CREATE INDEX "debts_userId_idx" ON "public"."debts"("userId");

-- CreateIndex
CREATE INDEX "debts_userId_status_idx" ON "public"."debts"("userId", "status");

-- CreateIndex
CREATE INDEX "debts_linkedFinancialAccountId_idx" ON "public"."debts"("linkedFinancialAccountId");

-- CreateIndex
CREATE INDEX "scheduled_payments_userId_dueDate_idx" ON "public"."scheduled_payments"("userId", "dueDate");

-- CreateIndex
CREATE INDEX "scheduled_payments_userId_status_idx" ON "public"."scheduled_payments"("userId", "status");

-- CreateIndex
CREATE INDEX "scheduled_payments_paymentFinancialAccountId_idx" ON "public"."scheduled_payments"("paymentFinancialAccountId");

-- CreateIndex
CREATE INDEX "scheduled_payments_linkedDebtId_idx" ON "public"."scheduled_payments"("linkedDebtId");

-- CreateIndex
CREATE INDEX "scheduled_payments_linkedSubscriptionId_idx" ON "public"."scheduled_payments"("linkedSubscriptionId");

-- CreateIndex
CREATE INDEX "scheduled_payments_linkedLoanGivenId_idx" ON "public"."scheduled_payments"("linkedLoanGivenId");

-- CreateIndex
CREATE INDEX "subscriptions_userId_idx" ON "public"."subscriptions"("userId");

-- CreateIndex
CREATE INDEX "subscriptions_userId_isActive_idx" ON "public"."subscriptions"("userId", "isActive");

-- CreateIndex
CREATE INDEX "subscriptions_paymentFinancialAccountId_idx" ON "public"."subscriptions"("paymentFinancialAccountId");

-- CreateIndex
CREATE INDEX "goals_userId_idx" ON "public"."goals"("userId");

-- CreateIndex
CREATE INDEX "goals_userId_status_idx" ON "public"."goals"("userId", "status");

-- CreateIndex
CREATE INDEX "loans_given_userId_idx" ON "public"."loans_given"("userId");

-- CreateIndex
CREATE INDEX "loans_given_userId_status_idx" ON "public"."loans_given"("userId", "status");

-- CreateIndex
CREATE INDEX "loans_given_userId_expectedReturnDate_idx" ON "public"."loans_given"("userId", "expectedReturnDate");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_key" ON "public"."notification_preferences"("userId");

-- CreateIndex
CREATE INDEX "notification_preferences_userId_idx" ON "public"."notification_preferences"("userId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "public"."notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_userId_status_idx" ON "public"."notifications"("userId", "status");

-- CreateIndex
CREATE INDEX "notifications_userId_scheduledFor_idx" ON "public"."notifications"("userId", "scheduledFor");

-- CreateIndex
CREATE INDEX "notifications_relatedEntityType_relatedEntityId_idx" ON "public"."notifications"("relatedEntityType", "relatedEntityId");

-- AddForeignKey
ALTER TABLE "public"."user_credentials" ADD CONSTRAINT "user_credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."auth_accounts" ADD CONSTRAINT "auth_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."verification_tokens" ADD CONSTRAINT "verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."financial_accounts" ADD CONSTRAINT "financial_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "public"."debts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "public"."goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_loanGivenId_fkey" FOREIGN KEY ("loanGivenId") REFERENCES "public"."loans_given"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transaction_entries" ADD CONSTRAINT "transaction_entries_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transaction_entries" ADD CONSTRAINT "transaction_entries_financialAccountId_fkey" FOREIGN KEY ("financialAccountId") REFERENCES "public"."financial_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."buckets" ADD CONSTRAINT "buckets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bucket_allocations" ADD CONSTRAINT "bucket_allocations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bucket_allocations" ADD CONSTRAINT "bucket_allocations_bucketId_fkey" FOREIGN KEY ("bucketId") REFERENCES "public"."buckets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bucket_allocations" ADD CONSTRAINT "bucket_allocations_financialAccountId_fkey" FOREIGN KEY ("financialAccountId") REFERENCES "public"."financial_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."debts" ADD CONSTRAINT "debts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."debts" ADD CONSTRAINT "debts_linkedFinancialAccountId_fkey" FOREIGN KEY ("linkedFinancialAccountId") REFERENCES "public"."financial_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scheduled_payments" ADD CONSTRAINT "scheduled_payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scheduled_payments" ADD CONSTRAINT "scheduled_payments_paymentFinancialAccountId_fkey" FOREIGN KEY ("paymentFinancialAccountId") REFERENCES "public"."financial_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scheduled_payments" ADD CONSTRAINT "scheduled_payments_linkedDebtId_fkey" FOREIGN KEY ("linkedDebtId") REFERENCES "public"."debts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scheduled_payments" ADD CONSTRAINT "scheduled_payments_linkedSubscriptionId_fkey" FOREIGN KEY ("linkedSubscriptionId") REFERENCES "public"."subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scheduled_payments" ADD CONSTRAINT "scheduled_payments_linkedLoanGivenId_fkey" FOREIGN KEY ("linkedLoanGivenId") REFERENCES "public"."loans_given"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_paymentFinancialAccountId_fkey" FOREIGN KEY ("paymentFinancialAccountId") REFERENCES "public"."financial_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."goals" ADD CONSTRAINT "goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."loans_given" ADD CONSTRAINT "loans_given_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
