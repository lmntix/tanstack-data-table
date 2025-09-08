import { Body, Button, Container, Head, Html, Text } from "@react-email/components"

export type PasswordResetEmailProps = {
  resetLink: string
}

export const PasswordResetEmail = ({ resetLink }: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: "Arial, sans-serif" }}>
      <Container>
        <Text>Hello,</Text>
        <Text>We received a request to reset your password for your PocketFinance account.</Text>
        <Text>Click the button below to reset your password:</Text>
        <Button
          href={resetLink}
          style={{
            background: "#007bff",
            color: "#ffffff",
            padding: "10px 20px",
            textDecoration: "none"
          }}
        >
          Reset Password
        </Button>
        <Text>
          If you didn&apos;t request a password reset, please ignore this email or contact support if you have concerns.
        </Text>
        <Text>This password reset link will expire in 1 hour.</Text>
      </Container>
    </Body>
  </Html>
)
