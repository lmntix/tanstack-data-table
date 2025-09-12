import { useRouter } from "@tanstack/react-router"
import { Search } from "lucide-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSidebar } from "@/components/ui/sidebar"
import { useNavItems } from "./navigation/nav-items"

export function SearchCommand() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <Button
        variant="ghost"
        className={`bg-transparent hover:bg-transparent hover:text-foreground active:bg-transparent ${
          isCollapsed
            ? "h-12 w-12 justify-center p-0"
            : "h-12 w-full justify-between px-3 text-muted-foreground text-sm"
        }`}
        onClick={() => setOpen(true)}
        title={isCollapsed ? "Search (⌘K)" : undefined}
      >
        <div className={`flex items-center ${isCollapsed ? "" : "gap-2"}`}>
          <Search className="h-4 w-4" />
          {!isCollapsed && <span className="sm:inline">Search...</span>}
        </div>
        {!isCollapsed && (
          <kbd className="inline-flex h-4 select-none items-center gap-1 border bg-muted px-1.5 font-medium font-mono text-[10px] text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        )}
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle />
        </DialogHeader>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Overview">
            {useNavItems().overview.map((item) => (
              <CommandItem
                key={item.title}
                onSelect={() => {
                  setOpen(false)
                  router.navigate({ to: item.url })
                }}
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Accounts">
            {useNavItems().accounts.map((item) => (
              <CommandItem
                key={item.title}
                onSelect={() => {
                  setOpen(false)
                  router.navigate({ to: item.url })
                }}
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Banking">
            {useNavItems().banking.map((item) => (
              <CommandItem
                key={item.title}
                onSelect={() => {
                  setOpen(false)
                  router.navigate({ to: item.url })
                }}
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Management">
            {useNavItems().administration.map((item) => (
              <CommandItem
                key={item.title}
                onSelect={() => {
                  setOpen(false)
                  router.navigate({ to: item.url })
                }}
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
