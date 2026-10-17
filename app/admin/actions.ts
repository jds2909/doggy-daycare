"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdminUserId } from "@/lib/admin/auth";
import { adminCookieAttributes, adminCookieName } from "@/lib/supabase-auth-config";
import { createAuthClient } from "@/lib/supabase-auth-server";

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(1024),
});

export async function login(_previous: { error: string }, formData: FormData) {
  const credentials = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!credentials.success) return { error: "Enter a valid email address and password." };

  try {
    const ownerId = getAdminUserId();
    const supabase = await createAuthClient(true);
    const { data, error } = await supabase.auth.signInWithPassword(credentials.data);
    if (error || !data.user) return { error: "Unable to sign in with these credentials." };
    if (data.user.id !== ownerId) {
      await supabase.auth.signOut({ scope: "local" });
      return { error: "Unable to sign in with these credentials." };
    }
  } catch {
    return { error: "Admin sign-in is unavailable. Please try again later." };
  }
  redirect("/admin/enquiries");
}

export async function logout() {
  try {
    const supabase = await createAuthClient(true);
    await supabase.auth.signOut({ scope: "local" });
  } catch {
    // Always remove this browser's cookies, including when Auth is unreachable.
  }
  const cookieStore = await cookies();
  for (const cookie of cookieStore.getAll()) {
    if (cookie.name === adminCookieName || cookie.name.startsWith(`${adminCookieName}.`) || cookie.name.startsWith(`${adminCookieName}-`)) {
      cookieStore.set(cookie.name, "", { ...adminCookieAttributes, maxAge: 0 });
    }
  }
  redirect("/admin/login");
}
