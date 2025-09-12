import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import z from "zod"
import { SidebarProvider } from "@/components/ui/sidebar"
import { assertAuthenticatedFn } from "@/functions/auth"
import { assertIsOrgMemberFn } from "@/functions/organizations"
import { tryCatch } from "@/utils/try-catch"
import { AppSidebar } from "./-components/navigation/app-sidebar"
import { OrganizationHeader } from "./-components/organization-header"

const paramsSchema = z.object({
  orgId: z.string()
})

export const Route = createFileRoute("/organizations/$orgId")({
  params: paramsSchema,
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    // First check if user is authenticated
    const authResult = await tryCatch(assertAuthenticatedFn())

    if (authResult.error) {
      throw redirect({
        to: "/unauthorized",
        search: { message: "Authentication failed." }
      })
    }

    const { session } = authResult.data

    // If user is not on their active organization, check if they're a member
    if (session.activeOrganizationId !== params.orgId) {
      const orgMemberResult = await tryCatch(assertIsOrgMemberFn({ data: { orgId: params.orgId } }))

      if (orgMemberResult.error) {
        throw redirect({
          to: "/unauthorized",
          search: { message: "You are not a member of this organization." }
        })
      }
    }
  }
})

function RouteComponent() {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <OrganizationHeader />
          <div className="pt-14">
            <main className="h-full">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
      {/* <GlobalSheets /> */}
    </div>
  )
}
