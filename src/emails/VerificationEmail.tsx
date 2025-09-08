import { Body, Button, Container, Head, Html, Text } from "@react-email/components"

export type VerificationEmailProps = {
  verificationUrl: string
}

export const VerificationEmail = ({ verificationUrl }: VerificationEmailProps) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: "Arial, sans-serif" }}>
      <Container>
        <Text>Hello,</Text>
        <Text>
          Thank you for signing up for PocketFinance. Please verify your email address to complete your registration.
        </Text>
        <Text>Click the button below to verify your email:</Text>
        <Button
          href={verificationUrl}
          style={{
            background: "#007bff",
            color: "#ffffff",
            padding: "10px 20px",
            textDecoration: "none"
          }}
        >
          Verify Email
        </Button>
        <Text>If you didn&apos;t create an account with PocketFinance, please ignore this email.</Text>
        <Text>This verification link will expire in 24 hours.</Text>
      </Container>
    </Body>
  </Html>
)
