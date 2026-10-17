import { z } from "zod";

const requiredText = (label: string, maximum: number, minimum = 1) =>
  z
    .string()
    .trim()
    .min(minimum, `${label} is required`)
    .max(maximum, `${label} must be ${maximum} characters or fewer`);

const nullableText = (label: string, maximum: number) =>
  requiredText(label, maximum).nullable();

const optionalTimeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use a valid time in HH:MM format")
  .nullable();

const bookingSchema = z
  .object({
    service: z.enum(["day-care", "boarding"]),
    dayCareDatesText: nullableText("Day-care dates", 500),
    arrivalDate: z.iso.date().nullable(),
    departureDate: z.iso.date().nullable(),
    preferredArrivalTime: optionalTimeSchema,
    preferredCollectionTime: optionalTimeSchema,
    multipleDogsSameHousehold: z.boolean(),
    notes: nullableText("Booking notes", 2000),
  })
  .strict()
  .superRefine((booking, context) => {
    if (booking.service === "day-care") {
      if (booking.dayCareDatesText === null) {
        context.addIssue({
          code: "custom",
          path: ["dayCareDatesText"],
          message: "Day-care dates are required for a day-care enquiry",
        });
      }

      if (booking.arrivalDate !== null || booking.departureDate !== null) {
        context.addIssue({
          code: "custom",
          path: ["arrivalDate"],
          message: "Arrival and departure dates are only used for boarding enquiries",
        });
      }
    }

    if (booking.service === "boarding") {
      if (booking.dayCareDatesText !== null) {
        context.addIssue({
          code: "custom",
          path: ["dayCareDatesText"],
          message: "Day-care date text must be null for a boarding enquiry",
        });
      }

      if (booking.arrivalDate === null) {
        context.addIssue({
          code: "custom",
          path: ["arrivalDate"],
          message: "An arrival date is required for boarding",
        });
      }

      if (booking.departureDate === null) {
        context.addIssue({
          code: "custom",
          path: ["departureDate"],
          message: "A departure date is required for boarding",
        });
      }

      if (
        booking.arrivalDate !== null &&
        booking.departureDate !== null &&
        booking.departureDate <= booking.arrivalDate
      ) {
        context.addIssue({
          code: "custom",
          path: ["departureDate"],
          message: "The departure date must be after the arrival date",
        });
      }
    }
  });

const healthSchema = z
  .object({
    veterinaryPracticeDetails: requiredText("Veterinary practice details", 1000),
    vaccinationDate: z.iso.date(),
    wormingDate: z.iso.date(),
    fleaTreatmentDate: z.iso.date(),
    hasMedicalConditions: z.boolean(),
    medicalConditionDetails: nullableText("Medical condition details", 2000),
    takesPrescribedMedication: z.boolean(),
    medicationDetails: nullableText("Medication details", 2000),
    hasAllergies: z.boolean(),
    allergyDetails: nullableText("Allergy details", 2000),
  })
  .strict()
  .superRefine((health, context) => {
    requireConditionalDetails(
      health.hasMedicalConditions,
      health.medicalConditionDetails,
      "medicalConditionDetails",
      "Medical condition details are required when medical conditions are selected",
      context,
    );
    requireConditionalDetails(
      health.takesPrescribedMedication,
      health.medicationDetails,
      "medicationDetails",
      "Medication details are required when prescribed medication is selected",
      context,
    );
    requireConditionalDetails(
      health.hasAllergies,
      health.allergyDetails,
      "allergyDetails",
      "Allergy details are required when allergies are selected",
      context,
    );
  });

const careSchema = z
  .object({
    dailyRoutine: requiredText("Daily routine", 3000),
    feedingRoutine: requiredText("Feeding routine", 2000),
    exerciseRequirements: nullableText("Exercise requirements", 2000),
    sleepingArrangements: nullableText("Sleeping arrangements", 2000),
    behaviourWithOtherDogs: requiredText("Behaviour with other dogs", 2000),
    separationAnxietyDetails: nullableText("Separation anxiety details", 2000),
    hasAggressionFearOrReactivity: z.boolean(),
    aggressionFearOrReactivityDetails: nullableText(
      "Aggression, fear or reactivity details",
      3000,
    ),
    otherCareInformation: nullableText("Other care information", 3000),
  })
  .strict()
  .superRefine((care, context) => {
    requireConditionalDetails(
      care.hasAggressionFearOrReactivity,
      care.aggressionFearOrReactivityDetails,
      "aggressionFearOrReactivityDetails",
      "Behaviour details are required when aggression, fear or reactivity is selected",
      context,
    );
  });

