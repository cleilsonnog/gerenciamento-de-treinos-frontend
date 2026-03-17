# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Run ESLint
npx orval         # Regenerate API functions and hooks from OpenAPI spec
```

## Architecture

This is a **Next.js 15 App Router** project using **React 19** and **TypeScript**.

### Directory Structure

- `app/` — Next.js App Router pages and layouts
  - `_lib/auth-client.ts` — BetterAuth client (singleton, used in Client Components)
  - `globals.css` — Tailwind v4 theme variables (all CSS custom properties live here)
- `components/ui/` — shadcn/ui components (installed via `npx shadcn add <component>`)
- `lib/utils.ts` — `cn()` utility for class merging

### Authentication

Auth is handled by **BetterAuth** via `authClient` exported from `app/_lib/auth-client.ts`. The client connects to `NEXT_PUBLIC_API_URL`. Session checks use `authClient.useSession()` in Client Components — never use middleware for auth.

### API Layer (planned)

**Orval** generates typed fetch functions and TanStack Query hooks from the backend OpenAPI spec:
- Server-side fetching: functions from `@app/_lib/api/fetch-generated/index.ts`
- Client-side fetching: hooks from `@lib/api/rc-generated/index.ts`

If a needed function is missing after running `npx orval`, stop and notify the user.

### Styling

Tailwind CSS v4 with shadcn/ui theme. All colors must use CSS variable tokens defined in `app/globals.css` (e.g., `bg-primary`, `text-foreground`, `border-border`). Custom colors go into `globals.css` following the existing pattern. Never use hardcoded Tailwind color classes.

### Environment Variables

Copy `.env.example` to `.env`:
- `NEXT_PUBLIC_API_URL` — backend base URL (used by BetterAuth client and API fetch functions)
