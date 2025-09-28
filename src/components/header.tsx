import { Link } from "@tanstack/react-router"
import { Home } from "lucide-react"

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center space-x-2 pl-6">
          <Home className="h-5 w-5" />
        </Link>
      </div>
    </header>
  )
}