const permissionsSchema = z
  .object({
    feedingWithOtherDogs: z.boolean(),
    onLeadWalking: z.boolean(),
    offLeadWalking: z.boolean(),
    walkingWithOtherHouseholds: z.boolean(),
    socialisingWithOtherHouseholds: z.boolean(),
    overnightWithOtherHouseholds: z.boolean(),
    crateRequired: z.boolean(),
    crateProvisionAgreed: z.boolean().nullable(),
    medicationAdministration: z.boolean(),
    emergencyTreatmentAcknowledged: z.boolean(),
  })
  .strict()
  .superRefine((permissions, context) => {
    if (permissions.crateRequired && permissions.crateProvisionAgreed !== true) {
      context.addIssue({
        code: "custom",
        path: ["crateProvisionAgreed"],
        message: "You must agree to provide a crate when crate use is required",
      });
    }

    if (!permissions.crateRequired && permissions.crateProvisionAgreed !== null) {
      context.addIssue({
        code: "custom",
        path: ["crateProvisionAgreed"],
        message: "Crate provision agreement must be null when a crate is not required",
      });
    }
  });

const dogSchema = z
  .object({
    name: requiredText("Dog name", 100),
    breed: requiredText("Breed", 120),
    ageOrDateOfBirth: requiredText("Age or date of birth", 100),
    sex: z.enum(["female", "male"]),
    neutered: z.boolean(),
    microchipped: z.boolean(),
    microchipNumber: nullableText("Microchip number", 100),
    insured: z.boolean(),
    insuranceCompany: nullableText("Insurance company", 200),
    insurancePolicyNumber: nullableText("Insurance policy number", 200),
    health: healthSchema,
    care: careSchema,
    permissions: permissionsSchema,
  })
  .strict()
  .superRefine((dog, context) => {
    requireConditionalDetails(
      dog.microchipped,
      dog.microchipNumber,
      "microchipNumber",
      "A microchip number is required when the dog is microchipped",
      context,
    );

    if (dog.insured) {
      if (dog.insuranceCompany === null) {
        context.addIssue({
          code: "custom",
          path: ["insuranceCompany"],
          message: "The insurance company is required when the dog is insured",
        });
      }
      if (dog.insurancePolicyNumber === null) {
        context.addIssue({
          code: "custom",
          path: ["insurancePolicyNumber"],
          message: "The policy number is required when the dog is insured",
        });
      }
    } else if (dog.insuranceCompany !== null || dog.insurancePolicyNumber !== null) {
      context.addIssue({
        code: "custom",
        path: ["insuranceCompany"],
        message: "Insurance details must be null when the dog is not insured",
      });
    }
  });

function requireConditionalDetails(
  selected: boolean,
  details: string | null,
  path: string,
  requiredMessage: string,
  context: z.RefinementCtx,
) {
  if (selected && details === null) {
    context.addIssue({ code: "custom", path: [path], message: requiredMessage });
  }

  if (!selected && details !== null) {
    context.addIssue({
      code: "custom",
      path: [path],
      message: "Details must be null when no details are required",
    });
  }
}

export const bookingEnquirySchema = z
  .object({
    submissionKey: z.uuid("A valid submission key is required"),
    owner: z
      .object({
        fullName: requiredText("Full name", 120, 2),
        email: z
          .string()
          .trim()
          .toLowerCase()
          .email("Enter a valid email address")
          .max(254, "Email address must be 254 characters or fewer"),
        telephone: z
          .string()
          .trim()
          .min(7, "Telephone number must be at least 7 characters")
          .max(30, "Telephone number must be 30 characters or fewer")
          .regex(/^[0-9+().\s-]+$/, "Enter a valid telephone number")
          .refine(
            (telephone) => telephone.replace(/\D/g, "").length >= 7,
            "Telephone number must contain at least 7 digits",
          ),
        homeAddress: requiredText("Home address", 1000, 5),
        postcode: z
          .string()
          .trim()
          .toUpperCase()
          .min(3, "Postcode must be at least 3 characters")
          .max(12, "Postcode must be 12 characters or fewer")
          .regex(/^[A-Z0-9 -]+$/, "Enter a valid postcode"),
      })
      .strict(),
    booking: bookingSchema,
    dogs: z.array(dogSchema).min(1, "Include at least one dog").max(5, "Include no more than five dogs"),
    confirmations: z
      .object({
        accuracyConfirmed: z.literal(true),
        enquiryAcknowledged: z.literal(true),
      })
      .strict(),
  })
  .strict();

export type BookingEnquirySubmission = z.infer<typeof bookingEnquirySchema>;
