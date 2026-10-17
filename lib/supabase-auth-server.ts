import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { adminCookieAttributes, adminCookieOptions, getAuthConfiguration } from "@/lib/supabase-auth-config";

export async function createAuthClient(writable = false) {
  const cookieStore = await cookies();
  const { url, key } = getAuthConfiguration();

  return createServerClient(url, key, {
    cookieOptions: adminCookieOptions,
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        // Only Server Actions write here. Proxy refreshes cookies before Server Components render.
        if (!writable) return;
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, { ...options, ...adminCookieAttributes });
        });
      },
    },
  });
}
