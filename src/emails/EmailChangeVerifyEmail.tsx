import { Body, Button, Container, Head, Html, Text } from "@react-email/components"

export type EmailChangeVerifyEmailProps = {
  verificationUrl: string
}

export const EmailChangeVerifyEmail = ({ verificationUrl }: EmailChangeVerifyEmailProps) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: "Arial, sans-serif" }}>
      <Container>
        <Text>Hello,</Text>
        <Text>You have requested to change your email address for your PocketFinance account.</Text>
        <Text>Click the button below to verify this email change:</Text>
        <Button
          href={verificationUrl}
          style={{
            background: "#007bff",
            color: "#ffffff",
            padding: "10px 20px",
            textDecoration: "none"
          }}
        >
          Verify Email Change
        </Button>
        <Text>
          If you didn&apos;t request this email change, please ignore this email or contact support immediately.
        </Text>
        <Text>This verification link will expire in 1 hour.</Text>
      </Container>
    </Body>
  </Html>
)
