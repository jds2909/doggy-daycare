import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
      {children}
    </p>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-[#f6f2e9]" aria-labelledby="hero-heading">
          <div className="mx-auto grid max-w-[1440px] lg:min-h-[720px] lg:grid-cols-[0.78fr_1.22fr]">
            <div className="flex items-center px-5 py-14 sm:px-10 sm:py-20 lg:px-14 xl:px-20">
              <div className="max-w-xl">
                <p className="mb-6 text-sm font-bold text-blue-800">
                  Home-based care in Launceston, Cornwall
                </p>
                <h1
                  id="hero-heading"
                  className="text-balance text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-slate-900 sm:text-6xl"
                >
                  Their second home, <span className="text-blue-800">filled with care.</span>
                </h1>
                <p className="mt-7 text-lg leading-8 text-slate-700">
                  Friendly doggy day care and home boarding in a real family home—with
                  comfort, company, garden time and plenty of individual attention.
                </p>
                <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    href="#booking"
                    className="inline-flex justify-center bg-blue-800 px-6 py-3.5 font-bold text-white hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
                  >
                    Make a booking enquiry
                  </Link>
                  <p className="text-sm text-slate-600">Fully insured and licensed</p>
                </div>
              </div>
            </div>

            <figure className="relative min-h-[430px] sm:min-h-[560px] lg:min-h-full">
              <Image
                src="/photos/fargo-hero.jpg"
                alt="Fargo the Border Collie relaxing in long grass beneath a blue Cornish sky"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 61vw"
                className="object-cover object-[58%_center]"
              />
              <figcaption className="absolute bottom-0 right-0 bg-white px-5 py-3 text-sm text-slate-700">
                Fargo, our resident Border Collie
              </figcaption>
            </figure>
          </div>
        </section>

        <section
          className="px-5 py-20 sm:px-10 lg:py-28"
          aria-labelledby="home-heading"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div>
              <SectionLabel>A genuine home from home</SectionLabel>
              <h2
                id="home-heading"
                className="mt-4 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl"
              >
                Familiar comforts, calm company and room to settle in.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-700">
                Dogs stay as part of the household rather than in a kennel environment.
                There is time for play and socialising, but also comfortable spaces to
                switch off, nap and follow their usual routine.
              </p>
              <p className="mt-5 leading-7 text-slate-600">
                Fargo helps welcome our guests, while every dog receives care shaped
                around their age, personality and individual needs.
              </p>
            </div>

            <figure>
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/photos/dogs-resting-home.jpg"
                  alt="Two dogs resting comfortably together on beds inside the family home"
                  fill
                  sizes="(max-width: 767px) 100vw, 45vw"
                  className="object-cover object-center"
                />
              </div>
              <figcaption className="mt-3 text-sm text-slate-500">
                Quiet time and familiar comforts are part of every stay.
              </figcaption>
            </figure>
          </div>
        </section>

        <section
          id="services"
          className="border-y border-slate-200 bg-[#fbfaf7] px-5 py-20 sm:px-10 lg:py-24"
          aria-labelledby="services-heading"
        >
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <SectionLabel>Ways to stay</SectionLabel>
              <h2
                id="services-heading"
                className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl"
              >
                Simple, personal dog care.
              </h2>
            </div>

            <div className="mt-12 grid border-t border-slate-300 md:grid-cols-2">
              <article className="border-b border-slate-300 py-9 md:border-r md:pr-12">
                <h3 className="text-2xl font-bold text-blue-900">Doggy Day Care</h3>
                <p className="mt-4 max-w-md leading-7 text-slate-700">
                  A relaxed, engaging day with companionship, exercise, garden access
                  and time to rest before heading home.
                </p>
              </article>
              <article className="border-b border-slate-300 py-9 md:pl-12">
                <h3 className="text-2xl font-bold text-blue-900">
                  Home from Home Boarding
                </h3>
                <p className="mt-4 max-w-md leading-7 text-slate-700">
                  Overnight care in a lived-in home, with a familiar daily rhythm and
                  thoughtful attention throughout the stay.
                </p>
              </article>
            </div>
            <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-600">
              Personal care runs through both services. We take time to understand each
              dog before their first stay, including a trial familiarisation where
              appropriate.
            </p>
          </div>
        </section>

        <section
          className="bg-[#e9eee5] px-5 py-20 sm:px-10 lg:py-28"
          aria-labelledby="daily-life-heading"
        >
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <figure>
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/photos/secure-garden.jpg"
                  alt="The secure back garden where dogs can spend time outside, overlooking the Cornish countryside"
                  fill
                  sizes="(max-width: 1023px) 100vw, 42vw"
                  className="object-cover object-center"
                />
              </div>
              <figcaption className="mt-3 text-sm text-slate-600">
                Our secure garden in Launceston.
              </figcaption>
            </figure>

            <div className="lg:pt-12">
              <SectionLabel>Life here</SectionLabel>
              <h2
                id="daily-life-heading"
                className="mt-4 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl"
              >
                Fresh air, good walks and friendly company.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
                Days have a comfortable balance: access to the garden, suitable walks,
                enrichment, social time and plenty of opportunity to relax back at home.
              </p>

              <figure className="mt-10">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/photos/dog-walk.jpg"
                    alt="Fargo enjoying a walk with another dog in Launceston"
                    fill
                    sizes="(max-width: 1023px) 100vw, 52vw"
                    className="object-cover object-center"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-slate-600">
                  Walks and exercise are matched to the dogs in our care.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-10" aria-labelledby="trust-heading">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 border-y border-slate-300 py-10 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <SectionLabel>Peace of mind</SectionLabel>
              <h2 id="trust-heading" className="mt-3 text-3xl font-bold text-slate-900">
                Safe, responsible and properly covered.
              </h2>
            </div>
            <dl className="grid shrink-0 gap-5 sm:grid-cols-2 sm:gap-10">
              <div>
                <dt className="text-sm text-slate-500">Cover</dt>
                <dd className="mt-1 font-bold text-slate-900">Fully insured</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Licence</dt>
                <dd className="mt-1 font-bold text-slate-900">L126-003155</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          id="booking"
          className="scroll-mt-20 bg-[#f6f2e9] px-5 py-20 sm:px-10 lg:py-24"
          aria-labelledby="booking-heading"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <SectionLabel>Let’s get acquainted</SectionLabel>
              <h2
                id="booking-heading"
                className="mt-4 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl"
              >
                Could our home be your dog’s second home?
              </h2>
              <p className="mt-5 leading-7 text-slate-700">
                Tell us about your dog and the dates you have in mind. We’ll be happy to
                discuss whether we are the right fit.
              </p>
            </div>
            <a
              href="mailto:hello@example.com?subject=Doggy%20day%20care%20booking%20enquiry"
              className="inline-flex shrink-0 justify-center bg-blue-800 px-7 py-4 font-bold text-white hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            >
              Make a booking enquiry
            </a>
          </div>
          <p className="mx-auto mt-5 max-w-5xl text-xs text-slate-500">
            Placeholder email link—replace when the client’s contact details are ready.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
