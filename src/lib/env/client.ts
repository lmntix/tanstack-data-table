import { createEnv } from "@t3-oss/env-core"
import * as z from "zod"

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_APP_URL: z.string().url().default("http://localhost:3000")
  },
  runtimeEnv: import.meta.env,

  emptyStringAsUndefined: true,
  onValidationError(issues) {
    console.error("❌ Invalid environment variables:", issues)
    throw new Error("Invalid environment variables")
  }
})

export type EnvSchema = typeof env
