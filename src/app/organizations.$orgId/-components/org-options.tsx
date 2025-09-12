import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "@tanstack/react-router"
import { ArrowLeftRight, ChevronsUpDown, Loader2, Settings, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { getCurrentOrganizationFn, getUserOrganizationsFn } from "@/functions/organizations"

export function OrgOptions() {
  const { isMobile } = useSidebar()
  const { orgId } = useParams({ from: "/organizations/$orgId" })

  // Fetch current organization details
  const {
    data: currentOrg,
    isLoading: isCurrentOrgLoading,
    error: currentOrgError
  } = useQuery({
    queryKey: ["currentOrganization", orgId],
    queryFn: () => getCurrentOrganizationFn({ data: orgId }),
    enabled: !!orgId
  })

  // Fetch all organizations for switching
  const { data: allOrganizations = [], isLoading: isAllOrgsLoading } = useQuery({
    queryKey: ["userOrganizations"],
    queryFn: () => getUserOrganizationsFn()
  })

  const formatRole = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner":
        return "Owner"
      case "admin":
        return "Admin"
      case "user":
        return "User"
      default:
        return role
    }
  }

  // Loading state
  if (isCurrentOrgLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
              <Loader2 className="size-4 animate-spin" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Loading...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // Error state
  if (currentOrgError || !currentOrg) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-red-100">
              <span className="font-bold text-red-600 text-xs">!</span>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium text-red-600">Error loading organization</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="focus-visible:ring-0">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                <img alt={currentOrg.name} height={30} src={currentOrg.logo || "/logo.svg"} width={30} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentOrg.name}</span>
                <span className="truncate text-xs">{formatRole(currentOrg.role)}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "bottom"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">Options</DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 p-1">
              <div className="flex size-6 items-center justify-center">
                <Settings className="size-4 shrink-0" />
              </div>
              Manage Organization
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 p-1">
              <div className="flex size-6 items-center justify-center">
                <Users className="size-4 shrink-0" />
              </div>
              Manage Users
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-muted-foreground text-xs">Organizations</DropdownMenuLabel>
            {isAllOrgsLoading ? (
              <DropdownMenuItem disabled className="gap-2 p-1">
                <Loader2 className="size-4 animate-spin" />
                Loading...
              </DropdownMenuItem>
            ) : (
              allOrganizations.map((org) => (
                <DropdownMenuItem key={org.id} asChild className="gap-2 p-1">
                  <Link to="/organizations/$orgId" params={{ orgId: org.id }}>
                    <div className="flex size-6 items-center justify-center">
                      <img alt={org.name} height={16} src={org.logo || "/logo.svg"} width={16} />
                    </div>
                    {org.name} ({formatRole(org.role)})
                  </Link>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="gap-2 p-1">
              <Link to="/dashboard">
                <div className="flex size-6 items-center justify-center">
                  <ArrowLeftRight className="size-4 shrink-0" />
                </div>
                Switch Organization
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
