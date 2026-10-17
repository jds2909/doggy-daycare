import Link from "next/link";
import { notFound } from "next/navigation";
import { getEnquiry } from "@/lib/admin/enquiries";
import { StatusForm } from "../status-form";

type Field = readonly [key: string, label: string];

const ownerFields: Field[] = [
  ["full_name", "Full name"], ["email", "Email"], ["telephone", "Telephone"],
  ["home_address", "Home address"], ["postcode", "Postcode"],
];
const bookingFields: Field[] = [
  ["service", "Service"], ["day_care_dates_text", "Requested day-care dates"],
  ["arrival_date", "Arrival date"], ["departure_date", "Departure date"],
  ["preferred_arrival_time", "Preferred arrival time"], ["preferred_collection_time", "Preferred collection time"],
  ["multiple_dogs_same_household", "Multiple household dogs attending at the same time"],
  ["booking_notes", "Booking notes"],
];
const recordFields: Field[] = [
  ["id", "Enquiry ID"], ["status", "Status"], ["created_at", "Received at"], ["updated_at", "Updated at"],
  ["accuracy_confirmed_at", "Accuracy confirmed at"], ["enquiry_acknowledged_at", "Enquiry acknowledged at"],
  ["form_version", "Form version"], ["submission_key", "Submission key"],
];
const identityFields: Field[] = [
  ["id", "Dog record ID"], ["position", "Dog number"], ["name", "Name"], ["breed", "Breed"],
  ["age_or_date_of_birth", "Age or date of birth"], ["sex", "Sex"], ["neutered", "Neutered"],
  ["microchipped", "Microchipped"], ["microchip_number", "Microchip number"],
  ["insured", "Insured"], ["insurance_company", "Insurance company"], ["insurance_policy_number", "Insurance policy number"],
  ["created_at", "Recorded at"],
];
const healthFields: Field[] = [
  ["veterinary_practice_details", "Veterinary practice details"], ["vaccination_date", "Vaccination date"],
  ["worming_date", "Worming date"], ["flea_treatment_date", "Flea treatment date"],
  ["has_medical_conditions", "Has medical conditions"], ["medical_condition_details", "Medical condition details"],
  ["takes_prescribed_medication", "Takes prescribed medication"], ["medication_details", "Medication details"],
  ["has_allergies", "Has allergies"], ["allergy_details", "Allergy details"],
];
const careFields: Field[] = [
  ["daily_routine", "Daily routine"], ["feeding_routine", "Feeding routine"],
  ["exercise_requirements", "Exercise requirements"], ["sleeping_arrangements", "Sleeping arrangements"],
  ["behaviour_with_other_dogs", "Behaviour with other dogs"], ["separation_anxiety_details", "Separation anxiety details"],
  ["has_aggression_fear_or_reactivity", "Has aggression, fear or reactivity"],
  ["aggression_fear_or_reactivity_details", "Aggression, fear or reactivity details"], ["other_care_information", "Other care information"],
];
const permissionFields: Field[] = [
  ["feeding_with_other_dogs", "Feeding with dogs from other households"], ["on_lead_walking", "On-lead walking"],
  ["off_lead_walking", "Off-lead walking"], ["walking_with_other_households", "Walking with other households"],
  ["socialising_with_other_households", "Socialising with other households"],
  ["overnight_with_other_households", "Boarding overnight with other households"],
  ["crate_required", "Crate required"], ["crate_provision_agreed", "Owner agreed to provide a crate"],
  ["medication_administration", "Medication administration consent"],
  ["emergency_treatment_acknowledged", "Emergency treatment acknowledged"], ["recorded_at", "Permissions recorded at"],
];

function formatValue(value: unknown, key: string): string {
  if (value === null || value === undefined || value === "") return "Not supplied / not applicable";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value !== "string" && typeof value !== "number") return "Unavailable";
  if (key.endsWith("_at") && typeof value === "string") {
    return new Date(value).toLocaleString("en-GB", { timeZone: "Europe/London" });
  }
  return String(value);
}

function Fields({ title, record, fields }: { title: string; record: object; fields: Field[] }) {
  return (
    <section className="my-6">
      <h3 className="mb-3 text-xl font-semibold">{title}</h3>
      <dl className="divide-y divide-slate-200 border-y border-slate-200">
        {fields.map(([key, label]) => (
          <div key={key} className="grid gap-1 py-3 sm:grid-cols-[minmax(12rem,1fr)_2fr] sm:gap-5">
            <dt className="font-semibold">{label}</dt>
            <dd className="min-w-0 whitespace-pre-wrap break-words">{formatValue(Reflect.get(record, key), key)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const enquiry = await getEnquiry(id);
  if (!enquiry) notFound();

  return (
    <>
      <Link href="/admin/enquiries" className="text-blue-900 underline">Back to enquiries</Link>
      <h1 className="mt-5 text-3xl font-bold">Enquiry from {enquiry.full_name}</h1>
      <StatusForm enquiryId={enquiry.id} status={enquiry.status} />
      <Fields title="Owner" record={enquiry} fields={ownerFields} />
      <Fields title="Booking request" record={enquiry} fields={bookingFields} />
      <Fields title="Enquiry record" record={enquiry} fields={recordFields} />
      {enquiry.enquiry_dogs.map((dog) => {
        const permissions = Array.isArray(dog.dog_permissions) ? dog.dog_permissions : dog.dog_permissions ? [dog.dog_permissions] : [];
        return (
          <section key={dog.id} className="mt-10 border-t-2 border-blue-900 pt-6">
            <h2 className="text-2xl font-bold">Dog {dog.position}: {dog.name}</h2>
            <Fields title="Identity and insurance" record={dog} fields={identityFields} />
            <Fields title="Health" record={dog} fields={healthFields} />
            <Fields title="Care" record={dog} fields={careFields} />
            {permissions.length ? permissions.map((permission, index) => <Fields key={index} title="Permissions and acknowledgements" record={permission} fields={permissionFields} />) : <p>No permission record is available for this dog.</p>}
          </section>
        );
      })}
    </>
  );
}
