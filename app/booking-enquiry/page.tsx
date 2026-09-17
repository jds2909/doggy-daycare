import type { Metadata } from "next";
import { BookingEnquiryForm } from "@/components/booking-enquiry-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Booking Enquiry | Doggy Day Care & Home Boarding",
  description:
    "Send a doggy day care or home boarding enquiry in Launceston, Cornwall.",
};

export default function BookingEnquiryPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <header className="bg-[#f6f2e9] px-5 py-14 sm:px-10 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-800">
              Booking enquiry
            </p>
            <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Tell us about your dog and the stay you have in mind.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
              Complete the form below with as much detail as you can. This helps us
              understand your dog’s needs before discussing availability and a trial
              familiarisation.
            </p>
            <p className="mt-5 border-l-4 border-blue-800 pl-4 font-bold text-slate-900">
              This is a booking enquiry only. Your booking is not confirmed until we
              contact you and agree the arrangements.
            </p>
          </div>
        </header>

        <div className="px-5 py-16 sm:px-10 lg:py-24">
          <BookingEnquiryForm />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
