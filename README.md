# Peach Organizer

Peach Organizer is a personal-finance app for planning cash flow. You record your wallet
balance, fixed bills, extra expenses, receivables and credit cards, and the app projects how
your balance will move day by day and month by month so you can see a tight month coming
before it arrives.

The UI is in Brazilian Portuguese (pt-BR) and amounts are formatted in BRL.

## Features

- **Google sign-in with an allowlist.** Only e-mails marked `accepted` in `tbl_allowed_users`
  can log in.
- **Wallet balance** as the starting point of every projection.
- **Fixed expenses** that repeat every month on a given day.
- **Extra expenses and receivables** that happen every month, or for a set number of months
  from a start month.
- **Credit cards** with closing and due days, recurring charges (subscriptions, gym, etc.)
  added to every invoice, and per-month invoice amounts.
- **Cash-flow chart** that simulates the balance forward, with summary cards and detail panels
  for each category.

## Tech stack

| Area          | Tools                                                                |
| ------------- | -------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router), React 19, TypeScript                        |
| Styling / UI  | Tailwind CSS 4, shadcn/ui (Radix), lucide-react, next-themes, sonner |
| Forms         | react-hook-form, zod                                                 |
| State         | Zustand                                                              |
| Charts/tables | Recharts, TanStack Table                                             |
| Auth          | NextAuth.js v4 (Google provider, JWT sessions)                       |
| Database      | Supabase (Postgres), accessed server-side with the service role key  |

## Getting started

### Prerequisites

- Node.js 20.9 or newer (Next.js 16 requirement) and npm
- A [Supabase](https://supabase.com) project
- A Google Cloud OAuth client (for sign-in)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

1. Create an empty Supabase project.
2. Open `supabase/migrations/0001_initial_schema.sql` and change the last statement to your own
   Google e-mail, so you are on the allowlist:

   ```sql
   insert into tbl_allowed_users (ds_email, ds_invite_status)
   values ('you@gmail.com', 'accepted');
   ```

3. Run the whole file in the Supabase **SQL Editor**.

Row Level Security is enabled on every table with no policies, so the public anon key can't
read or write anything. All data access goes through the Next.js API routes, which use the
service role key on the server.

To let someone else in later, insert their e-mail into `tbl_allowed_users` with
`ds_invite_status = 'accepted'`.

### 3. Create a Google OAuth client

In the [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create an
OAuth client ID of type **Web application** and add this authorized redirect URI:

```
http://localhost:3000/api/auth/callback/google
```

Add the matching `https://<your-domain>/api/auth/callback/google` URI for production.

### 4. Configure environment variables

Create a `.env.local` file in the project root (`.env*` files are git-ignored):

```bash
# Supabase (Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   # server only, never expose it

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-string>                # e.g. `openssl rand -base64 32`

# Google OAuth
GOOGLE_CLIENT_ID=<client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<client-secret>
```

| Variable                        | Used for                                                 |
| ------------------------------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase client (blocked by RLS)                  |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server-side Supabase client used by auth and API routes |
| `NEXTAUTH_URL`                  | Base URL NextAuth uses for callbacks                     |
| `NEXTAUTH_SECRET`               | Signs and encrypts the session JWT                       |
| `GOOGLE_CLIENT_ID`              | Google sign-in                                           |
| `GOOGLE_CLIENT_SECRET`          | Google sign-in                                           |

### 5. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign in with your allowlisted Google
account, and you'll be redirected to `/cash-flow`.

## Scripts

| Command         | What it does                     |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the dev server             |
| `npm run build` | Build for production             |
| `npm run start` | Serve the production build       |
| `npm run lint`  | Run ESLint                       |

## Project structure

```
proxy.ts                  Route protection (NextAuth) for /cash-flow
supabase/migrations/      Database schema
src/
  app/
    (public)/             Landing / sign-in page
    (private)/cash-flow/  Cash-flow dashboard (requires login)
    api/auth/             NextAuth route
    api/cash-flow/        REST routes: wallet, expenses, extra-expense, receivable,
                          credit-card, credit-card-balance, credit-card-invoice
  components/
    ui/                   shadcn/ui primitives
    custom/               Reusable app components
    form/                 Full forms (e.g. cash-flow-form and its private sub-components)
  hooks/                  Domain hooks (one folder per domain)
  store/                  Zustand stores
  helpers/                Date, month, currency and invoice helpers
  lib/                    Auth options, Supabase clients, metadata
  providers/              Auth, theme and user-store providers
```

Coding conventions for the project live in [`AGENTS.md`](./AGENTS.md).

## How authentication works

1. The user signs in with Google through NextAuth.
2. The `signIn` callback checks `tbl_allowed_users`. Anyone not marked `accepted` is rejected
   and sent back to `/` with an error.
3. Allowed users are upserted into `tbl_users`. The JWT carries their `id_user` and `ds_role`,
   which are mirrored into the Zustand user store on the client.
4. `proxy.ts` blocks unauthenticated access to `/cash-flow`, and every API route checks the
   session before touching the database.
