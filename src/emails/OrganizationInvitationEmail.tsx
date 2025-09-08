import { Body, Button, Container, Head, Hr, Html, Section, Text } from "@react-email/components"

export type OrganizationInvitationEmailProps = {
  invitationUrl: string
  organizationName?: string
  inviterName?: string
  role?: string
}

export const OrganizationInvitationEmail = ({
  invitationUrl,
  organizationName = "an organization",
  inviterName = "A team member",
  role = "member"
}: OrganizationInvitationEmailProps) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: "Arial, sans-serif" }}>
      <Container>
        <Text>Hello,</Text>
        <Text>
          You have been invited to join {organizationName} on PocketFinance by {inviterName} as a {role}.
        </Text>
        <Section style={{ textAlign: "center", margin: "32px 0" }}>
          <Button
            href={invitationUrl}
            style={{
              background: "#007bff",
              color: "#ffffff",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "bold"
            }}
          >
            Accept Invitation
          </Button>
        </Section>
        <Text>If the button doesn&apos;t work, you can copy and paste the following URL into your browser:</Text>
        <Text style={{ color: "#666666", wordBreak: "break-all" }}>{invitationUrl}</Text>
        <Hr style={{ borderColor: "#e6e6e6", margin: "24px 0" }} />
        <Text style={{ fontSize: "12px", color: "#666666" }}>
          If you didn&apos;t expect this invitation, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)
