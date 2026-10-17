import type { BookingEnquirySubmission } from "@/lib/booking-enquiry-schema";

type DogFormReference = {
  id: number;
};

type SerializeBookingEnquiryOptions = {
  formData: FormData;
  dogs: readonly DogFormReference[];
  submissionKey: string;
};

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function readNullableText(formData: FormData, name: string): string | null {
  const value = readText(formData, name);
  return value === "" ? null : value;
}

function readYesNo(formData: FormData, name: string): boolean {
  const value = readText(formData, name);

  if (value === "yes") return true;
  if (value === "no") return false;

  throw new Error(`Missing yes/no value for ${name}`);
}

function readRequiredConfirmation(formData: FormData, name: string): true {
  if (formData.get(name) !== null) return true;
  throw new Error(`Missing required confirmation for ${name}`);
}

function readService(formData: FormData): "day-care" | "boarding" {
  const service = readText(formData, "service");

  if (service === "day-care" || service === "boarding") return service;
  throw new Error("Missing booking service");
}

function readSex(formData: FormData, name: string): "female" | "male" {
  const sex = readText(formData, name);

  if (sex === "female" || sex === "male") return sex;
  throw new Error(`Missing dog sex for ${name}`);
}

export function serializeBookingEnquiry({
  formData,
  dogs,
  submissionKey,
}: SerializeBookingEnquiryOptions): BookingEnquirySubmission {
  const service = readService(formData);

  return {
    submissionKey,
    owner: {
      fullName: readText(formData, "fullName"),
      telephone: readText(formData, "telephone"),
      email: readText(formData, "email"),
      homeAddress: readText(formData, "homeAddress"),
      postcode: readText(formData, "postcode"),
    },
    booking: {
      service,
      dayCareDatesText:
        service === "day-care" ? readNullableText(formData, "dayCareDates") : null,
      arrivalDate:
        service === "boarding" ? readNullableText(formData, "arrivalDate") : null,
      departureDate:
        service === "boarding" ? readNullableText(formData, "departureDate") : null,
      preferredArrivalTime: readNullableText(formData, "arrivalTime"),
      preferredCollectionTime: readNullableText(formData, "collectionTime"),
      multipleDogsSameHousehold: readYesNo(formData, "sameHouseholdDogs"),
      notes: readNullableText(formData, "bookingNotes"),
    },
    dogs: dogs.map((dog) => {
      const prefix = `dog-${dog.id}`;
      const microchipped = readYesNo(formData, `${prefix}-microchipped`);
      const insured = readYesNo(formData, `${prefix}-insured`);
      const hasMedicalConditions = readYesNo(
        formData,
        `${prefix}-medical-conditions`,
      );
      const takesPrescribedMedication = readYesNo(formData, `${prefix}-medication`);
      const hasAllergies = readYesNo(formData, `${prefix}-allergies`);
      const hasAggressionFearOrReactivity = readYesNo(
        formData,
        `${prefix}-aggression-fear`,
      );
      const crateRequired = readYesNo(formData, `${prefix}-crate-consent`);

      return {
        name: readText(formData, `${prefix}-name`),
        breed: readText(formData, `${prefix}-breed`),
        ageOrDateOfBirth: readText(formData, `${prefix}-age`),
        sex: readSex(formData, `${prefix}-sex`),
        neutered: readYesNo(formData, `${prefix}-neutered`),
        microchipped,
        microchipNumber: microchipped
          ? readNullableText(formData, `${prefix}-microchip-number`)
          : null,
        insured,
        insuranceCompany: insured
          ? readNullableText(formData, `${prefix}-insurance-company`)
          : null,
        insurancePolicyNumber: insured
          ? readNullableText(formData, `${prefix}-policy-number`)
          : null,
        health: {
          veterinaryPracticeDetails: readText(formData, `${prefix}-vet-details`),
          vaccinationDate: readText(formData, `${prefix}-vaccination-date`),
          wormingDate: readText(formData, `${prefix}-worming-date`),
          fleaTreatmentDate: readText(formData, `${prefix}-flea-date`),
          hasMedicalConditions,
          medicalConditionDetails: hasMedicalConditions
            ? readNullableText(formData, `${prefix}-medical-details`)
            : null,
          takesPrescribedMedication,
          medicationDetails: takesPrescribedMedication
            ? readNullableText(formData, `${prefix}-medication-details`)
            : null,
          hasAllergies,
          allergyDetails: hasAllergies
            ? readNullableText(formData, `${prefix}-allergy-details`)
            : null,
        },
        care: {
          dailyRoutine: readText(formData, `${prefix}-daily-routine`),
          feedingRoutine: readText(formData, `${prefix}-feeding-routine`),
          exerciseRequirements: readNullableText(
            formData,
            `${prefix}-exercise-requirements`,
          ),
          sleepingArrangements: readNullableText(
            formData,
            `${prefix}-sleeping-arrangements`,
          ),
          behaviourWithOtherDogs: readText(formData, `${prefix}-other-dogs`),
          separationAnxietyDetails: readNullableText(
            formData,
            `${prefix}-separation-anxiety`,
          ),
          hasAggressionFearOrReactivity,
          aggressionFearOrReactivityDetails: hasAggressionFearOrReactivity
            ? readNullableText(formData, `${prefix}-aggression-fear-details`)
            : null,
          otherCareInformation: readNullableText(formData, `${prefix}-other-care`),
        },
        permissions: {
          feedingWithOtherDogs: readYesNo(formData, `${prefix}-feeding-consent`),
          onLeadWalking: readYesNo(formData, `${prefix}-on-lead-consent`),
          offLeadWalking: readYesNo(formData, `${prefix}-off-lead-consent`),
          walkingWithOtherHouseholds: readYesNo(
            formData,
            `${prefix}-other-household-walk-consent`,
          ),
          socialisingWithOtherHouseholds: readYesNo(
            formData,
            `${prefix}-socialising-consent`,
          ),
          overnightWithOtherHouseholds: readYesNo(
            formData,
            `${prefix}-overnight-consent`,
          ),
          crateRequired,
          crateProvisionAgreed: crateRequired
            ? formData.get(`${prefix}-crate-agreement`) !== null
            : null,
          medicationAdministration: readYesNo(
            formData,
            `${prefix}-medication-consent`,
          ),
          emergencyTreatmentAcknowledged: readYesNo(
            formData,
            `${prefix}-emergency-treatment-consent`,
          ),
        },
      };
    }),
    confirmations: {
      accuracyConfirmed: readRequiredConfirmation(formData, "accuracyConfirmation"),
      enquiryAcknowledged: readRequiredConfirmation(
        formData,
        "enquiryAcknowledgement",
      ),
    },
  };
}
