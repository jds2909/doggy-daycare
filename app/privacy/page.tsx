import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Privacy Notice | Doggy Day Care & Home Boarding",
  description: "How booking enquiry information is collected, used and retained.",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="px-5 py-14 sm:px-10 sm:py-20">
        <article className="mx-auto max-w-3xl text-slate-700">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
            Your information
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Privacy notice
          </h1>
          <p className="mt-4 text-sm text-slate-500">Last updated: 17 October 2026</p>

          <section className="mt-10" aria-labelledby="who-we-are">
            <h2 id="who-we-are" className="text-2xl font-bold text-slate-900">
              Who we are
            </h2>
            <p className="mt-4 leading-7">
              Doggy Day Care &amp; Home from Home Boarding is a small, home-based dog
              care business in Launceston, Cornwall. Questions about your information
              can be sent to{" "}
              <a
                href="mailto:kerrysnudge@gmail.com"
                className="font-bold text-blue-800 underline underline-offset-4"
              >
                kerrysnudge@gmail.com
              </a>
              .
            </p>
          </section>

          <section className="mt-10" aria-labelledby="information-collected">
            <h2 id="information-collected" className="text-2xl font-bold text-slate-900">
              Information we collect
            </h2>
            <p className="mt-4 leading-7">A booking enquiry may include:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6 leading-7">
              <li>Your name, email address, telephone number and home address.</li>
              <li>The service, requested dates and times, and any booking notes.</li>
              <li>
                Details about each dog, including identity, microchip and insurance
                information, veterinary practice and treatment dates.
              </li>
              <li>
                Health, medication, allergy, routine, behaviour and care information.
              </li>
              <li>Care permissions, acknowledgements and submission timestamps.</li>
            </ul>
            <p className="mt-4 leading-7">
              Our hosting providers may also process ordinary technical request data,
              such as an IP address and server logs. The booking tables do not store
              your IP address.
            </p>
          </section>

          <section className="mt-10" aria-labelledby="how-used">
            <h2 id="how-used" className="text-2xl font-bold text-slate-900">
              How we use it
            </h2>
            <p className="mt-4 leading-7">
              We use the information to understand your dog&apos;s needs, assess whether
              the requested care may be suitable, discuss availability and a trial
              familiarisation, respond to you, and safely plan care if you decide to
              proceed. Submitting the form is an enquiry and does not confirm a booking.
              We do not use booking enquiry information for unrelated marketing.
            </p>
          </section>

          <section className="mt-10" aria-labelledby="access-and-services">
            <h2 id="access-and-services" className="text-2xl font-bold text-slate-900">
              Who can access it
            </h2>
            <p className="mt-4 leading-7">
              The business owner can access complete enquiries through a protected
              admin area. We also use Vercel to host the website and API, Supabase to
              store enquiries and provide admin authentication, Resend to deliver a
              limited notification, and the business&apos;s email provider to receive it.
              These providers process information as needed to supply their services.
            </p>
            <p className="mt-4 leading-7">
              Notification emails contain contact and booking summary information, dog
              names and booking notes. Detailed medical information, microchip numbers
              and insurance details are deliberately excluded. We do not sell booking
              enquiry information.
            </p>
          </section>

          <section className="mt-10" aria-labelledby="retention">
            <h2 id="retention" className="text-2xl font-bold text-slate-900">
              How long we keep it
            </h2>
            <p className="mt-4 leading-7">
              We keep an enquiry while it is active and normally delete it no later
              than 12 months after it is closed or last used to arrange a stay,
              whichever is later. We may need to keep a record longer where it is
              reasonably required for an unresolved issue or a legal or insurance
              requirement. Information should be reviewed and refreshed if a later
              booking makes existing care details out of date.
            </p>
          </section>

          <section className="mt-10" aria-labelledby="your-requests">
            <h2 id="your-requests" className="text-2xl font-bold text-slate-900">
              Access, correction and deletion requests
            </h2>
            <p className="mt-4 leading-7">
              You can email us to ask what information we hold about you, correct it,
              or request deletion. We may ask for enough information to verify that the
              request relates to you before disclosing or changing a record. We will
              respond as promptly as reasonably possible and explain if some information
              must be retained for an unresolved legal, insurance or operational reason.
            </p>
          </section>

          <section className="mt-10 border-t border-slate-300 pt-8" aria-labelledby="security">
            <h2 id="security" className="text-2xl font-bold text-slate-900">
              How information is protected
            </h2>
            <p className="mt-4 leading-7">
              The browser cannot write directly to the booking database. Enquiries are
              validated on the server, and complete records are restricted to the
              authenticated business owner. No online service can guarantee absolute
              security, but access is limited to what is needed to operate the enquiry
              service.
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
