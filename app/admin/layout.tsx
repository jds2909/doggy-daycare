import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin | Doggy Day Care",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto w-full max-w-6xl px-5 py-10 text-slate-900">{children}</main>;
}
