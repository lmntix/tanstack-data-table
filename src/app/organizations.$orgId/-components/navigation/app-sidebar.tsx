"use client"

import { NavDate } from "@/app/organizations.$orgId/-components/nav-date"
import { NavMain } from "@/app/organizations.$orgId/-components/navigation/nav-main"
import { OrgOptions } from "@/app/organizations.$orgId/-components/org-options"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

import { SearchCommand } from "../search-command"
import { useNavItems } from "./nav-items"

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex h-14 justify-center border-b py-1">
        <OrgOptions />
      </SidebarHeader>
      <SidebarHeader className="flex h-12 items-center border-b bg-background p-0">
        <SearchCommand />
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full">
          <NavMain groupLabel="Overview" items={useNavItems().overview} />
          <NavMain groupLabel="Deposits" items={useNavItems().accounts} />
          <NavMain groupLabel="Banking" items={useNavItems().banking} />
          <NavMain groupLabel="Administration" items={useNavItems().administration} />
        </ScrollArea>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavDate />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
