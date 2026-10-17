import "server-only";

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { adminCookieAttributes, adminCookieOptions, getAuthConfiguration } from "@/lib/supabase-auth-config";

export async function refreshAdminSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  // Allow the login page to explain missing configuration without affecting public routes.
  if (process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY) {
    const { url, key } = getAuthConfiguration();
    const supabase = createServerClient(url, key, {
      cookieOptions: adminCookieOptions,
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          const previousCookies = response.cookies.getAll();
          response = NextResponse.next({ request });
          previousCookies.forEach((cookie) => response.cookies.set(cookie));
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, { ...options, ...adminCookieAttributes });
          });
        },
      },
    });
    // Signature verification/refresh here; owner authorization happens at every data operation.
    try {
      await supabase.auth.getClaims();
    } catch {
      // The data guard fails closed if Auth cannot validate the user.
    }
  }
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}
