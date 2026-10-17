import { describe, expect, it } from "vitest";

import {
  bookingEnquirySchema,
  type BookingEnquirySubmission,
} from "@/lib/booking-enquiry-schema";
import {
  makeBoardingSubmission,
  makeDayCareSubmission,
} from "@/tests/fixtures/booking-enquiry";

function invalidPayload(change: (payload: BookingEnquirySubmission) => void) {
  const payload = structuredClone(makeDayCareSubmission());
  change(payload);
  return bookingEnquirySchema.safeParse(payload);
}

describe("bookingEnquirySchema", () => {
  it("accepts a complete day-care enquiry", () => {
    expect(bookingEnquirySchema.safeParse(makeDayCareSubmission()).success).toBe(true);
  });

  it("accepts a complete multi-dog boarding enquiry", () => {
    expect(bookingEnquirySchema.safeParse(makeBoardingSubmission()).success).toBe(true);
  });

  it("trims and normalises obvious text fields", () => {
    const payload = makeDayCareSubmission();
    payload.owner.fullName = "  Taylor Example  ";
    payload.owner.email = "  TAYLOR.EXAMPLE@EXAMPLE.COM  ";
    payload.owner.postcode = "  pl15 3ab  ";
    payload.booking.notes = "  Fictional note  ";
    payload.dogs[0].name = "  Fictional Fido  ";

    const parsed = bookingEnquirySchema.parse(payload);

    expect(parsed.owner).toMatchObject({
      fullName: "Taylor Example",
      email: "taylor.example@example.com",
      postcode: "PL15 3AB",
    });
    expect(parsed.booking.notes).toBe("Fictional note");
    expect(parsed.dogs[0].name).toBe("Fictional Fido");
  });

  it.each([
    ["microchip number required", (payload: BookingEnquirySubmission) => {
      payload.dogs[0].microchipNumber = null;
    }],
    ["microchip number rejected when inactive", (payload: BookingEnquirySubmission) => {
      payload.dogs[0].microchipped = false;
    }],
    ["insurance company required", (payload: BookingEnquirySubmission) => {
      payload.dogs[0].insuranceCompany = null;
    }],
    ["insurance details rejected when inactive", (payload: BookingEnquirySubmission) => {
      payload.dogs[0].insured = false;
    }],
    ["medical details required", (payload: BookingEnquirySubmission) => {
      payload.dogs[0].health.medicalConditionDetails = null;
    }],
    ["medical details rejected when inactive", (payload: BookingEnquirySubmission) => {
      payload.dogs[0].health.hasMedicalConditions = false;
    }],
    ["medication details required", (payload: BookingEnquirySubmission) => {
      payload.dogs[0].health.medicationDetails = null;
    }],
    ["allergy details required", (payload: BookingEnquirySubmission) => {
      payload.dogs[0].health.allergyDetails = null;
    }],
    ["behaviour details required", (payload: BookingEnquirySubmission) => {
      payload.dogs[0].care.aggressionFearOrReactivityDetails = null;
    }],
    ["crate agreement required", (payload: BookingEnquirySubmission) => {
      payload.dogs[0].permissions.crateProvisionAgreed = false;
    }],
    ["crate agreement rejected when inactive", (payload: BookingEnquirySubmission) => {
      payload.dogs[0].permissions.crateRequired = false;
    }],
  ])("rejects an invalid conditional combination: %s", (_name, change) => {
    expect(invalidPayload(change).success).toBe(false);
  });

  it.each(["accuracyConfirmed", "enquiryAcknowledged"])(
    "rejects a missing %s confirmation",
    (field) => {
      const payload = structuredClone(makeDayCareSubmission()) as unknown as {
        confirmations: Record<string, unknown>;
      };
      delete payload.confirmations[field];

      const result = bookingEnquirySchema.safeParse(payload);
      expect(result.success).toBe(false);
    },
  );

  it("requires confirmations to be literal true", () => {
    expect(
      invalidPayload((payload) => {
        payload.confirmations.accuracyConfirmed = false as true;
      }).success,
    ).toBe(false);
  });

  it("rejects an empty dog list", () => {
    expect(invalidPayload((payload) => { payload.dogs = []; }).success).toBe(false);
  });

  it("rejects more than five dogs", () => {
    expect(
      invalidPayload((payload) => {
        payload.dogs = Array.from({ length: 6 }, () => payload.dogs[0]);
      }).success,
    ).toBe(false);
  });

  it.each([
    ["owner", null],
    ["dog health", "malformed"],
    ["dog permissions", []],
  ])("rejects a malformed nested %s object", (part, malformed) => {
    const payload = structuredClone(makeDayCareSubmission()) as unknown as {
      owner: unknown;
      dogs: Array<{ health: unknown; permissions: unknown }>;
    };
    if (part === "owner") payload.owner = malformed;
    if (part === "dog health") payload.dogs[0].health = malformed;
    if (part === "dog permissions") payload.dogs[0].permissions = malformed;

    const result = bookingEnquirySchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("enforces service-specific dates and boarding date order", () => {
    const dayCare = invalidPayload((payload) => {
      payload.booking.arrivalDate = "2027-01-01";
    });
    const boarding = makeBoardingSubmission();
    boarding.booking.departureDate = boarding.booking.arrivalDate;

    expect(dayCare.success).toBe(false);
    expect(bookingEnquirySchema.safeParse(boarding).success).toBe(false);
  });
});
