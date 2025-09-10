import { QueryClient } from "@tanstack/react-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import GlobalErrorComponent from "./components/global-error"
import NotFoundComponent from "./components/not-found"
import { routeTree } from "./routeTree.gen"

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 10
      }
    }
  })
  const router = createTanStackRouter({
    routeTree,
    context: {
      queryClient
    },
    defaultPreload: "intent",
    defaultErrorComponent: GlobalErrorComponent,
    defaultNotFoundComponent: () => <NotFoundComponent />,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultStructuralSharing: true
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
