import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Preparing for Your Dog's Stay | Doggy Day Care & Home Boarding",
  description:
    "What to arrange and bring so your dog can enjoy a comfortable home-from-home stay in Launceston.",
};

const packingItems = [
  {
    title: "Meals and feeding instructions",
    text: "Bring portioned meals, or clear instructions showing the correct amount, so your dog's usual diet and nutritional routine can continue. You are welcome to bring familiar food and water bowls, although sterilised stainless-steel bowls are available.",
  },
  {
    title: "Prescribed medication",
    text: "Bring any veterinary-prescribed medication your dog needs so their treatment and health-maintenance programme can continue without interruption.",
  },
  {
    title: "Familiar comforts",
    text: "Beds, blankets, toys and other familiar items from home are encouraged to help your dog settle. Comfortable guest dog beds are also available if that is easier.",
  },
  {
    title: "Favourite activities",
    text: "Tell Kerry what your dog enjoys most, whether that is a scratch in a favourite spot, a brush, ball or tug games, or a treat treasure hunt in the garden. These details help make their stay feel personal.",
  },
];

export default function PreparingForStayPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <header className="bg-[#f6f2e9] px-5 py-14 sm:px-10 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
              A comfortable start
            </p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Preparing for your dog&apos;s stay
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
              Leaving a treasured family dog in a new home can feel daunting. A little
              preparation helps them settle into a safe, enjoyable stay and gives you
              confidence that they are in warm, attentive hands.
            </p>
          </div>
        </header>

        <article className="px-5 py-16 sm:px-10 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <section
              className="grid items-center gap-12 border-b border-slate-300 pb-16 lg:grid-cols-[1fr_1fr] lg:gap-20"
              aria-labelledby="peace-of-mind-heading"
            >
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                  Peace of mind
                </p>
                <h2
                  id="peace-of-mind-heading"
                  className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
                >
                  A familiar routine in a family home
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-700">
                  Kerry knows that the first handover can feel rather like a child&apos;s
                  first day at nursery. Dogs are cared for as individuals, with their
                  usual routines, comforts and favourite activities taken into account.
                </p>
                <p className="mt-5 leading-7 text-slate-700">
                  Daily updates by text are available if you would like them. The aim is
                  for you to enjoy worry-free time away while your dog enjoys a relaxed,
                  loving home from home.
                </p>
              </div>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/photos/dogs-resting-home.jpg"
                    alt="Two dogs resting comfortably together on beds inside the family home"
                    fill
                    sizes="(max-width: 1023px) 100vw, 48vw"
                    className="object-cover object-center"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-slate-500">
                  Familiar comforts and quiet places help dogs settle in.
                </figcaption>
              </figure>
            </section>

            <section className="py-16" aria-labelledby="before-arrival-heading">
              <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                    Before arrival
                  </p>
                  <h2
                    id="before-arrival-heading"
                    className="mt-3 text-3xl font-bold tracking-tight text-slate-900"
                  >
                    Health and eligibility
                  </h2>
                </div>
                <div className="space-y-6 text-lg leading-8 text-slate-700">
                  <p>
                    Your dog&apos;s vaccinations must be current, and you will need to
                    bring their vaccination card so a copy can be kept with their
                    records. Please read the dedicated{" "}
                    <Link
                      href="/vaccination-policy"
                      className="font-bold text-blue-800 underline decoration-blue-300 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-800"
                    >
                      vaccination policy
                    </Link>{" "}
                    for the required coverage and timings.
                  </p>
                  <p>
                    Female dogs in season cannot be accepted. Male dogs over nine
                    months of age must be neutered.
                  </p>
                </div>
              </div>
            </section>

            <section
              className="bg-[#e9eee5] px-6 py-10 sm:px-10 sm:py-12"
              aria-labelledby="packing-heading"
            >
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                What to bring
              </p>
              <h2
                id="packing-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-900"
              >
                Pack the things that make your dog feel at home
              </h2>
              <div className="mt-8 grid border-t border-slate-300 md:grid-cols-2">
                {packingItems.map((item, index) => (
                  <section
                    key={item.title}
                    className={`border-b border-slate-300 py-7 ${
                      index % 2 === 0 ? "md:pr-10" : "md:border-l md:pl-10"
                    }`}
                  >
                    <h3 className="text-xl font-bold text-blue-950">{item.title}</h3>
                    <p className="mt-3 leading-7 text-slate-700">{item.text}</p>
                  </section>
                ))}
              </div>
            </section>

            <section className="py-16" aria-labelledby="goal-heading">
              <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                    A stay to look forward to
                  </p>
                  <h2
                    id="goal-heading"
                    className="mt-3 text-3xl font-bold tracking-tight text-slate-900"
                  >
                    Fun, relaxing and personal
                  </h2>
                </div>
                <div className="space-y-5 text-lg leading-8 text-slate-700">
                  <p>
                    Every dog has different preferences. Sharing the small details that
                    help your dog relax enables Kerry to shape their day around what
                    feels familiar and rewarding to them.
                  </p>
                  <p>
                    The goal is for your beloved family dog to enjoy their visit and
                    look forward to staying with Kerry and Fargo again.
                  </p>
                </div>
              </div>
            </section>

            <section
              className="flex flex-col gap-7 border-t border-slate-300 pt-10 sm:flex-row sm:items-center sm:justify-between"
              aria-labelledby="prepare-contact-heading"
            >
              <div>
                <h2
                  id="prepare-contact-heading"
                  className="text-2xl font-bold text-slate-900"
                >
                  Ready to talk about a stay?
                </h2>
                <p className="mt-2 max-w-2xl leading-7 text-slate-700">
                  Whether you need care for a day or a longer stay, Kerry would be happy
                  to hear about your dog and the dates you have in mind.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:items-end">
                <a
                  href="tel:+447856363408"
                  className="font-bold text-blue-800 underline decoration-blue-300 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-800"
                >
                  Call or text 07856 363408
                </a>
                <a
                  href="mailto:kerrysnudge@gmail.com"
                  className="font-bold text-blue-800 underline decoration-blue-300 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-800"
                >
                  kerrysnudge@gmail.com
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
