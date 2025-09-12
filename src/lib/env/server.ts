import { createEnv } from "@t3-oss/env-core"
import * as z from "zod"

export const env = createEnv({
  server: {
    VITE_APP_URL: z.string().url().default("http://localhost:3000"),
    BETTER_AUTH_SECRET: z.string().min(1),
    APP_URL: z.string().url(),
    NODE_ENV: z.string().default("development"),
    DATABASE_URL: z.string(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.string().transform((v) => Number.parseInt(v, 10)),
    SMTP_USER: z.string(),
    SMTP_PASS: z.string(),
    SMTP_FROM: z.string(),
    AXIOM_DATASET: z.string(),
    AXIOM_TOKEN: z.string()
  },
  runtimeEnv: process.env,

  emptyStringAsUndefined: true,
  onValidationError(issues) {
    console.error("❌ Invalid environment variables:", issues)
    throw new Error("Invalid environment variables")
  },
  onInvalidAccess(variable) {
    throw new Error(`❌ Attempted to access a server-side environment variable on the client: ${variable}`)
  }
})

export type EnvSchema = typeof env
