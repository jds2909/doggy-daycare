import Link from "next/link";

export default function EnquiryNotFound() {
  return <><h1 className="text-2xl font-bold">Enquiry not found</h1><Link href="/admin/enquiries" className="mt-4 inline-block text-blue-900 underline">Back to enquiries</Link></>;
}
