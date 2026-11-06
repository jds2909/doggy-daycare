import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Gallery | Doggy Day Care & Home Boarding",
  description:
    "See Fargo, visiting dogs and the real home, garden and local walks enjoyed by dogs staying in Launceston.",
};

const galleryPhotos = [
  {
    src: "/photos/fargo-hero.jpg",
    alt: "Fargo the Border Collie relaxing in long grass beneath a blue sky",
    caption: "Fargo, our resident Border Collie",
    layout: "wide",
    position: "object-center",
  },
  {
    src: "/photos/fargo-ball.jpg",
    alt: "Fargo standing outdoors with a tennis ball in his mouth",
    caption: "Always ready for another game",
    layout: "portrait",
    position: "object-center",
  },
  {
    src: "/photos/dogs-resting-home.jpg",
    alt: "Two dogs resting comfortably together on beds inside the home",
    caption: "Quiet time in a real home",
    layout: "landscape",
    position: "object-center",
  },
  {
    src: "/photos/dogs-socialising-park.jpg",
    alt: "A group of dogs relaxing together under a tree in Coronation Park",
    caption: "Friendly company in the park",
    layout: "landscape",
    position: "object-center",
  },
  {
    src: "/photos/dog-resting.jpg",
    alt: "A young dog sleeping comfortably on a soft bed",
    caption: "A comfortable place to settle",
    layout: "portrait",
    position: "object-center",
  },
  {
    src: "/photos/secure-garden.jpg",
    alt: "The secure garden where visiting dogs can play and relax",
    caption: "The secure back garden",
    layout: "wide",
    position: "object-center",
  },
  {
    src: "/photos/dogs-at-home.jpg",
    alt: "Fargo greeting another dog inside the family home",
    caption: "Getting to know one another at home",
    layout: "portrait",
    position: "object-center",
  },
  {
    src: "/photos/fargo-garden.jpg",
    alt: "Fargo relaxing outside in the garden",
    caption: "Garden time with Fargo",
    layout: "portrait",
    position: "object-center",
  },
  {
    src: "/photos/dog-walk.jpg",
    alt: "Fargo enjoying a walk alongside another dog",
    caption: "Walks with friendly companions",
    layout: "landscape",
    position: "object-center",
  },
  {
    src: "/photos/fargo-nature.jpg",
    alt: "Fargo sitting among green plants outdoors",
    caption: "Out and about in Launceston",
    layout: "portrait",
    position: "object-center",
  },
  {
    src: "/photos/dogs-group-walk.jpg",
    alt: "A group of dogs gathered together during an outdoor walk",
    caption: "A sociable day outdoors",
    layout: "landscape",
    position: "object-center",
  },
  {
    src: "/photos/fargo-sitting-garden.jpg",
    alt: "Fargo sitting attentively in front of a garden hedge",
    caption: "At home in the garden",
    layout: "landscape",
    position: "object-center",
  },
  {
    src: "/photos/fargo-sleeping-floor.jpg",
    alt: "Fargo sleeping peacefully on the floor inside the home",
    caption: "Time for a well-earned rest",
    layout: "portrait",
    position: "object-center",
  },
  {
    src: "/photos/dogs-playing-field.jpg",
    alt: "A group of dogs enjoying time together on a grassy field",
    caption: "Plenty of room for friendly fun",
    layout: "wide",
    position: "object-center",
  },
  {
    src: "/photos/fargo-portrait-home.jpg",
    alt: "A close portrait of Fargo inside the family home",
    caption: "Fargo at home",
    layout: "portrait",
    position: "object-center",
  },
  {
    src: "/photos/fargo-home-safety-gate.jpg",
    alt: "Fargo standing inside the home beside a safety gate and water bowl",
    caption: "A practical, dog-friendly home",
    layout: "portrait",
    position: "object-center",
  },
] as const;

const layoutClasses = {
  wide: "sm:col-span-2",
  landscape: "",
  portrait: "",
} as const;

const aspectClasses = {
  wide: "aspect-[16/9]",
  landscape: "aspect-[4/3]",
  portrait: "aspect-[4/5]",
} as const;

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <header className="bg-[#f6f2e9] px-5 py-14 sm:px-10 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
              Everyday life with us
            </p>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Dogs at home, in the garden and out on walks
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
              A glimpse of the genuine home environment, friendly company and local
              adventures visiting dogs can enjoy with Kerry and Fargo.
            </p>
          </div>
        </header>

        <section className="px-5 py-16 sm:px-10 lg:py-24" aria-label="Photo gallery">
          <div className="mx-auto grid max-w-7xl auto-flow-dense gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {galleryPhotos.map((photo, index) => (
              <figure key={photo.src} className={layoutClasses[photo.layout]}>
                <div
                  className={`relative overflow-hidden bg-slate-100 ${aspectClasses[photo.layout]}`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    priority={index === 0}
                    sizes={
                      photo.layout === "wide"
                        ? "(max-width: 639px) 100vw, (max-width: 1023px) 100vw, 66vw"
                        : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    }
                    className={`object-cover ${photo.position}`}
                  />
                </div>
                <figcaption className="mt-3 text-sm leading-6 text-slate-600">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 px-5 py-14 sm:px-10">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Could this be your dog&apos;s second home?
              </h2>
              <p className="mt-2 leading-7 text-slate-700">
                Tell Kerry about your dog and the dates you have in mind.
              </p>
            </div>
            <Link
              href="/booking-enquiry"
              className="inline-flex shrink-0 justify-center bg-blue-800 px-6 py-3 font-bold text-white hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            >
              Make a booking enquiry
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
