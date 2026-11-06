import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Trial Familiarisation | Doggy Day Care & Home Boarding",
  description:
    "How trial familiarisation helps dogs settle before day care or home boarding in Launceston.",
};

const observations = [
  "Any fear or aggression towards Kerry or other dogs, both on and off the lead.",
  "Any barking or growling.",
  "Whether your dog is happy to play and interact with people and other dogs.",
  "Whether your dog is happy to explore without attempting to escape.",
  "Any signs of illness or injury not mentioned on the dog registration form.",
];

export default function TrialFamiliarisationPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <header className="bg-[#f6f2e9] px-5 py-14 sm:px-10 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
              Getting acquainted
            </p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Trial familiarisation before your dog&apos;s stay
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
              A calm introduction gives your dog time to explore the home, meet Fargo
              and any other dogs present, and begin settling before day care or
              boarding.
            </p>
          </div>
        </header>

        <article className="px-5 py-16 sm:px-10 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <section
              className="grid gap-10 border-b border-slate-300 pb-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20"
              aria-labelledby="arrival-heading"
            >
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                  Step one
                </p>
                <h2
                  id="arrival-heading"
                  className="mt-3 text-3xl font-bold tracking-tight text-slate-900"
                >
                  Arriving and meeting
                </h2>
              </div>
              <div className="space-y-5 text-lg leading-8 text-slate-700">
                <p>
                  You will be shown around the ground floor and garden. All dogs will
                  remain on leads while they are introduced, and the relevant consent
                  forms will be completed and signed.
                </p>
                <p>
                  Once the dogs have greeted one another, they will be let off lead to
                  mingle independently. Kerry and the owner can then observe them while
                  talking about the dog&apos;s character and general behaviour.
                </p>
              </div>
            </section>

            <section className="py-16" aria-labelledby="observations-heading">
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                    What we look for
                  </p>
                  <h2
                    id="observations-heading"
                    className="mt-3 text-3xl font-bold tracking-tight text-slate-900"
                  >
                    Feeling safe and comfortable
                  </h2>
                </div>
                <ul className="border-t border-slate-300">
                  {observations.map((observation) => (
                    <li
                      key={observation}
                      className="flex gap-4 border-b border-slate-300 py-5 leading-7 text-slate-700"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2.5 size-2 shrink-0 rounded-full bg-blue-800"
                      />
                      <span>{observation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section
              className="bg-[#e9eee5] px-6 py-10 sm:px-10 sm:py-12"
              aria-labelledby="settling-heading"
            >
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                Step two
              </p>
              <h2
                id="settling-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-900"
              >
                Settling after you leave
              </h2>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                Once you feel reassured and leave, your dog will be observed closely
                and reassured for an hour. Kerry will look for separation anxiety or
                unusual behaviour, then contact you to confirm that your dog has
                integrated and settled in.
              </p>
              <p className="mt-5 max-w-3xl leading-7 text-slate-700">
                If your dog appears overly distressed, you can collect them or allow
                more time for Kerry to work with them and help them settle.
              </p>
            </section>

            <section className="pt-16" aria-labelledby="trial-options-heading">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                Trial options
              </p>
              <h2
                id="trial-options-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-900"
              >
                Extra time before a longer stay
              </h2>
              <dl className="mt-7 border-t border-slate-300">
                <div className="grid gap-2 border-b border-slate-300 py-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
                  <dt className="font-bold text-blue-950">One-hour trial</dt>
                  <dd className="leading-7 text-slate-700">
                    An optional one-hour trial before a full day or overnight stay costs
                    £10.00.
                  </dd>
                </div>
                <div className="grid gap-2 border-b border-slate-300 py-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
                  <dt className="font-bold text-blue-950">Trial night</dt>
                  <dd className="leading-7 text-slate-700">
                    New dogs staying for longer than three nights will have a trial
                    night charged at £45.00 per dog. Only one dog is accepted at a time,
                    unless the dogs are from the same household.
                  </dd>
                </div>
              </dl>
            </section>

            <section
              className="mt-16 flex flex-col gap-6 border-t border-slate-300 pt-10 sm:flex-row sm:items-center sm:justify-between"
              aria-labelledby="trial-contact-heading"
            >
              <div>
                <h2
                  id="trial-contact-heading"
                  className="text-2xl font-bold text-slate-900"
                >
                  Ready to arrange an introduction?
                </h2>
                <p className="mt-2 leading-7 text-slate-700">
                  Tell us about your dog and the stay you have in mind.
                </p>
              </div>
              <Link
                href="/booking-enquiry"
                className="inline-flex shrink-0 justify-center bg-blue-800 px-6 py-3 font-bold text-white hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
              >
                Make a booking enquiry
              </Link>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
