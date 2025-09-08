import { createFileRoute } from "@tanstack/react-router"
import { ArrowUpRightIcon, BarChart3, CreditCard, FileText, PiggyBank, Receipt, Users } from "lucide-react"
import { ReactNode, useId } from "react"
import { LandingFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Announcement, AnnouncementTag, AnnouncementTitle } from "@/components/ui/announcement"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import packageInfo from "../../package.json" with { type: "json" }

export const Route = createFileRoute("/")({
  component: Home
})

function Home() {
  const version = `v${packageInfo.version}`
  const homeId = useId()
  const featuresId = useId()
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <section className="flex grow items-center justify-center" id={homeId}>
        <div className="container max-w-5xl px-4 py-10 text-center">
          <h1 className="mb-4 font-bold font-sans text-3xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Finex
            <br />
          </h1>

          <Announcement className="mb-4">
            <AnnouncementTag>Latest version</AnnouncementTag>
            <a
              href={`https://github.com/lmntix/pocketfinance/releases/tag/${version}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AnnouncementTitle className="text-sm">
                {version}
                <ArrowUpRightIcon className="shrink-0 text-muted-foreground" size={16} />
              </AnnouncementTitle>
            </a>
          </Announcement>
          <p className="mx-auto max-w-2xl font-display text-muted-foreground leading-normal sm:text-xl sm:leading-8">
            A modern and comprehensive MicroFinance tool specially built for Credit Cooperative Societies
          </p>
        </div>
      </section>
      <section className="bg-background dark:bg-transparent" id={featuresId}>
        <div className="@container mx-auto max-w-5xl px-2">
          <div className="mx-auto grid @min-4xl:max-w-full max-w-sm @min-4xl:grid-cols-3 gap-6 *:text-center md:mt-16 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="group bg-background">
                <CardHeader className="pb-3">
                  <CardDecorator>{feature.icon}</CardDecorator>
                  <h3 className="mt-6 font-medium">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* <section className="flex grow items-center justify-center" id="pricing">
        <div className="container max-w-5xl px-4 py-16 text-center">
          <h2 className="mb-6 font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Simple, transparent pricing</h2>
          <p className="mx-auto mb-12 max-w-[85%] text-muted-foreground leading-normal sm:text-lg sm:leading-7">
            Unlock all features including unlimited posts for your organisation.
          </p>
          <div className="mb-12 grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
            <div className="grid gap-6 text-left">
              <h3 className="font-bold text-xl sm:text-2xl">What&apos;s included in the application</h3>
              <ul className="grid gap-3 text-muted-foreground text-sm sm:grid-cols-2">
                {featuresList.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4 text-center">
              <div>
                <h4 className="font-bold text-5xl">₹3500</h4>
                <p className="font-medium text-muted-foreground text-sm">Billed Monthly</p>
              </div>
              <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
                Get Started
              </Link>
            </div>
          </div>
          <p className="mx-auto max-w-[85%] text-muted-foreground leading-normal sm:leading-7">
            There are no hidden fees. <br />
            <strong>
              You can stop using the services whenever you want and you won&apos;t be charged from the next month.
            </strong>
          </p>
        </div>
      </section> */}
      <LandingFooter />
    </div>
  )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] dark:group-hover:bg-white/5 group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
    />
    <div aria-hidden className="absolute inset-0 bg-radial from-transparent to-75% to-background" />
    <div className="absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l bg-background">
      {children}
    </div>
  </div>
)

const features = [
  {
    title: "Account Management",
    description: "Track transactions and balances with ease",
    icon: <CreditCard className="size-6" />
  },
  {
    title: "Member Management",
    description: "Maintain detailed member profiles and records",
    icon: <Users className="size-6" />
  },
  {
    title: "Loan Management",
    description: "Process loan applications and approvals efficiently",
    icon: <FileText className="size-6" />
  },
  {
    title: "Financial Reporting",
    description: "Create comprehensive financial reports",
    icon: <BarChart3 className="size-6" />
  },
  {
    title: "Savings Management",
    description: "Manage savings accounts and plans effectively",
    icon: <PiggyBank className="size-6" />
  },
  {
    title: "Expense Tracking",
    description: "Record and categorize expenses accurately",
    icon: <Receipt className="size-6" />
  }
]

// const featuresList = [
//   "Account Management",
//   "Member Management",
//   "Loan Management",
//   "Financial Reporting",
//   "Savings Management",
//   "Expense Tracking"
// ]
