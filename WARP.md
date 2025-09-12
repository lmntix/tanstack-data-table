# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Finex is a modern microfinance management platform built with React 19, TanStack Start (full-stack React framework), TypeScript, and PostgreSQL. It features comprehensive financial management capabilities including member accounts, savings plans, transactions, and organizational management.

## Tech Stack & Architecture

**Frontend & Framework:**

- **TanStack Start**: Full-stack React framework with file-based routing (`src/app/`)
- **React 19.1.1** with TypeScript for type safety
- **TanStack Router**: Type-safe routing with code-splitting
- **TanStack Query**: Server state management with caching
- **Shadcn/ui**: Modern component library based on Radix UI
- **Tailwind CSS v4**: Utility-first styling with Vite plugin
- **Framer Motion**: Animations and interactions

**Backend & Database:**

- **Better Auth**: Modern authentication system with session management
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL
- **PostgreSQL**: Primary database with schema separation (public, auth, drizzle)
- **Zod**: Runtime type validation and environment variable management
- **Nodemailer**: Email functionality with SMTP integration

**Build Tools & Development:**

- **Vite**: Fast development server and build tool
- **Biome**: Fast linting and formatting (replaces ESLint/Prettier)
- **PNPM**: Package manager
- **Husky**: Git hooks for commit quality

## Development Commands

**Start Development:**

```bash
pnpm dev              # Starts dev server at localhost:3000
```

**Build & Production:**

```bash
pnpm build            # Build for production (includes TypeScript check)
pnpm start            # Start production server
pnpm typecheck        # Run TypeScript type checking only
```

**Code Quality:**

```bash
pnpm lint             # Run Biome checks + typecheck
pnpm format           # Format code with Biome
```

**Database Operations:**

```bash
pnpm db:generate      # Generate migrations from schema changes
pnpm db:push          # Push schema changes directly to database
pnpm db:studio        # Open Drizzle Studio (database GUI)
pnpm db:migrate       # Apply pending migrations
pnpm db:reset         # Clear entire database (⚠️  destructive)
pnpm db:introspect    # Introspect existing database schema
```

**Development Utilities:**

```bash
pnpm shadcn           # Add/manage shadcn/ui components
pnpm commit           # Interactive commit with conventional commits
pnpm release          # Version bump and push tags
```

## Project Structure

**Core Application:**

- `src/app/` - File-based routing (TanStack Start convention)
  - `__root.tsx` - Root layout with providers
  - `_auth/` - Authentication pages (login, register, etc.)
  - `dashboard/` - Protected dashboard routes
  - `api/` - API route handlers
- `src/server/` - Server-side code
  - `db/` - Database schema, migrations, queries
  - `functions/` - Server functions (auth, business logic)
  - `queries/` - Database query functions organized by domain
- `src/components/` - Shared React components
- `src/lib/` - Shared utilities and configurations
- `src/utils/` - Helper functions and constants

**Configuration Files:**

- `drizzle.config.ts` - Database ORM configuration
- `biome.json` - Code formatting and linting rules
- `components.json` - Shadcn/ui component configuration
- `vite.config.ts` - Build tool configuration with TanStack Start plugin

## Database Architecture

**Schema Organization:**

- **public schema**: Application tables (organizations, members, accounts, transactions)
- **auth schema**: Authentication tables (users, sessions, invitations)
- **drizzle schema**: Migration tracking

**Key Entities:**

- Organizations → Members → Accounts → Transactions
- Users (auth) → Organization Members (with roles)
- Saving accounts, plans, and interest calculations
- Multi-tenant architecture with organization-based data isolation

**Migrations:**

- Located in `src/lib/db/migrations/`
- Use `pnpm db:generate` after schema changes
- Apply with `pnpm db:migrate` or `pnpm db:push` for development

## Authentication & Authorization

- **Better Auth** handles user sessions, email verification, password reset
- **Role-based access** with organization membership
- **Server functions** in `src/server/functions/auth.ts` for route protection
- **Session management** with organization switching capability

## Environment Setup

Required environment variables (see `src/env/server.ts`):

- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Authentication secret
- `APP_URL` - Application URL
- SMTP settings for email functionality
- Axiom logging configuration

## Development Notes

**Route Structure:**

- File-based routing with `_layout.tsx` for nested layouts
- Protected routes use `assertAuthenticatedFn` server function
- Route tree auto-generated in `src/routeTree.gen.ts`

**Data Fetching:**

- Server functions created with `createServerFn` for type safety
- TanStack Query for client-side caching and state management
- Database queries organized by domain in `src/server/queries/`

**Component Development:**

- Use shadcn/ui components (`pnpm shadcn add <component>`)
- Follow existing patterns for form handling with TanStack Form
- Utilize React 19 features (concurrent features, automatic batching)

**Code Style:**

- Biome handles formatting automatically (120 char line width)
- Double quotes, semicolons as needed, no trailing commas
- Import organization handled automatically
- TypeScript strict mode enabled

**Testing Database Changes:**

- Use `pnpm db:push` for rapid prototyping (skips migrations)
- Use `pnpm db:studio` to inspect data visually
- `pnpm db:reset` to start fresh (⚠️ destroys all data)
