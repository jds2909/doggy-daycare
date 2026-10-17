import "server-only";

export const adminCookieName = "doggy-admin-auth";
export const adminCookieAttributes = {
  path: "/admin",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const adminCookieOptions = { name: adminCookieName, ...adminCookieAttributes };

export function getAuthConfiguration() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Admin authentication is not configured.");
  return { url, key };
}
