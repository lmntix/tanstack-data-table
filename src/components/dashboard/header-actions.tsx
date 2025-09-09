import { useRouter } from "@tanstack/react-router"
import { Loader2, LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { authClient } from "@/lib/auth/auth-client"

export default function HeaderActions() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onRequest: () => {
          setIsLoggingOut(true) // Start loading
        },
        onSuccess: () => {
          router.navigate({ to: "/" })
        },
        onError: (ctx: { error: Error }) => {
          toast.error("Logout failed", {
            description: ctx.error.message
          })
        },
        onResponse: () => {
          setIsLoggingOut(false) // Stop loading regardless of outcome
        }
      }
    })
  }

  return (
    <>
      <div className="hidden h-full md:flex">
        <Button
          aria-label="Toggle Theme"
          className="flex h-14 w-[3.56rem] shrink-0 items-center justify-center rounded-none border-border border-l text-muted-foreground ring-0 hover:bg-transparent"
          onClick={toggleTheme}
          size="icon"
          variant="ghost"
        >
          <Sun className="size-6 fill-current dark:hidden" />
          <Moon className="hidden size-6 fill-current dark:block" />
        </Button>

        {/* Desktop Logout Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              aria-label="Logout"
              className="flex h-14 w-[3.56rem] shrink-0 items-center justify-center rounded-none border-border border-l text-muted-foreground ring-0 hover:bg-transparent"
              size="icon"
              variant="ghost"
            >
              <LogOut className="size-6" strokeWidth={3} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogDescription>Are you sure you want to log out?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={isLoggingOut} variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isLoggingOut} onClick={handleLogout}>
                {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="contents md:hidden">
        <Button
          aria-label="Toggle theme"
          className="h-auto justify-start rounded-none border-border border-t px-4 py-3 text-base text-muted-foreground hover:text-foreground"
          onClick={toggleTheme}
          variant="ghost"
        >
          <Sun className="mr-2 size-5 fill-current dark:hidden" />
          <Moon className="mr-2 hidden size-5 fill-current dark:block" />
          <span>Toggle theme</span>
        </Button>

        {/* Mobile Logout Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              aria-label="Logout"
              className="h-auto justify-start rounded-none px-4 py-3 text-base text-muted-foreground hover:text-foreground"
              variant="ghost"
            >
              <LogOut className="mr-2 size-5" />
              <span>Logout</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogDescription>Are you sure you want to log out?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={isLoggingOut} variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isLoggingOut} onClick={handleLogout}>
                {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
