import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Vaccination Policy | Doggy Day Care & Home Boarding",
  description:
    "Vaccination requirements for dogs attending day care or home boarding in Launceston, Cornwall.",
};

const puppyVaccinations = [
  {
    term: "Core vaccinations",
    detail: "Parvovirus, distemper, hepatitis and leptospirosis.",
  },
  {
    term: "Second dose",
    detail:
      "Given at 10 to 12 weeks old, two weeks after the core vaccination. Keep your puppy indoors and away from unvaccinated dogs for one to two weeks after this injection.",
  },
  {
    term: "Optional vaccinations",
    detail:
      "Kennel cough, which is usually given as a nasal spray, and rabies where required for international travel.",
  },
];

const boosterVaccinations = [
  {
    term: "Core vaccines",
    detail: "Parvovirus, distemper and hepatitis: every three years.",
  },
  {
    term: "Annual vaccines",
    detail: "Leptospirosis and kennel cough: every year.",
  },
  {
    term: "Rabies",
    detail: "Optional for international travel: every one to three years.",
  },
];

function PolicyList({
  items,
}: {
  items: ReadonlyArray<{ term: string; detail: string }>;
}) {
  return (
    <dl className="mt-7 border-t border-slate-300">
      {items.map((item) => (
        <div
          key={item.term}
          className="grid gap-2 border-b border-slate-300 py-6 sm:grid-cols-[12rem_1fr] sm:gap-8"
        >
          <dt className="font-bold text-blue-950">{item.term}</dt>
          <dd className="leading-7 text-slate-700">{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function VaccinationPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <header className="bg-[#f6f2e9] px-5 py-14 sm:px-10 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
              Before your dog stays with us
            </p>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Vaccination policy
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
              Dogs must be up to date with their vaccinations before staying with us.
              Vaccinations and boosters should cover kennel cough, parvovirus,
              distemper, hepatitis and leptospirosis, as advised by your vet.
            </p>
          </div>
        </header>

        <article className="px-5 py-16 sm:px-10 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <section
              className="grid gap-10 border-b border-slate-300 pb-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20"
              aria-labelledby="requirements-heading"
            >
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                  What you need to do
                </p>
                <h2
                  id="requirements-heading"
                  className="mt-3 text-3xl font-bold tracking-tight text-slate-900"
                >
                  Before boarding
                </h2>
              </div>

              <div>
                <p className="text-lg leading-8 text-slate-700">
                  Primary core vaccinations must be completed at least two weeks before
                  your dog can be accepted for boarding.
                </p>
                <ul className="mt-7 space-y-4 text-slate-700">
                  <li className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 size-2 shrink-0 rounded-full bg-blue-800"
                    />
                    <span className="leading-7">
                      Please bring your dog&apos;s vaccination record with you.
                    </span>
                  </li>
                  <li className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 size-2 shrink-0 rounded-full bg-blue-800"
                    />
                    <span className="leading-7">
                      A copy of the vaccination record will be taken and kept on file.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <section
              className="grid gap-10 py-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20"
              aria-labelledby="protection-heading"
            >
              <h2
                id="protection-heading"
                className="text-3xl font-bold tracking-tight text-slate-900"
              >
                Helping to protect every dog
              </h2>
              <p className="text-lg leading-8 text-slate-700">
                Many diseases are airborne, so we cannot guarantee control of what may
                be passed around. Vaccination requirements, together with meticulous
                cleaning and hygiene, help us do our utmost to protect your dog while
                they are in our care.
              </p>
            </section>

            <section
              className="bg-[#e9eee5] px-6 py-10 sm:px-10 sm:py-12"
              aria-labelledby="puppy-heading"
            >
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                8 to 16 weeks of age
              </p>
              <h2
                id="puppy-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-900"
              >
                Puppy vaccinations
              </h2>
              <PolicyList items={puppyVaccinations} />
            </section>

            <section className="pt-16" aria-labelledby="booster-heading">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                Ongoing protection
              </p>
              <h2
                id="booster-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-900"
              >
                Booster vaccinations
              </h2>
              <PolicyList items={boosterVaccinations} />
            </section>

            <section
              className="mt-16 flex flex-col gap-6 border-t border-slate-300 pt-10 sm:flex-row sm:items-center sm:justify-between"
              aria-labelledby="questions-heading"
            >
              <div>
                <h2 id="questions-heading" className="text-2xl font-bold text-slate-900">
                  Have a question about your dog&apos;s stay?
                </h2>
                <p className="mt-2 leading-7 text-slate-700">
                  Call Kerry to talk through the requirements before making an enquiry.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:items-end">
                <a
                  href="tel:+447856363408"
                  className="font-bold text-blue-800 underline decoration-blue-300 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-800"
                >
                  Call 07856 363408
                </a>
                <Link
                  href="/booking-enquiry"
                  className="inline-flex justify-center bg-blue-800 px-6 py-3 font-bold text-white hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
                >
                  Make a booking enquiry
                </Link>
              </div>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
