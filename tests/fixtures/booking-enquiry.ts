import type { BookingEnquirySubmission } from "@/lib/booking-enquiry-schema";

export const enquiryId = "90000000-0000-4000-8000-000000000009";

export function makeDog(name = "Fictional Fido"): BookingEnquirySubmission["dogs"][number] {
  return {
    name,
    breed: "Imaginary Spaniel cross",
    ageOrDateOfBirth: "Approximately 4 years",
    sex: "female",
    neutered: true,
    microchipped: true,
    microchipNumber: "FICTIONAL-CHIP-001",
    insured: true,
    insuranceCompany: "Example Pet Cover",
    insurancePolicyNumber: "FICTIONAL-POLICY-001",
    health: {
      veterinaryPracticeDetails: "Example Veterinary Practice, Sample Road",
      vaccinationDate: "2026-08-01",
      wormingDate: "2026-09-01",
      fleaTreatmentDate: "2026-09-01",
      hasMedicalConditions: true,
      medicalConditionDetails: "Fictional medical condition",
      takesPrescribedMedication: true,
      medicationDetails: "One fictional tablet with food",
      hasAllergies: true,
      allergyDetails: "Fictional pollen allergy",
    },
    care: {
      dailyRoutine: "Breakfast, walk, rest and an evening walk.",
      feedingRoutine: "Two measured meals each day.",
      exerciseRequirements: "Two moderate walks.",
      sleepingArrangements: "Sleeps downstairs on a dog bed.",
      behaviourWithOtherDogs: "Friendly after a calm introduction.",
      separationAnxietyDetails: null,
      hasAggressionFearOrReactivity: true,
      aggressionFearOrReactivityDetails: "Nervous around noisy traffic.",
      otherCareInformation: "Enjoys puzzle feeders.",
    },
    permissions: {
      feedingWithOtherDogs: true,
      onLeadWalking: true,
      offLeadWalking: false,
      walkingWithOtherHouseholds: true,
      socialisingWithOtherHouseholds: true,
      overnightWithOtherHouseholds: false,
      crateRequired: true,
      crateProvisionAgreed: true,
      medicationAdministration: true,
      emergencyTreatmentAcknowledged: true,
    },
  };
}

export function makeDayCareSubmission(): BookingEnquirySubmission {
  return {
    submissionKey: "10000000-0000-4000-8000-000000000001",
    owner: {
      fullName: "Taylor Example",
      email: "taylor.example@example.com",
      telephone: "07111 222333",
      homeAddress: "14 Fictional Lane, Exampleton, Cornwall",
      postcode: "PL15 3AB",
    },
    booking: {
      service: "day-care",
      dayCareDatesText: "Mondays during November 2026",
      arrivalDate: null,
      departureDate: null,
      preferredArrivalTime: "09:00",
      preferredCollectionTime: "17:00",
      multipleDogsSameHousehold: false,
      notes: "Completely fictional booking notes.",
    },
    dogs: [makeDog()],
    confirmations: {
      accuracyConfirmed: true,
      enquiryAcknowledged: true,
    },
  };
}

export function makeBoardingSubmission(): BookingEnquirySubmission {
  const submission = makeDayCareSubmission();
  submission.submissionKey = "20000000-0000-4000-8000-000000000002";
  submission.booking = {
    ...submission.booking,
    service: "boarding",
    dayCareDatesText: null,
    arrivalDate: "2027-02-12",
    departureDate: "2027-02-15",
    multipleDogsSameHousehold: true,
  };
  submission.dogs.push(makeDog("Fictional Pippin"));
  return submission;
}
