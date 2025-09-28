import { QueryClient } from "@tanstack/react-query"
import { createRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import GlobalErrorComponent from "./components/global-error"
import NotFoundComponent from "./components/not-found"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 0
      }
    }
  })
  const router = createRouter({
    routeTree,
    context: {
      queryClient
    },
    defaultPreload: "intent",
    defaultErrorComponent: GlobalErrorComponent,
    defaultNotFoundComponent: () => <NotFoundComponent />,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPendingMinMs: 0,
    defaultStructuralSharing: true
  })
  setupRouterSsrQueryIntegration({
    router,
    queryClient
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
