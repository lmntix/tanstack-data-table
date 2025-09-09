import { Link, useRouterState } from "@tanstack/react-router"
import { Menu } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { APP_TITLE } from "@/utils/constants"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet"
import HeaderActions from "./header-actions"

type NavItem = {
  name: string
  path: string
  matchType: "prefix" | "exact"
}

export const navMenu: NavItem[] = [
  {
    name: "My Organizations",
    path: "/dashboard",
    matchType: "exact"
  },
  { name: "Settings", path: "/dashboard/settings", matchType: "prefix" },
  { name: "Admin", path: "/dashboard/admin", matchType: "prefix" }
]

export default function Header() {
  const pathname = useRouterState().location.pathname
  const [open, setOpen] = useState(false)

  return (
    <div className="sticky top-0 z-30 flex flex-col bg-background">
      <nav className="top-0 flex h-14 items-center justify-between border-border border-b">
        {/* Logo/Title Section */}
        <Link
          className="col-span-2 flex h-14 shrink-0 items-center px-4 text-foreground transition-colors md:px-5"
          to="/"
        >
          {/* Logo - always visible */}
          <div className="flex h-full items-center justify-center">
            <img alt="Logo" className="h-7 w-7" height={28} src="/logo.svg" width={28} />
          </div>

          {/* Title - hidden on small screens */}
          <span className="ml-2 hidden font-medium md:inline">{APP_TITLE}</span>
        </Link>

        <div className="relative col-span-10 flex h-14 w-full items-center justify-end">
          {/* Desktop Navigation */}
          <ul className="hidden h-full w-max shrink-0 items-center divide-x divide-border md:flex">
            {navMenu.map((menu) => {
              // Check active state based on matchType
              const isActive = menu.matchType === "exact" ? pathname === menu.path : pathname.startsWith(menu.path)
              return (
                <li className="h-full" key={menu.name}>
                  <Link
                    className={cn(
                      "relative flex h-full items-center px-6 text-base",
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                    to={menu.path}
                  >
                    {menu.name}
                    {isActive && <div className="absolute bottom-0 left-0 h-1 w-full bg-foreground" />}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="hidden h-full md:flex">
            <HeaderActions />
          </div>

          {/* Mobile Menu Button */}
          <Sheet onOpenChange={setOpen} open={open}>
            <SheetTrigger asChild>
              <Button
                aria-label="Toggle mobile menu"
                className="flex h-14 w-14 items-center justify-center rounded-none border-border border-l p-0 text-foreground hover:bg-transparent md:hidden"
                variant="ghost"
              >
                <Menu size={28} strokeWidth={2} />
              </Button>
            </SheetTrigger>
            <SheetContent className="rounded-none border-border border-t p-0" side="top">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col">
                {navMenu.map((menu) => {
                  // Check active state based on matchType
                  const isActive = menu.matchType === "exact" ? pathname === menu.path : pathname.startsWith(menu.path)
                  return (
                    <Link
                      className={cn(
                        "px-4 py-3 text-base",
                        isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                      to={menu.path}
                      key={menu.name}
                      onClick={() => setOpen(false)}
                    >
                      {menu.name}
                    </Link>
                  )
                })}
                <HeaderActions />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  )
}
