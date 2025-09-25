import { Body, Button, Container, Head, Html, Text } from "@react-email/components"
import { env } from "../env/client"

export type InvitationEmailProps = {
  inviteeEmail: string
  organizationName: string
  inviterName: string
  otp: string
}

export const InvitationEmail = ({ inviteeEmail, organizationName, inviterName, otp }: InvitationEmailProps) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: "Arial, sans-serif" }}>
      <Container>
        <Text>Hello {inviteeEmail},</Text>
        <Text>
          You have been invited to join {organizationName} on PocketFinance by {inviterName}.
        </Text>
        <Text>Your one-time password (OTP) for registration is:</Text>
        <Text style={{ fontSize: "24px", fontWeight: "bold", margin: "20px 0" }}>{otp}</Text>
        <Text>Please use this OTP to complete your registration on PocketFinance.</Text>
        <Button
          href={`${env.VITE_APP_URL}/register`}
          style={{
            background: "#007bff",
            color: "#ffffff",
            padding: "10px 20px",
            textDecoration: "none"
          }}
        >
          Register Now
        </Button>
        <Text>If you didn&apos;t request this invitation, please ignore this email.</Text>
      </Container>
    </Body>
  </Html>
)
