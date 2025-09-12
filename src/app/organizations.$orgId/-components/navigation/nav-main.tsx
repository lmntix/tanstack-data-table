import { Link, useLocation } from "@tanstack/react-router"
import { ChevronRight, LayoutDashboard } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar"
import { NavItem } from "./nav-items"

export function NavMain({ items, groupLabel }: { items: NavItem[]; groupLabel?: string }) {
  const pathname = useLocation().pathname
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      {groupLabel && <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon || LayoutDashboard
          return item?.items && item?.items?.length > 0 ? (
            <Collapsible
              asChild
              className="group/collapsible"
              defaultOpen={item.isActive || item.items?.some((subItem) => pathname === subItem.url)}
              key={item.title}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={
                      pathname === item.url ||
                      item.items?.some((subItem) => pathname === subItem.url) ||
                      pathname.startsWith(`${item.url}/`)
                    }
                    tooltip={item.title}
                    variant={item.isHighlighted ? "outline" : "default"}
                  >
                    <Icon className="size-4" />
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubItemActive = pathname === subItem.url || pathname.startsWith(`${subItem.url}/`)
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className="hover:bg-transparent hover:text-inherit focus:bg-transparent active:bg-transparent"
                          >
                            <Link
                              to={subItem.url}
                              onClick={() => setOpenMobile(false)}
                              className="hover:bg-transparent focus:bg-transparent focus:outline-none active:bg-transparent"
                            >
                              <span
                                className={`transition-colors ${isSubItemActive ? "font-medium text-sidebar-accent-foreground" : "hover:font-medium hover:text-sidebar-accent-foreground"}`}
                              >
                                {subItem.title}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}
                tooltip={item.title}
                variant={item.isHighlighted ? "outline" : "default"}
              >
                <Link to={item.url} onClick={() => setOpenMobile(false)}>
                  <Icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
