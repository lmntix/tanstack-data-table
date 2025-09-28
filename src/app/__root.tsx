/// <reference types="vite/client" />

import { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router"
import NProgress from "nprogress"
import * as React from "react"
import GlobalErrorComponent from "@/components/global-error"
import NotFoundComponent from "@/components/not-found"
import Providers from "@/components/providers"
import appCss from "@/styles.css?url"
import "nprogress/nprogress.css"
import AppHeader from "@/components/header"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }
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
  const routerState = useRouterState()
  const prevPathnameRef = React.useRef("")

  React.useEffect(() => {
    const currentPathname = routerState.location.pathname
    const pathnameChanged = prevPathnameRef.current !== currentPathname

    if (pathnameChanged && routerState.status === "pending") {
      NProgress.start()
      prevPathnameRef.current = currentPathname
    }

    if (routerState.status === "idle") {
      NProgress.done()
    }
  }, [routerState.status, routerState.location.pathname])
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          //biome-ignore lint/security/noDangerouslySetInnerHtml: req
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Constants (must match ThemeProvider.tsx)
                const THEME_COOKIE_NAME = 'ui-theme';
                const COOKIE_EXPIRY_DAYS = 365;
                const MILLISECONDS_PER_DAY = 864e5;
                const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)';
                const THEME_CLASSES = { LIGHT: 'light', DARK: 'dark' };
                
                // Get theme from cookie
                let theme = document.cookie.match(new RegExp('(^| )' + THEME_COOKIE_NAME + '=([^;]+)'))?.[2];
                
                let resolvedTheme;
                let root = document.documentElement;
                
                // Clear any existing theme classes
                root.classList.remove(THEME_CLASSES.LIGHT, THEME_CLASSES.DARK);
                
                if (!theme || theme === 'system') {
                  // Use system preference for system theme or if no theme is set
                  resolvedTheme = window.matchMedia(DARK_MODE_MEDIA_QUERY).matches ? THEME_CLASSES.DARK : THEME_CLASSES.LIGHT;
                  
                  if (!theme) {
                    // Set cookie with system preference on first visit
                    const expires = new Date(Date.now() + COOKIE_EXPIRY_DAYS * MILLISECONDS_PER_DAY).toUTCString();
                    document.cookie = THEME_COOKIE_NAME + '=system; expires=' + expires + '; path=/; SameSite=Lax';
                  }
                } else {
                  resolvedTheme = theme;
                }
                
                root.classList.add(resolvedTheme);
                
                // Add data attribute for debugging
                root.setAttribute('data-theme', theme || 'system');
                root.setAttribute('data-resolved-theme', resolvedTheme);
              })();
            `
          }}
        />
        <style>{`
          #nprogress .bar {
            background: var(--primary) !important;
            height: 3px;
          }
          #nprogress .peg {
            box-shadow: 0 0 10px var(--primary), 0 0 5px var(--primary);
          }
          #nprogress .spinner-icon {
            display: none;
          }
        `}</style>
      </head>
      <body>
        <Providers>
          <AppHeader />
          {children}
        </Providers>

        <Scripts />
      </body>
    </html>
  )
}
