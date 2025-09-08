import { customAlphabet } from "nanoid"

// Only uppercase letters and digits (A-Z, 0-9)
const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10)

export const generateAccountId = (prefix: string): string => {
  return `${prefix.toUpperCase()}_${nanoid()}`
}

// Usage
// const savingAccountId = generateAccountId("SAV") // "SAV_A1B2C3D4E5"
// const fdAccountId = generateAccountId("FD") // "FD_X9Y8Z7W6V5"
