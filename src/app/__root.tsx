/// <reference types="vite/client" />

import { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router"
import * as React from "react"
import GlobalErrorComponent from "@/components/global-error"
import NotFoundComponent from "@/components/not-found"
import Providers from "@/components/providers"
import { AuthQueryResult, authQueryOptions } from "@/server/queries/auth"
import appCss from "@/styles.css?url"
import { seo } from "@/utils/seo"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  user: AuthQueryResult
}>()({
  beforeLoad: ({ context }) => {
    // we're using react-query for client-side caching to reduce client-to-server calls, see /src/router.tsx
    // better-auth's cookieCache is also enabled server-side to reduce server-to-db calls, see /src/lib/auth/auth.ts
    context.queryClient.prefetchQuery(authQueryOptions())

    // typically we don't need the user immediately in landing pages,
    // so we're only prefetching here and not awaiting.
    // for protected routes with loader data, see /(authenticated)/route.tsx
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      ...seo({
        title: "Finex | Modern Microfinance Management Platform",
        description: "Finex is a comprehensive microfinance management platform with modern technology."
      })
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" }
    ]
  }),

  errorComponent: (props) => {
    return (
      <RootDocument>
        <GlobalErrorComponent {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFoundComponent />,
  shellComponent: RootComponent
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Scripts />
      </body>
    </html>
  )
}
