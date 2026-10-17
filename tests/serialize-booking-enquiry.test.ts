import { describe, expect, it } from "vitest";

import { bookingEnquirySchema } from "@/lib/booking-enquiry-schema";
import { serializeBookingEnquiry } from "@/lib/serialize-booking-enquiry";

const submissionKey = "10000000-0000-4000-8000-000000000001";

function setDog(formData: FormData, id: number, name: string, conditional = "yes") {
  const values: Record<string, string> = {
    name,
    breed: "Imaginary Spaniel cross",
    age: "4 fictional years",
    sex: "female",
    neutered: "yes",
    microchipped: conditional,
    "microchip-number": "STALE-OR-FICTIONAL-CHIP",
    insured: conditional,
    "insurance-company": "STALE-OR-EXAMPLE-INSURER",
    "policy-number": "STALE-OR-FICTIONAL-POLICY",
    "vet-details": "Example Veterinary Practice, Sample Road",
    "vaccination-date": "2026-08-01",
    "worming-date": "2026-09-01",
    "flea-date": "2026-09-01",
    "medical-conditions": conditional,
    "medical-details": "STALE-OR-FICTIONAL-MEDICAL-DETAILS",
    medication: conditional,
    "medication-details": "STALE-OR-FICTIONAL-MEDICATION",
    allergies: conditional,
    "allergy-details": "STALE-OR-FICTIONAL-ALLERGY",
    "daily-routine": "Breakfast, walk and rest.",
    "feeding-routine": "Two meals each day.",
    "exercise-requirements": "Two walks.",
    "sleeping-arrangements": "Sleeps on a dog bed.",
    "other-dogs": "Friendly after an introduction.",
    "separation-anxiety": "",
    "aggression-fear": conditional,
    "aggression-fear-details": "STALE-OR-FICTIONAL-BEHAVIOUR",
    "other-care": "",
    "feeding-consent": "yes",
    "on-lead-consent": "yes",
    "off-lead-consent": "no",
    "other-household-walk-consent": "yes",
    "socialising-consent": "yes",
    "overnight-consent": "no",
    "crate-consent": conditional,
    "medication-consent": "yes",
    "emergency-treatment-consent": "yes",
  };

  for (const [field, value] of Object.entries(values)) {
    formData.set(`dog-${id}-${field}`, value);
  }
  formData.set(`dog-${id}-crate-agreement`, "on");
}

function makeFormData(service: "day-care" | "boarding" = "day-care") {
  const formData = new FormData();
  const values: Record<string, string> = {
    fullName: "  Taylor Example  ",
    telephone: " 07111 222333 ",
    email: " taylor.example@example.com ",
    homeAddress: " 14 Fictional Lane ",
    postcode: " pl15 3ab ",
    service,
    dayCareDates: " Mondays in November ",
    arrivalDate: "2027-02-12",
    departureDate: "2027-02-15",
    arrivalTime: "09:00",
    collectionTime: "17:00",
    sameHouseholdDogs: "no",
    bookingNotes: " Fictional notes ",
    accuracyConfirmation: "on",
    enquiryAcknowledgement: "on",
  };
  for (const [field, value] of Object.entries(values)) formData.set(field, value);
  return formData;
}

describe("serializeBookingEnquiry", () => {
  it("creates the complete nested API payload", () => {
    const formData = makeFormData();
    setDog(formData, 7, "Fictional Fido");

    const payload = serializeBookingEnquiry({
      formData,
      dogs: [{ id: 7 }],
      submissionKey,
    });

    expect(bookingEnquirySchema.safeParse(payload).success).toBe(true);
    expect(payload).toMatchObject({
      submissionKey,
      owner: { fullName: "Taylor Example", telephone: "07111 222333" },
      booking: { service: "day-care", dayCareDatesText: "Mondays in November" },
      dogs: [{
        name: "Fictional Fido",
        health: { hasMedicalConditions: true },
        care: { hasAggressionFearOrReactivity: true },
        permissions: { crateRequired: true, crateProvisionAgreed: true },
      }],
      confirmations: { accuracyConfirmed: true, enquiryAcknowledged: true },
    });
  });

  it("nulls boarding dates for day-care enquiries", () => {
    const formData = makeFormData("day-care");
    setDog(formData, 1, "Day-care Dog");
    const payload = serializeBookingEnquiry({ formData, dogs: [{ id: 1 }], submissionKey });

    expect(payload.booking).toMatchObject({
      dayCareDatesText: "Mondays in November",
      arrivalDate: null,
      departureDate: null,
    });
  });

  it("nulls day-care text for boarding enquiries", () => {
    const formData = makeFormData("boarding");
    setDog(formData, 1, "Boarding Dog");
    const payload = serializeBookingEnquiry({ formData, dogs: [{ id: 1 }], submissionKey });

    expect(payload.booking).toMatchObject({
      dayCareDatesText: null,
      arrivalDate: "2027-02-12",
      departureDate: "2027-02-15",
    });
  });

  it("nulls stale details for inactive conditional fields", () => {
    const formData = makeFormData();
    setDog(formData, 1, "Conditional Dog", "no");
    const payload = serializeBookingEnquiry({ formData, dogs: [{ id: 1 }], submissionKey });
    const dog = payload.dogs[0];

    expect(dog).toMatchObject({
      microchipNumber: null,
      insuranceCompany: null,
      insurancePolicyNumber: null,
      health: {
        medicalConditionDetails: null,
        medicationDetails: null,
        allergyDetails: null,
      },
      care: { aggressionFearOrReactivityDetails: null },
      permissions: { crateProvisionAgreed: null },
    });
  });

  it("preserves dog order without leaking temporary UI IDs", () => {
    const formData = makeFormData();
    formData.set("sameHouseholdDogs", "yes");
    setDog(formData, 42, "First Dog");
    setDog(formData, 3, "Second Dog");

    const payload = serializeBookingEnquiry({
      formData,
      dogs: [{ id: 42 }, { id: 3 }],
      submissionKey,
    });

    expect(payload.dogs.map((dog) => dog.name)).toEqual(["First Dog", "Second Dog"]);
    expect(payload.dogs.every((dog) => !("id" in dog))).toBe(true);
  });
});
