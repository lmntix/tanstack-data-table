import { boolean, decimal, index, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

// Enums
export const transactionStatusEnum = pgEnum("transaction_status", ["pending", "completed", "failed", "cancelled"])
export const transactionTypeEnum = pgEnum("transaction_type", ["income", "expense", "transfer"])
export const paymentMethodEnum = pgEnum("payment_method", [
  "credit_card",
  "debit_card",
  "bank_transfer",
  "cash",
  "check",
  "digital_wallet"
])

// Transactions table schema
export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reference: varchar("reference", { length: 100 }).unique(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    type: transactionTypeEnum("type").notNull(),
    status: transactionStatusEnum("status").notNull().default("pending"),
    paymentMethod: paymentMethodEnum("payment_method"),
    counterpartyName: varchar("counterparty_name", { length: 255 }),
    counterpartyAccount: varchar("counterparty_account", { length: 100 }),
    categorySlug: varchar("category_slug", { length: 100 }),
    isRecurring: boolean("is_recurring").notNull().default(false),
    recurringFrequency: varchar("recurring_frequency", { length: 50 }),
    transactionDate: timestamp("transaction_date", { withTimezone: true }).notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    metadata: text("metadata"), // JSON string for additional data
    tags: varchar("tags", { length: 500 }), // Comma-separated tag slugs
    notes: text("notes"),
    isInternal: boolean("is_internal").notNull().default(false)
  },
  (table) => ({
    statusIdx: index("transactions_status_idx").on(table.status),
    typeIdx: index("transactions_type_idx").on(table.type),
    dateIdx: index("transactions_date_idx").on(table.transactionDate),
    categoryIdx: index("transactions_category_idx").on(table.categorySlug),
    amountIdx: index("transactions_amount_idx").on(table.amount)
  })
)
