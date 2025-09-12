import { type BetterAuthOptions, betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { admin as adminPlugin, multiSession, openAPI, organization } from "better-auth/plugins"
import { reactStartCookies } from "better-auth/react-start"
import db from "@/lib/db"
import { invitations, organizations, orgMembers, sessions, userAccounts, users, verifications } from "@/lib/db/schema"
import { env } from "@/lib/env/server"
import { sendEmail } from "../../utils/email"
import { ac, admin, member, owner } from "./permissions"
import { checkIfFirstUser, checkInvitation } from "./queries"

export const auth = betterAuth({
  appName: "Finex",
  baseURL: env.VITE_APP_URL,
  logger: {
    disabled: env.NODE_ENV === "production",
    level: "debug"
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: {
      users,
      sessions,
      accounts: userAccounts,
      verifications,
      organizations,
      invitations,
      members: orgMembers
    }
  }),
  advanced: {
    database: {
      generateId: false
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 1 * 60
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      sendEmail(user.email, "password-reset", { resetLink: url })
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const verificationUrl = url
      sendEmail(user.email, "verification", { verificationUrl })
    }
  },

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        sendEmail(newEmail, "email-change", { verificationUrl: url })
      }
    }
  },
  rateLimit: {
    enabled: true,
    window: 60, // time window in seconds
    max: 100, // max requests in the window
    customRules: {
      "/sign-in/email": {
        window: 10,
        max: 4
      },
      "/sign-up/email": {
        window: 10,
        max: 5
      }
    }
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const email = ctx.body?.email
        if (!email) {
          throw new APIError("BAD_REQUEST", {
            message: "Email is required"
          })
        }
        const isFirstUser = await checkIfFirstUser()

        if (!isFirstUser) {
          const isInvited = await checkInvitation(email)
          if (!isInvited) {
            throw new APIError("FORBIDDEN", {
              message: "You must be invited to register"
            })
          }
        }
      }
      if (ctx.path === "/sign-in/email") {
        const email = ctx.body?.email

        if (!email.endsWith("@gmail.com")) {
          throw new APIError("BAD_REQUEST", {
            message: "Email account not supported"
          })
        }
      }
    })
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const isFirstUser = await checkIfFirstUser()
          if (isFirstUser) {
            return {
              data: {
                ...user,
                role: "admin", // Set admin role for first user
                emailVerified: true // Auto-verify the first user
              }
            }
          }

          return { data: user }
        }
      }
    }
  },
  telemetry: { enabled: false },
  plugins: [
    multiSession(),
    openAPI(),
    organization({
      sendInvitationEmail: async ({ id, role, email, organization, inviter }) => {
        const url = `${env.VITE_APP_URL}/organization/accept-invitation?id=${id}`
        sendEmail(email, "organization-invitation", {
          invitationUrl: url,
          organizationName: organization.name,
          inviterName: inviter.user.name || inviter.user.email,
          role
        })
      },
      ac,
      roles: {
        owner,
        admin,
        member
      }
    }),
    adminPlugin({
      defaultRole: "user",
      // adminUserIds: ["b46199ce-77a5-415f-9f34-add0e59e252d"],
      adminRoles: ["admin"],
      impersonationSessionDuration: 60 * 60 * 24 * 7 // 7 days
    }),
    reactStartCookies()
  ]
} satisfies BetterAuthOptions)

export type Session = typeof auth.$Infer.Session
