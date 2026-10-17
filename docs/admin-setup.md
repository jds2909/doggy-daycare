# Owner admin setup

The admin interface uses Supabase Auth email/password login and allows exactly the user UUID configured in `ADMIN_USER_ID`. It provides an enquiry list, full enquiry details, status changes and logout.

## Supabase Dashboard

Use the same Supabase project as the booking database.

1. Open **Authentication → Sign In / Providers**. Enable the **Email** provider and save.
2. Under **User Signups**, disable **Allow new users to sign up** and save. Keep anonymous sign-ins disabled. No public registration is required.
3. Open **Authentication → URL Configuration**. Set **Site URL** to `https://www.launcestondogboarding.com` (or the canonical production hostname used for deployment) and save. Password login does not require a callback route or additional redirect URLs.
4. Open **Authentication → Users → Add user → Create new user**. Enter the owner's email and a strong password. Enable **Auto Confirm User**, then create the user. Use **Create new user**, rather than the email invitation flow; this MVP has no invitation acceptance or password recovery page.
5. Open the created user and copy its **User UID** (the UUID), not its email address. This becomes `ADMIN_USER_ID`.
6. Open the project's **Settings → API Keys** (also available through **Connect**) and copy its **publishable key**. This becomes `SUPABASE_PUBLISHABLE_KEY`. Use the project URL already configured as `SUPABASE_URL`.

No owner account is created by the application. Dashboard labels may vary slightly. See [Supabase Auth configuration](https://supabase.com/docs/guides/auth/general-configuration) and [API keys](https://supabase.com/docs/guides/api/api-keys).

## Local environment

Add these values to the existing, ignored `.env.local` file:

```dotenv
SUPABASE_PUBLISHABLE_KEY=your-project-publishable-key
ADMIN_USER_ID=the-owner-user-uuid
```

Keep the existing `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and booking/email variables. Never add the service-role key to a `NEXT_PUBLIC_` variable or commit credentials. Restart `npm run dev` after configuring variables, then open `http://localhost:3000/admin/login` and sign in with the account created above.

## Vercel

1. Open the existing Vercel project → **Settings → Environment Variables**.
2. Add `SUPABASE_PUBLISHABLE_KEY` and `ADMIN_USER_ID` with the corresponding values. Select **Production**. Configure Preview/Development separately only if admin access is intended in those environments, using the matching Supabase project and owner UUID.
3. Keep the existing production `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `BOOKING_NOTIFICATION_EMAIL`, `BOOKING_FROM_EMAIL` and `BOOKING_ALLOWED_ORIGINS` values.
4. Redeploy the project so the environment changes take effect. Visit `https://www.launcestondogboarding.com/admin/login` (or the canonical production hostname).

## Authorization and sessions

Supabase access/refresh tokens are stored in HTTP-only, SameSite=Lax cookies scoped to `/admin`, with Secure enabled in production. A per-request SSR Auth client handles cookies; Proxy refreshes tokens on admin requests. No browser Supabase client is used.

Every enquiry read and status update calls `requireAdmin()` before accessing the existing server-only service-role client. The guard asks Supabase Auth for the current user and compares its UUID with `ADMIN_USER_ID`. Missing/invalid configuration or failed authentication denies access. Layout/Proxy checks are additional plumbing, not the data authorization boundary.

The service-role client bypasses RLS, so these server checks are essential. Existing RLS, public-role revocations and migrations are unchanged. An authenticated Supabase user still has no direct table access. Admin data is fetched per request without shared caching; admin responses use private/no-store cache headers. Logout signs out the current session and clears local admin cookies even if Auth is unavailable.

## Files added or changed

| File | Responsibility |
| --- | --- |
| `proxy.ts` | Runs session refresh only on `/admin/:path*`. |
| `lib/supabase-auth-config.ts` | Server-only Auth environment configuration and cookie settings. |
| `lib/supabase-auth-server.ts` | Creates a per-request cookie-backed Supabase Auth client; only actions write cookies here. |
| `lib/supabase-auth-proxy.ts` | Refreshes sessions, forwards updated cookies and marks responses private/no-store. |
| `lib/admin/auth.ts` | Validates owner UUID configuration and implements the central `requireAdmin()` guard using `getUser()`. |
| `lib/admin/enquiry-schema.ts` | Defines the four allowed statuses, server input/result validation and action-state types. |
| `lib/admin/enquiries.ts` | Guards every list/detail read and status update before obtaining the service-role client. |
| `app/admin/layout.tsx` | Dynamic admin layout, page metadata and no-index instructions. |
| `app/admin/error.tsx` | Generic admin failure message with retry; no raw database/Auth errors. |
| `app/admin/actions.ts` | Validates login, rejects non-owner accounts, handles Supabase sign-in/sign-out and cookie clearing. |
| `app/admin/login/page.tsx` | Login page and access-denied feedback. |
| `app/admin/login/login-form.tsx` | Credential form with pending and error feedback; calls the login Server Action. |
| `app/admin/(protected)/layout.tsx` | Additional session guard, enquiry navigation and logout form. |
| `app/admin/(protected)/enquiries/page.tsx` | Paginated server-rendered enquiry summaries, newest first. |
| `app/admin/(protected)/enquiries/actions.ts` | Status Server Action, delegating to the guarded data operation and refreshing admin routes after success. |
| `app/admin/(protected)/enquiries/status-form.tsx` | Four-status selection and save/error feedback. |
| `app/admin/(protected)/enquiries/[id]/page.tsx` | Complete business detail view: owner, booking, record timestamps, dog identity/insurance, health, care and permissions. |
| `app/admin/(protected)/enquiries/[id]/not-found.tsx` | Missing/invalid enquiry response with navigation back to the list. |
| `tests/admin-authorization.test.mjs` | Focused tests of server authorization, login and data operations with mocked external boundaries. |
| `.env.example` | Adds placeholder publishable key and owner UUID, with no credentials. |
| `package.json`, `package-lock.json` | Adds and locks `@supabase/ssr` for Supabase-managed cookie sessions. |
| `README.md` | Documents admin capabilities, routes and this setup guide. |
| `docs/admin-setup.md` | Manual account/environment setup, security explanation, file map and verification checklist. |

## Manual verification

- In a signed-out/private browser, open `/admin/enquiries` and an enquiry detail URL: both must redirect to login without enquiry data.
- Sign in as the configured owner. Check the list, pagination where applicable, and all dog identity, health, care and permission fields on a detail page.
- Save each allowed status (`NEW`, `PENDING_REVIEW`, `CONTACTED`, `CLOSED`) and reload the list/detail to confirm persistence.
- Modify a submitted status to an invalid value: the server must reject it without updating the row.
- If another test account already exists, confirm it cannot log in as admin or access enquiries. Do not enable public signups to test this.
- Log out, reload a protected URL and confirm it redirects to login. Confirm a session still works after access-token refresh.
- Verify the public booking flow still works without signing in. Its endpoint and database RPC are unchanged.

Run `node --test tests/admin-authorization.test.mjs` for focused tests of the actual server modules with mocked Auth/database boundaries. These cover owner authorization, denied data access, login validation, allowed status mutations, pagination and detail data preservation.

Lint/build validate code and types; live Auth/database checks require the manual configuration above. There are no registration, account recovery, customer editing or deletion features in this MVP.
