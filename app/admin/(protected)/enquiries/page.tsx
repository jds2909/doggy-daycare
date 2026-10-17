import Link from "next/link";
import { listEnquiries } from "@/lib/admin/enquiries";

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const requestedPage = (await searchParams).page ?? "1";
  const page = /^\d+$/.test(requestedPage) && Number(requestedPage) >= 1 && Number(requestedPage) <= 100_000 ? Number(requestedPage) : 1;
  const { enquiries, hasNext } = await listEnquiries(page);
  return (
    <>
      <h1 className="text-3xl font-bold">Booking enquiries</h1>
      <p className="mt-3 text-slate-600">Newest enquiries first. Open an enquiry to review its details and change its status.</p>
      {enquiries.length === 0 ? <p className="my-8">No enquiries on this page.</p> : (
        <div className="my-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Booking enquiries, page {page}</caption>
            <thead><tr>{["Received", "Owner", "Service", "Requested dates", "Dogs", "Status"].map((label) => <th key={label} scope="col" className="border-b p-3">{label}</th>)}</tr></thead>
            <tbody>{enquiries.map((enquiry) => (
              <tr key={enquiry.id}>
                <td className="border-b p-3">{new Date(enquiry.created_at).toLocaleString("en-GB", { timeZone: "Europe/London" })}</td>
                <td className="border-b p-3"><Link prefetch={false} href={`/admin/enquiries/${enquiry.id}`} className="font-semibold text-blue-900 underline">{enquiry.full_name}</Link></td>
                <td className="border-b p-3">{enquiry.service === "boarding" ? "Boarding" : "Day care"}</td>
                <td className="whitespace-pre-wrap border-b p-3">{enquiry.service === "boarding" ? `${enquiry.arrival_date} to ${enquiry.departure_date}` : enquiry.day_care_dates_text}</td>
                <td className="border-b p-3">{enquiry.enquiry_dogs.length}</td>
                <td className="border-b p-3">{enquiry.status.replaceAll("_", " ")}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <nav aria-label="Enquiry pages" className="flex gap-6">
        {page > 1 && <Link prefetch={false} href={`/admin/enquiries?page=${page - 1}`} className="text-blue-900 underline">Previous</Link>}
        <span>Page {page}</span>
        {hasNext && <Link prefetch={false} href={`/admin/enquiries?page=${page + 1}`} className="text-blue-900 underline">Next</Link>}
      </nav>
    </>
  );
}
