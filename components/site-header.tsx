import Link from "next/link";
import { PawMark } from "./paw-mark";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Booking Enquiry", href: "/#booking" },
  { label: "Vaccination Policy", href: "/vaccination-policy" },
  { label: "Preparing for Stay", href: "/preparing-for-stay" },
  { label: "Trial Familiarisation", href: "/trial-familiarisation" },
  { label: "Enrichment & Exercise", href: "/enrichment-and-exercise" },
  { label: "Dogs Under 12 Months", href: "/dogs-under-12-months" },
  { label: "Gallery", href: "/gallery" },
];

function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  return (
    <ul
      className={
        mobile
          ? "grid gap-1"
          : "flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
      }
    >
      {navigation.map((item) => (
        <li key={item.label}>
          <Link
            href={item.href}
            className={
              mobile
                ? "block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-800"
                : "text-sm font-medium text-slate-600 hover:text-blue-800"
            }
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-blue-100 bg-white/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 text-blue-950"
          aria-label="Doggy Day Care home"
        >
          <span className="grid size-10 place-items-center text-blue-800">
            <PawMark className="size-8" />
          </span>
          <span className="max-w-48 text-sm font-bold leading-tight tracking-tight sm:text-base">
            Doggy Day Care
            <span className="block font-medium text-blue-700">&amp; Home Boarding</span>
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden flex-1 xl:block">
          <NavigationLinks />
        </nav>

        <Link
          href="/#booking"
          className="hidden shrink-0 bg-blue-800 px-5 py-3 text-sm font-bold text-white hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 sm:inline-flex"
        >
          Book a stay
        </Link>

        <details className="group relative xl:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 border border-blue-200 px-4 py-2.5 text-sm font-bold text-blue-900 hover:bg-blue-50 [&::-webkit-details-marker]:hidden">
            Menu
            <span aria-hidden="true" className="text-lg leading-none group-open:rotate-45">
              +
            </span>
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 top-14 w-[min(21rem,calc(100vw-2.5rem))] border border-blue-100 bg-white p-3 shadow-xl"
          >
            <NavigationLinks mobile />
            <Link
              href="/#booking"
              className="mt-2 flex justify-center bg-blue-800 px-4 py-3 text-sm font-bold text-white"
            >
              Book a stay
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
