import { Column, Img, Link, Row, Section, Text } from "@react-email/components"
import { env } from "@/env/client"

const appUrl = env.VITE_APP_URL

export function Footer() {
  return (
    <Section>
      <Img alt="Separator" className="mb-12" src={`${appUrl}/email/separator.png`} width="100%" />

      <Text className="mb-4 text-left font-mono text-sm leading-6">Automated localization for your applications</Text>

      <Row align="left" className="mt-8" width="auto">
        <Column className="pr-6 align-middle">
          <Link className="text-black text-xl no-underline" href="https://twitter.com/languine_ai">
            <Img alt="X" height={22} src={`${appUrl}/email/x.png`} width={22} />
          </Link>
        </Column>

        <Column className="align-middle">
          <Link className="text-black text-xl no-underline" href="https://github.com/midday-ai/languine">
            <Img alt="GitHub" height={22} src={`${appUrl}/email/github.png`} width={22} />
          </Link>
        </Column>
      </Row>
      <Section className="mt-8 flex gap-3">
        <Text className="mb-4 text-left font-mono text-[#B8B8B8] text-xs leading-6">
          © 2024 Languine. All rights reserved. This email was sent to you because you signed up for Languine.
        </Text>
      </Section>
    </Section>
  )
}
