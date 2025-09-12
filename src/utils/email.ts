import { render } from "@react-email/render"
import nodemailer from "nodemailer"
import { EmailChangeVerifyEmail, type EmailChangeVerifyEmailProps } from "@/lib/emails/EmailChangeVerifyEmail"
import { InvitationEmail, type InvitationEmailProps } from "@/lib/emails/InvitationEmail"
import {
  OrganizationInvitationEmail,
  type OrganizationInvitationEmailProps
} from "@/lib/emails/OrganizationInvitationEmail"
import { PasswordResetEmail, type PasswordResetEmailProps } from "@/lib/emails/PasswordResetEmail"
import { VerificationEmail, type VerificationEmailProps } from "@/lib/emails/VerificationEmail"
import { env } from "@/lib/env/server"

// ----------------------------------------------- EMAIL LOG ---------------------------------

async function logEmailAttempt(to: string, subject: string, success: boolean, error?: unknown) {
  if (success) {
    console.log("Email Success", {
      to,
      subject
    })
  } else {
    console.error("Email Failed", {
      to,
      subject,
      error: error ? JSON.stringify(error) : "Unknown error"
    })
  }
}

// ----------------------------------------------- NODEMAILER TRANSPORT ---------------------------------

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT || 587,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS
  }
})

// ----------------------------------------------- EMAIL TYPES START ---------------------------------

type EmailType = "invitation" | "organization-invitation" | "password-reset" | "verification" | "email-change"
type EmailData =
  | InvitationEmailProps
  | OrganizationInvitationEmailProps
  | PasswordResetEmailProps
  | VerificationEmailProps
  | EmailChangeVerifyEmailProps

export async function sendEmail(to: string, type: EmailType, data: EmailData) {
  let subject: string
  let html: string

  try {
    switch (type) {
      case "invitation":
        subject = "Invitation to PocketFinance"
        html = await render(InvitationEmail(data as InvitationEmailProps))
        break
      case "organization-invitation":
        subject = "Invitation to join an organization on PocketFinance"
        html = await render(OrganizationInvitationEmail(data as OrganizationInvitationEmailProps))
        break
      case "password-reset":
        subject = "Reset your PocketFinance password"
        html = await render(PasswordResetEmail(data as PasswordResetEmailProps))
        break
      case "verification":
        subject = "Verify your PocketFinance account"
        html = await render(VerificationEmail(data as VerificationEmailProps))
        break
      case "email-change":
        subject = "Verify your email change"
        html = await render(EmailChangeVerifyEmail(data as EmailChangeVerifyEmailProps))
        break
      default:
        throw new Error("Invalid email type")
    }

    // ----------------------------------------------- EMAIL TYPES END ---------------------------------

    const emailConfig = {
      from: env.SMTP_FROM,
      to,
      subject,
      html
    }

    try {
      await transporter.sendMail(emailConfig)
      await logEmailAttempt(to, subject, true)
    } catch (error) {
      await logEmailAttempt(to, subject, false, error)
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    return { success: true }
  } catch (error) {
    console.error("[Email Service Error]", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email"
    }
  }
}
