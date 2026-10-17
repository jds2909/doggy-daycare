import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <>
      <nav aria-label="Admin" className="mb-10 flex items-center justify-between border-b border-slate-300 pb-5">
        <Link href="/admin/enquiries" className="font-bold text-blue-900 underline">Booking enquiries</Link>
        <form action={logout}><button className="border border-slate-400 px-4 py-2">Log out</button></form>
      </nav>
      {children}
    </>
  );
}
