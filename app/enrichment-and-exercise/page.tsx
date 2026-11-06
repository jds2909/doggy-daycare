import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Enrichment & Exercise | Doggy Day Care & Home Boarding",
  description:
    "How daily walks, play, rest and enrichment are adapted to each dog in our care.",
};

export default function EnrichmentAndExercisePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <header className="bg-[#f6f2e9]">
          <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex items-center px-5 py-14 sm:px-10 sm:py-20 lg:px-14 xl:px-20">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                  Daily enrichment and exercise
                </p>
                <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                  A balanced day of walks, play and rest
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-700">
                  Each dog&apos;s normal exercise routine, age, behaviour and health
                  guide the pace of their day, with comfortable places to rest between
                  activities.
                </p>
              </div>
            </div>
            <figure className="relative min-h-[360px] sm:min-h-[500px] lg:min-h-[620px]">
              <Image
                src="/photos/dog-walk.jpg"
                alt="Fargo walking with another dog through green open space"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 55vw"
                className="object-cover object-center"
              />
              <figcaption className="absolute bottom-0 right-0 bg-white px-5 py-3 text-sm text-slate-700">
                Walks are adapted to the dogs in our care.
              </figcaption>
            </figure>
          </div>
        </header>

        <article className="px-5 py-16 sm:px-10 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <section
              className="grid gap-10 border-b border-slate-300 pb-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"
              aria-labelledby="routine-heading"
            >
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                  Built around your dog
                </p>
                <h2
                  id="routine-heading"
                  className="mt-3 text-3xl font-bold tracking-tight text-slate-900"
                >
                  Their usual routine comes first
                </h2>
              </div>
              <div className="space-y-5 text-lg leading-8 text-slate-700">
                <p>
                  At registration, we will discuss your dog&apos;s daily exercise routine
                  and record it on the registration form. There will normally be two
                  daily walks, or fewer depending on your dog&apos;s age, behaviour or
                  current medical condition.
                </p>
                <p>
                  Plenty of resting places are available, including beds, cosy nooks
                  and garden spaces, with a comfortable, temperature-neutral indoor
                  environment.
                </p>
              </div>
            </section>

            <section className="py-16" aria-labelledby="walks-heading">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                  Out and about
                </p>
                <h2
                  id="walks-heading"
                  className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
                >
                  Morning park walks and afternoon town walks
                </h2>
              </div>

              <div className="mt-10 grid border-t border-slate-300 lg:grid-cols-2">
                <section className="border-b border-slate-300 py-8 lg:border-r lg:pr-12">
                  <h3 className="text-2xl font-bold text-blue-950">Morning</h3>
                  <p className="mt-4 leading-7 text-slate-700">
                    The morning walk is normally an hour in Coronation Park. The council
                    footpath opposite the house leads directly to the park, so no
                    transport is required. Younger dogs can also meet dogs from outside
                    their household to support normal social development.
                  </p>
                  <p className="mt-4 leading-7 text-slate-700">
                    A maximum of three dogs will join any one morning park walk.
                  </p>
                </section>
                <section className="border-b border-slate-300 py-8 lg:pl-12">
                  <h3 className="text-2xl font-bold text-blue-950">Late afternoon</h3>
                  <p className="mt-4 leading-7 text-slate-700">
                    At approximately 16:00, the afternoon walk follows one of several
                    routes through Launceston. The longest is a 45-minute loop through
                    the castle, with shorter road routes chosen to suit each dog.
                  </p>
                  <p className="mt-4 leading-7 text-slate-700">
                    A maximum of two dogs will join any one road walk.
                  </p>
                </section>
              </div>

              <p className="mt-7 max-w-4xl leading-7 text-slate-700">
                Dogs remain on leads unless written off-lead consent has been given on
                the registration form. Younger dogs can become familiar with people,
                traffic, bicycles and the bustle of town life. Walks may be reduced to
                suit a dog&apos;s age, behaviour or current medical condition.
              </p>
            </section>

            <section
              className="grid items-center gap-10 bg-[#e9eee5] px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
              aria-labelledby="play-heading"
            >
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                  At home
                </p>
                <h2
                  id="play-heading"
                  className="mt-3 text-3xl font-bold tracking-tight text-slate-900"
                >
                  Play, enrichment and time to switch off
                </h2>
                <div className="mt-6 space-y-4 leading-7 text-slate-700">
                  <p>
                    Toys and training treats offer enrichment, while balls and
                    frisbees give more active dogs short periods of higher-intensity
                    exercise. A cooling-off walk around the edge of the park follows
                    intense activity before returning home.
                  </p>
                  <p>
                    Between rest periods, games and play are available indoors and in
                    the garden, alongside the option to sunbathe or simply relax. Toys
                    are cleaned with Milton between dogs. If dogs become competitive,
                    they will be managed or the toy will be removed.
                  </p>
                </div>
              </div>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/photos/secure-garden.jpg"
                    alt="The secure garden where dogs can play, rest and spend time outside"
                    fill
                    sizes="(max-width: 1023px) 100vw, 44vw"
                    className="object-cover object-center"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-slate-600">
                  Garden time is balanced with walks and indoor rest.
                </figcaption>
              </figure>
            </section>

            <section className="pt-16" aria-labelledby="care-heading">
              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                    Throughout the day
                  </p>
                  <h2
                    id="care-heading"
                    className="mt-3 text-3xl font-bold tracking-tight text-slate-900"
                  >
                    Supervision, water and individual care
                  </h2>
                </div>
                <ul className="border-t border-slate-300">
                  <li className="border-b border-slate-300 py-5 leading-7 text-slate-700">
                    Dogs are not left unsupervised, and special attention is given to
                    dogs who are medically unable to walk away from the property.
                  </li>
                  <li className="border-b border-slate-300 py-5 leading-7 text-slate-700">
                    Water is offered regularly in a steel bowl during activity,
                    especially in warm weather, and fresh water is always available in
                    the garden.
                  </li>
                  <li className="border-b border-slate-300 py-5 leading-7 text-slate-700">
                    The garden is checked regularly and dog waste is removed. Waste is
                    bagged and disposed of during walks away from the property.
                  </li>
                  <li className="border-b border-slate-300 py-5 leading-7 text-slate-700">
                    When required, Fargo stays at home while walks take place; he is
                    well acclimatised to doing so.
                  </li>
                </ul>
              </div>
            </section>

            <section
              className="mt-16 flex flex-col gap-6 border-t border-slate-300 pt-10 sm:flex-row sm:items-center sm:justify-between"
              aria-labelledby="enrichment-contact-heading"
            >
              <div>
                <h2
                  id="enrichment-contact-heading"
                  className="text-2xl font-bold text-slate-900"
                >
                  Tell us about your dog&apos;s routine
                </h2>
                <p className="mt-2 leading-7 text-slate-700">
                  Include their normal exercise, rest and care needs in your enquiry.
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
