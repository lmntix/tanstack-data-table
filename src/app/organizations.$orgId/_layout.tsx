import { createFileRoute, Outlet } from "@tanstack/react-router"
import { SidebarProvider } from "@/components/ui/sidebar"
import { assertAuthenticatedFn } from "@/functions/auth"
import { ensureActiveOrgFn } from "@/functions/organizations"
import { AppSidebar } from "./-components/navigation/app-sidebar"
import { OrganizationHeader } from "./-components/organization-header"

export const Route = createFileRoute("/organizations/$orgId")({
  ssr: "data-only",
  component: RouteComponent,
  beforeLoad: async () => {
    const authResult = await assertAuthenticatedFn()
    return {
      session: authResult.session,
      user: authResult.user
    }
  },
  loader: async ({ params, context }) => {
    const { orgId } = params
    const { session } = context

    // Only set active organization if it's different from current
    if (session?.activeOrganizationId !== orgId) {
      return await ensureActiveOrgFn({ data: { orgId } })
    }

    return null
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
