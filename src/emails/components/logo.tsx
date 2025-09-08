import { Img, Section } from "@react-email/components"
import { env } from "@/env/client"

const appUrl = env.VITE_APP_URL

export function Logo() {
  return (
    <Section className="mt-8 mb-12">
      <Img alt="Finex Logo" height={32} src={`${appUrl}/email/logo.png`} width={194} />
    </Section>
  )
}
