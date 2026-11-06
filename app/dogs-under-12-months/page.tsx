import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Dogs Under 12 Months | Doggy Day Care & Home Boarding",
  description:
    "Care, routines, training and socialisation for puppies and dogs under 12 months.",
};

const youngDogCare = [
  {
    title: "Familiar training",
    text: "Current training methods and familiar commands, such as sit and lie down, can be continued so your puppy is not confused during their stay.",
  },
  {
    title: "Household confidence",
    text: "Puppies can discover new toys, receive particular attention with toileting, and become accustomed to ordinary household activities such as vacuuming, mopping floors and the washing machine.",
  },
  {
    title: "Positive socialisation",
    text: "Regular interaction with Kerry and other dogs supports healthy development. Walks can introduce traffic, cyclists, joggers, farm animals, wildlife and other everyday experiences using praise and appropriate treats.",
  },
  {
    title: "Rest and sleep",
    text: "A quiet corner is available during the day, and particular care is taken to find a secure, peaceful and comfortable place for healthy sleep at night.",
  },
];

export default function DogsUnderTwelveMonthsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <header className="bg-[#f6f2e9] px-5 py-14 sm:px-10 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
              Puppies and young dogs
            </p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Care for dogs under 12 months
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
              Young dogs need familiar routines, patient supervision, positive
              socialisation and plenty of time to rest while they settle into a new
              temporary home.
            </p>
          </div>
        </header>

        <article className="px-5 py-16 sm:px-10 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <section
              className="grid items-center gap-12 border-b border-slate-300 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20"
              aria-labelledby="getting-to-know-heading"
            >
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                  Before the stay
                </p>
                <h2
                  id="getting-to-know-heading"
                  className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
                >
                  Getting to know your young dog
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-700">
                  In line with the Animal Welfare (Licensing of Activities Involving
                  Animals) Regulations 2018, Kerry will discuss the character and daily
                  routine of every dog under 12 months with their owner.
                </p>
                <p className="mt-5 leading-7 text-slate-700">
                  Particular attention is given to any concerns about behaviour,
                  socialisation, training and how easily the dog may settle into a new
                  temporary home.
                </p>
              </div>
              <figure>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src="/photos/dog-resting.jpg"
                    alt="A young dog sleeping comfortably on a soft bed inside the family home"
                    fill
                    sizes="(max-width: 1023px) 100vw, 42vw"
                    className="object-cover object-center"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-slate-500">
                  A quiet, comfortable place to rest between new experiences.
                </figcaption>
              </figure>
            </section>

            <section className="py-16" aria-labelledby="puppy-requirements-heading">
              <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                    8 weeks and over
                  </p>
                  <h2
                    id="puppy-requirements-heading"
                    className="mt-3 text-3xl font-bold tracking-tight text-slate-900"
                  >
                    Puppy requirements and rates
                  </h2>
                </div>
                <div className="space-y-5 text-lg leading-8 text-slate-700">
                  <p>
                    Puppies aged eight weeks and over are welcome on the advice of your
                    usual vet.
                  </p>
                  <p>
                    Puppies from eight weeks to three months are charged at double the
                    normal rate to allow for additional training and regular night
                    checks.
                  </p>
                </div>
              </div>
            </section>

            <section
              className="bg-[#e9eee5] px-6 py-10 sm:px-10 sm:py-12"
              aria-labelledby="care-throughout-heading"
            >
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                During their stay
              </p>
              <h2
                id="care-throughout-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-slate-900"
              >
                Care throughout the day
              </h2>
              <div className="mt-8 grid border-t border-slate-300 md:grid-cols-2">
                {youngDogCare.map((item, index) => (
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

            <section className="pt-16" aria-labelledby="socialisation-heading">
              <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
                    Learning together
                  </p>
                  <h2
                    id="socialisation-heading"
                    className="mt-3 text-3xl font-bold tracking-tight text-slate-900"
                  >
                    Building confidence around dogs and people
                  </h2>
                </div>
                <div className="space-y-5 text-lg leading-8 text-slate-700">
                  <p>
                    We will discuss how well your dog has been socialised. On-lead park
                    walks with Kerry&apos;s tried-and-tested friendly dog companions can
                    help young dogs develop valuable interaction skills with new dogs
                    and people.
                  </p>
                  <p>
                    Young dogs can enjoy positive, supervised play in the secure back
                    garden as well as quiet periods. Fargo is patient with energetic
                    young dogs and can take on his role as a gentle “nanny dog” when
                    his skills are helpful.
                  </p>
                </div>
              </div>
            </section>

            <section
              className="mt-16 flex flex-col gap-6 border-t border-slate-300 pt-10 sm:flex-row sm:items-center sm:justify-between"
              aria-labelledby="young-dog-contact-heading"
            >
              <div>
                <h2
                  id="young-dog-contact-heading"
                  className="text-2xl font-bold text-slate-900"
                >
                  Tell us about your puppy&apos;s routine
                </h2>
                <p className="mt-2 leading-7 text-slate-700">
                  Include their training, socialisation and settling needs in your
                  enquiry.
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
