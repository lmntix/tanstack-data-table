"use client"
import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-16">
        <Link className="flex items-center" to="/">
          <img alt="" height={32} src="/logo.svg" width={32} />
          <span className="ml-2 hidden font-bold text-lg sm:flex">Finex</span>
        </Link>
        <div className="flex items-center space-x-2">
          <ThemeToggle />

          <Link to="/dashboard">
            <Button variant="outline">
              Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
