import Link from "next/link";
import { PawMark } from "./paw-mark";

export function SiteFooter() {
  return (
    <footer className="bg-blue-950 text-blue-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr] lg:px-10">
        <div>
          <div className="mb-4 flex items-center gap-3 text-white">
            <PawMark className="size-9" />
            <p className="font-bold">Doggy Day Care &amp; Home from Home Boarding</p>
          </div>
          <p className="max-w-md text-sm leading-6 text-blue-200">
            Warm, home-based care for dogs in Launceston, Cornwall, with comfort,
            companionship and individual attention at the heart of every stay.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-white">
            Visit us
          </h2>
          <address className="text-sm not-italic leading-6 text-blue-200">
            Launceston
            <br />
            Cornwall
          </address>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-white">
            Business details
          </h2>
          <p className="text-sm leading-6 text-blue-200">Fully insured</p>
          <p className="text-sm leading-6 text-blue-200">Licence no. L126-003155</p>
          <Link
            href="/#booking"
            className="mt-3 inline-block text-sm font-bold text-white underline decoration-blue-400 underline-offset-4"
          >
            Make a booking enquiry
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-blue-300">
        © {new Date().getFullYear()} Doggy Day Care &amp; Home from Home Boarding
      </div>
    </footer>
  );
}
