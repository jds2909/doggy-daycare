import "server-only";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createAuthClient } from "@/lib/supabase-auth-server";

export function getAdminUserId() {
  const result = z.uuid().safeParse(process.env.ADMIN_USER_ID);
  if (!result.success) throw new Error("Admin authentication is not configured.");
  return result.data;
}

export async function requireAdmin() {
  const ownerId = getAdminUserId();
  const supabase = await createAuthClient();
  let user;
  try {
    const result = await supabase.auth.getUser();
    if (!result.error) user = result.data.user;
  } catch {
    // Network failures must never grant access to the service-role client.
  }
  if (!user) redirect("/admin/login");
  if (user.id !== ownerId) redirect("/admin/login?denied=1");
  return user;
}
