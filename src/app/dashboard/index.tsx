import { createFileRoute, Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import { Suspense } from "react"
import PageHeader from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserInvitationsFn, getUserOrganizationsFn } from "@/server/functions/organizations"

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
  loader: async () => {
    const [organizations, invitations] = await Promise.all([getUserOrganizationsFn(), getUserInvitationsFn()])
    return { organizations, invitations }
  }
})

function RouteComponent() {
  return (
    <>
      <PageHeader label="Organizations">
        <Button variant="outline">Create Organization</Button>
        <Button variant="outline">Invitations</Button>
      </PageHeader>
      <Suspense fallback={<OrganizationsSkeleton />}>
        <OrganizationsDetails />
      </Suspense>
    </>
  )
}

function OrganizationsDetails() {
  const { organizations } = Route.useLoaderData()
  return (
    <div className="m-4">
      <div className="m-4 space-y-6">
        {organizations.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">You don&apos;t have any organizations yet.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-3">
            {organizations.map((org) => (
              <Link
                className="group block"
                to="/organizations/$/dashboard"
                params={{ _splat: org.slug || "" }}
                key={org.id}
              >
                <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md">
                  <CardContent className="p-4 hover:bg-accent/50 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-background text-foreground">
                        {org.logo ? (
                          <img
                            alt={org.name}
                            className="rounded-md object-cover"
                            src={org.logo || "/placeholder.svg"}
                          />
                        ) : (
                          <span className="font-semibold text-lg">{org.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between">
                          <h2 className="truncate font-medium text-base">{org.name}</h2>
                          <ChevronRight className="ml-2 h-5 w-5 text-muted-foreground opacity-70 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                        </div>

                        <div className="mt-1">
                          <Badge className="font-normal text-xs" variant="outline">
                            {org.role.charAt(0).toUpperCase() + org.role.slice(1).toLowerCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  {org.slug && (
                    <CardFooter className="border-t bg-muted/50 px-4 py-2 text-muted-foreground text-xs sm:px-6">
                      <div className="w-full truncate">
                        {/* <span className="text-muted-foreground/70">slug: </span> */}
                        {org.slug}
                      </div>
                    </CardFooter>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function OrganizationsSkeleton() {
  return (
    <div className="m-4 space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div className="group block" key={i}>
            <div className="h-full overflow-hidden rounded-lg border shadow-xs">
              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="ml-2 h-5 w-5" />
                    </div>
                    <div className="mt-1">
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t px-4 py-2 sm:px-6">
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
