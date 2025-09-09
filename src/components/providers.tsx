import { TanStackDevtools } from "@tanstack/react-devtools"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import { useRouter } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "./ui/sonner"

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const queryClient = router.options.context.queryClient

  const isDevelopment = process.env.NODE_ENV === "development" || import.meta.env.DEV

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider delayDuration={0}>
          {children}

          <Toaster richColors />

          {isDevelopment && (
            <TanStackDevtools
              plugins={[
                {
                  name: "TanStack Query",
                  render: <ReactQueryDevtoolsPanel />
                },
                {
                  name: "TanStack Router",
                  render: <TanStackRouterDevtoolsPanel />
                }
              ]}
            />
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
