## Getting Started

Open [http://localhost:3000](http://localhost:3000) to see the application.
Open [http://localhost:8025](http://localhost:8025) to see the mail server.
Open [http://localhost:3000/api/auth/reference](http://localhost:3000/api/auth/reference) to see the Auth Open API Scalar

## Developer Commands

All available commands from package.json:

```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build            # Build the application for production
pnpm start            # Start the production server
pnpm lint             # Run Lint to check code quality
pnpm format           # Format
pnpm check            # Run Lint and TypeScript type checking
pnpm typecheck        # Run TypeScript type checking

# Database Management
pnpm db:generate           # Generate SQL from your Drizzle schema
pnpm db:push               # Push schema changes to your database
pnpm db:introspect         # Introspect an existing database
pnpm db:studio             # Open Drizzle Studio to manage your database
pnpm db:migrate            # Run database migrations
pnpm db:drop-migration     # Drop a migration
pnpm db:pull               # Pull database schema into your Drizzle schema

# Git Workflow
pnpm commit           # Interactive commit with conventional commits + version bump

# Package Management
pnpm outdated                    # Check for outdated packages
pnpm update --interactive        # Update packages interactively
pnpm update                      # Update all packages
pnpm update --latest             # Update packages to the latest version
npx depcheck                     # Check for unused dependencies
pnpm remove <package-name>       # Remove specific package
pnpm prune                       # Remove orphaned packages
```

## VSCode Shortcuts

```bash
# Essential shortcuts
Cmd+Shift+P → TypeScript: Restart TS Server    # Restart TypeScript server
Cmd+Shift+V                                     # Preview markdown file
```
