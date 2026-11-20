<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# FixMate (client)

Next.js 16 App Router frontend for a device-repair marketplace (customers book repairs, technicians offer services, admins manage). No `src/` directory — `app/` sits at the repo root. Package manager is npm (`package-lock.json`).

## Commands

- `npm run dev` — dev server on http://localhost:3000
- `npm run typecheck` — `tsc --noEmit`; the fastest real verification
- `npm run lint` — ESLint flat config
- `npm run format` — Prettier over the whole repo; prefer `npx prettier --write <files>` so you don't churn unrelated files

There is no test runner and no test files. Do not invent a test command.

## Known baseline (don't chase these)

- `npm run lint` already fails on `react-hooks/set-state-in-effect` in `components/ui/carousel.tsx` and `hooks/use-mobile.ts` (shadcn-generated code), plus an unused `data` warning in `app/(auth)/sign-in/page.tsx`.
- `npm run typecheck` fails while role casing disagrees between `types/fixmate.ts` and `lib/auth.ts` (see Auth).

## Structure

- `app/` — routes: `page.tsx` (landing), `(auth)/sign-in`, `(auth)/sign-up`, `api/auth/[...all]/route.ts` (BetterAuth handler)
- `app/layout.tsx` — wraps **every** route in `NavBar` + `Footer` + `Toaster` + `ThemeProvider`; no route group escapes this chrome
- `components/ui/` — shadcn components (generated; don't hand-edit to fix app bugs)
- `components/homePage/` — landing page sections
- `lib/auth.ts` / `lib/auth-client.ts` — BetterAuth server/client config
- `types/fixmate.ts` — domain types and the single source of truth (`UserRole = "customer" | "technician" | "admin"`)
- `@/*` maps to the repo root, e.g. `@/lib/auth`, `@/components/ui/button`

## Auth (BetterAuth + MongoDB)

- Server config in `lib/auth.ts`: `betterAuth` + `mongodbAdapter`, DB name hardcoded as `FixMatedb`
- Client in `lib/auth-client.ts`: `createAuthClient` + `inferAdditionalFields<typeof auth>()`; call `authClient.signUp.email(...)` / `authClient.signIn.email(...)`
- Env lives in gitignored `.env` with live Atlas credentials — never commit, print, or hardcode them. Needed: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_DB_URI`. `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are read but missing, so the Google buttons are stubs that only toast
- `role` is a custom `additionalFields` entry. `input: true` is required for the client to set it on sign-up; with `input: false` BetterAuth rejects the field (`parseInputData` in `node_modules/better-auth/dist/db/schema.mjs`)
- Role casing is currently inconsistent: `types/fixmate.ts` and dashboard routing use lowercase, while `lib/auth.ts` declares `["Customer", "Technician", "Admin"]`. Lowercase is the domain convention — align both sides when touching auth
- BetterAuth is v1.7, which differs from older docs; read the installed package when field behavior is unclear

## UI conventions

- Tailwind v4 with **no** `tailwind.config.*`; theme tokens live in `app/globals.css` (`@theme inline` + CSS vars)
- shadcn style is `base-nova` built on **`@base-ui/react`** (not Radix). Add components with `npx shadcn@latest add <name>`
- `cn` comes from the `cn` npm package; `lib/utils.ts` re-exports it. Generated components import `"cn"` directly, app code uses `@/lib/utils`
- Auth pages define their own visual language: indigo→violet gradients, `rounded-3xl` glass cards (`bg-white/85 backdrop-blur-xl`), `h-11 rounded-xl` inputs. Match the surrounding page, not default shadcn styles
- Prettier is configured for no semicolons, double quotes, 80 columns, with the Tailwind class sorter. Existing files are mixed (sign-in uses semicolons) — match the file you edit rather than reformatting it

## Gotchas

- `router.push` targets such as `/dashboard/customer` and `/dashboard/technician` do not exist yet — only the routes listed above are real pages.
- `components.json` sets `rsc: true`; interactive pages are `"use client"`.
