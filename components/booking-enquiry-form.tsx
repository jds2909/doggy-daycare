"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { serializeBookingEnquiry } from "@/lib/serialize-booking-enquiry";

type YesNo = "" | "yes" | "no";

type DogEntry = {
  id: number;
  name: string;
  microchipped: YesNo;
  medicalConditions: YesNo;
  medication: YesNo;
  allergies: YesNo;
  aggressionOrFear: YesNo;
  insured: YesNo;
  crateRequired: YesNo;
};

type ConditionalDogField = Exclude<keyof DogEntry, "id" | "name">;

type ReviewDetails = {
  name: string;
  email: string;
  telephone: string;
  service: string;
  dates: string;
  dogs: string[];
};

type SubmissionState = "idle" | "submitting" | "success" | "error";

type SubmissionAttempt = {
  submissionKey: string;
  payloadJson: string;
};

const inputStyles =
  "mt-2 block w-full border border-slate-300 bg-white px-3.5 py-3 text-slate-900 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-200";

const consentQuestions = [
  {
    key: "feeding-consent",
    label: "May this dog be fed at the same time as dogs from other households?",
  },
  {
    key: "on-lead-consent",
    label: "Do you consent to this dog being walked on a lead?",
  },
  {
    key: "off-lead-consent",
    label: "Do you consent to this dog being walked off lead where appropriate?",
  },
  {
    key: "other-household-walk-consent",
    label: "May this dog be walked with dogs from other households?",
  },
  {
    key: "socialising-consent",
    label: "May this dog socialise with dogs from other households?",
  },
  {
    key: "overnight-consent",
    label: "May this dog board overnight with dogs from other households?",
  },
  {
    key: "crate-consent",
    label: "Do you require us to use a crate?",
  },
  {
    key: "medication-consent",
    label: "Do you consent to us administering medication according to your instructions?",
  },
  {
    key: "emergency-treatment-consent",
    label:
      "Do you acknowledge that emergency first aid or veterinary treatment may be arranged when necessary?",
  },
] as const;

function RequiredMark() {
  return (
    <span className="text-red-700" aria-hidden="true">
      {" "}*
    </span>
  );
}

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const headingId = `form-section-${number}`;

  return (
    <section className="border-t border-slate-300 py-12" aria-labelledby={headingId}>
      <div className="grid gap-8 lg:grid-cols-[0.34fr_1fr] lg:gap-12">
        <div>
          <p className="text-sm font-bold text-blue-800">{number}</p>
          <h2 id={headingId} className="mt-2 text-2xl font-bold text-slate-900">
            {title}
          </h2>
          {description && <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function YesNoQuestion({
  name,
  legend,
  required = false,
  value,
  onChange,
  helperText,
}: {
  name: string;
  legend: string;
  required?: boolean;
  value?: YesNo;
  onChange?: (value: Exclude<YesNo, "">) => void;
  helperText?: string;
}) {
  const helperId = helperText ? `${name}-help` : undefined;
  const isControlled = value !== undefined;

  return (
    <fieldset aria-describedby={helperId}>
      <legend className="font-bold text-slate-900">
        {legend}
        {required && <RequiredMark />}
      </legend>
      {helperText && (
        <p id={helperId} className="mt-1 text-sm leading-6 text-slate-600">
          {helperText}
        </p>
      )}
      <div className="mt-3 flex gap-6">
        {(["yes", "no"] as const).map((option) => {
          const inputId = `${name}-${option}`;
          return (
            <label key={option} htmlFor={inputId} className="flex items-center gap-2">
              <input
                id={inputId}
                name={name}
                type="radio"
                value={option}
                required={required}
                checked={isControlled ? value === option : undefined}
                onChange={() => onChange?.(option)}
                className="size-4 accent-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
              />
              <span className="capitalize text-slate-700">{option}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function DogHeading({ dog, index }: { dog: DogEntry; index: number }) {
  return (
    <h3 className="text-xl font-bold text-blue-900">
      Dog {index + 1}
      {dog.name ? ` — ${dog.name}` : ""}
    </h3>
  );
}

export function BookingEnquiryForm() {
  const [dogs, setDogs] = useState<DogEntry[]>([
    {
      id: 1,
      name: "",
      microchipped: "",
      medicalConditions: "",
      medication: "",
      allergies: "",
      aggressionOrFear: "",
      insured: "",
      crateRequired: "",
    },
  ]);
  const [nextDogId, setNextDogId] = useState(2);
  const [service, setService] = useState<"" | "day-care" | "boarding">("");
  const [review, setReview] = useState<ReviewDetails | null>(null);
  const [validationMessage, setValidationMessage] = useState("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const reviewRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const submissionAttemptRef = useRef<SubmissionAttempt | null>(null);

  useEffect(() => {
    if (review) reviewRef.current?.focus();
  }, [review]);

  useEffect(() => {
    if (submissionState === "success") successRef.current?.focus();
  }, [submissionState]);

  function addDog() {
    if (dogs.length >= 5) return;

    setDogs((currentDogs) => [
      ...currentDogs,
      {
        id: nextDogId,
        name: "",
        microchipped: "",
        medicalConditions: "",
        medication: "",
        allergies: "",
        aggressionOrFear: "",
        insured: "",
        crateRequired: "",
      },
    ]);
    setNextDogId((currentId) => currentId + 1);
    setReview(null);
    setSubmissionState("idle");
    setSubmissionMessage("");
  }

  function removeDog(id: number) {
    setDogs((currentDogs) => currentDogs.filter((dog) => dog.id !== id));
    setReview(null);
    setSubmissionState("idle");
    setSubmissionMessage("");
  }

  function updateDogName(id: number, name: string) {
    setDogs((currentDogs) =>
      currentDogs.map((dog) => (dog.id === id ? { ...dog, name } : dog)),
    );
  }

  function updateDogCondition(
    id: number,
    field: ConditionalDogField,
    value: Exclude<YesNo, "">,
  ) {
    setDogs((currentDogs) =>
      currentDogs.map((dog) => (dog.id === id ? { ...dog, [field]: value } : dog)),
    );
  }

  // Development convenience only. NODE_ENV is replaced at build time, so the
  // button and this handler are unreachable in a production build.
  function fillTestData() {
    if (process.env.NODE_ENV !== "development") return;

    const form = formRef.current;
    if (!form) return;

    form.reset();

    flushSync(() => {
      setDogs([
        {
          id: 1,
          name: "Fictional Fido",
          microchipped: "yes",
          medicalConditions: "yes",
          medication: "yes",
          allergies: "yes",
          aggressionOrFear: "yes",
          insured: "yes",
          crateRequired: "yes",
        },
      ]);
      setNextDogId(2);
      setService("day-care");
      setReview(null);
      setValidationMessage("");
      setSubmissionState("idle");
      setSubmissionMessage("");
    });

    submissionAttemptRef.current = null;

    const setValue = (name: string, value: string) => {
      const field = form.elements.namedItem(name);

      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      ) {
        field.value = value;
      } else if (field instanceof RadioNodeList) {
        field.value = value;
      }
    };

    const setChecked = (name: string) => {
      const field = form.elements.namedItem(name);
      if (field instanceof HTMLInputElement) field.checked = true;
    };

    setValue("fullName", "Taylor Example");
    setValue("telephone", "07111 222333");
    setValue("email", "taylor.example@example.com");
    setValue("homeAddress", "14 Fictional Lane, Exampleton, Cornwall");
    setValue("postcode", "PL15 3AB");
    setValue("service", "day-care");
    setValue("dayCareDates", "Mondays during November 2026");
    setValue("arrivalTime", "09:00");
    setValue("collectionTime", "17:00");
    setValue("sameHouseholdDogs", "no");
    setValue("bookingNotes", "Completely fictional local form test.");

    setValue("dog-1-name", "Fictional Fido");
    setValue("dog-1-breed", "Imaginary Spaniel cross");
    setValue("dog-1-age", "Approximately 4 years");
    setValue("dog-1-sex", "female");
    setValue("dog-1-neutered", "yes");
    setValue("dog-1-microchipped", "yes");
    setValue("dog-1-microchip-number", "FICTIONAL-MICROCHIP-001");
    setValue("dog-1-insured", "yes");
    setValue("dog-1-insurance-company", "Example Pet Insurance");
    setValue("dog-1-policy-number", "FICTIONAL-POLICY-001");

    setValue(
      "dog-1-vet-details",
      "Example Veterinary Practice, 1 Sample Road, 01000 111111",
    );
    setValue("dog-1-vaccination-date", "2026-08-01");
    setValue("dog-1-worming-date", "2026-09-01");
    setValue("dog-1-flea-date", "2026-09-01");
    setValue("dog-1-medical-conditions", "yes");
    setValue("dog-1-medical-details", "Fictional mild joint stiffness.");
    setValue("dog-1-medication", "yes");
    setValue(
      "dog-1-medication-details",
      "One fictional tablet with the evening meal.",
    );
    setValue("dog-1-allergies", "yes");
    setValue("dog-1-allergy-details", "Fictional seasonal pollen sensitivity.");

    setValue(
      "dog-1-daily-routine",
      "Breakfast, a morning walk, an afternoon rest and an evening walk.",
    );
    setValue("dog-1-feeding-routine", "Two fictional measured meals each day.");
    setValue("dog-1-exercise-requirements", "Two moderate walks.");
    setValue("dog-1-sleeping-arrangements", "Sleeps downstairs on a dog bed.");
    setValue("dog-1-other-dogs", "Friendly after a calm introduction.");
    setValue("dog-1-separation-anxiety", "May whine briefly when first left.");
    setValue("dog-1-aggression-fear", "yes");
    setValue(
      "dog-1-aggression-fear-details",
      "Fictionally nervous around noisy traffic; create distance and offer treats.",
    );
    setValue("dog-1-other-care", "Enjoys fictional puzzle feeders.");

    setValue("dog-1-feeding-consent", "yes");
    setValue("dog-1-on-lead-consent", "yes");
    setValue("dog-1-off-lead-consent", "no");
    setValue("dog-1-other-household-walk-consent", "yes");
    setValue("dog-1-socialising-consent", "yes");
    setValue("dog-1-overnight-consent", "no");
    setValue("dog-1-crate-consent", "yes");
    setChecked("dog-1-crate-agreement");
    setValue("dog-1-medication-consent", "yes");
    setValue("dog-1-emergency-treatment-consent", "yes");
    setChecked("accuracyConfirmation");
    setChecked("enquiryAcknowledgement");
  }

  // Development-only two-dog fixture for testing boarding relationships and
  // conditional-field nulling through the real serializer and API.
  function fillTwoDogBoardingTestData() {
    if (process.env.NODE_ENV !== "development") return;

    const form = formRef.current;
    if (!form) return;

    form.reset();

    flushSync(() => {
      setDogs([
        {
          id: 1,
          name: "Fictional Cedar",
          microchipped: "yes",
          medicalConditions: "no",
          medication: "no",
          allergies: "no",
          aggressionOrFear: "no",
          insured: "yes",
          crateRequired: "no",
        },
        {
          id: 2,
          name: "Fictional Pippin",
          microchipped: "no",
          medicalConditions: "yes",
          medication: "yes",
          allergies: "yes",
          aggressionOrFear: "yes",
          insured: "no",
          crateRequired: "yes",
        },
      ]);
      setNextDogId(3);
      setService("boarding");
      setReview(null);
      setValidationMessage("");
      setSubmissionState("idle");
      setSubmissionMessage("");
    });

    submissionAttemptRef.current = null;

    const setValue = (name: string, value: string) => {
      const field = form.elements.namedItem(name);

      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      ) {
        field.value = value;
      } else if (field instanceof RadioNodeList) {
        field.value = value;
      }
    };

    const setChecked = (name: string) => {
      const field = form.elements.namedItem(name);
      if (field instanceof HTMLInputElement) field.checked = true;
    };

    setValue("fullName", "Morgan Boarding-Test Example");
    setValue("telephone", "07222 333444");
    setValue("email", "two.dog.boarding@example.com");
    setValue("homeAddress", "20 Demonstration Close, Exampleford, Cornwall");
    setValue("postcode", "PL15 4CD");
    setValue("service", "boarding");
    setValue("arrivalDate", "2027-02-12");
    setValue("departureDate", "2027-02-15");
    setValue("arrivalTime", "10:00");
    setValue("collectionTime", "16:00");
    setValue("sameHouseholdDogs", "yes");
    setValue("bookingNotes", "DEV TWO-DOG BOARDING TEST - entirely fictional.");

    setValue("dog-1-name", "Fictional Cedar");
    setValue("dog-1-breed", "Imaginary Labrador cross");
    setValue("dog-1-age", "5 fictional years");
    setValue("dog-1-sex", "male");
    setValue("dog-1-neutered", "yes");
    setValue("dog-1-microchipped", "yes");
    setValue("dog-1-microchip-number", "FICTIONAL-CHIP-CEDAR");
    setValue("dog-1-insured", "yes");
    setValue("dog-1-insurance-company", "Example Pet Cover");
    setValue("dog-1-policy-number", "FICTIONAL-POLICY-CEDAR");
    setValue(
      "dog-1-vet-details",
      "Sample Animal Clinic, 2 Imaginary Street, 01000 222222",
    );
    setValue("dog-1-vaccination-date", "2026-08-10");
    setValue("dog-1-worming-date", "2026-09-10");
    setValue("dog-1-flea-date", "2026-09-10");
    setValue("dog-1-medical-conditions", "no");
    setValue("dog-1-medication", "no");
    setValue("dog-1-allergies", "no");
    setValue("dog-1-daily-routine", "Early breakfast, two walks and a quiet evening.");
    setValue("dog-1-feeding-routine", "Two fictional measured meals each day.");
    setValue("dog-1-exercise-requirements", "Two medium-length walks.");
    setValue("dog-1-sleeping-arrangements", "Sleeps downstairs on a dog bed.");
    setValue("dog-1-other-dogs", "Friendly after a calm introduction.");
    setValue("dog-1-separation-anxiety", "No fictional separation concerns.");
    setValue("dog-1-aggression-fear", "no");
    setValue("dog-1-other-care", "Enjoys fictional puzzle feeders.");
    setValue("dog-1-feeding-consent", "yes");
    setValue("dog-1-on-lead-consent", "yes");
    setValue("dog-1-off-lead-consent", "yes");
    setValue("dog-1-other-household-walk-consent", "yes");
    setValue("dog-1-socialising-consent", "yes");
    setValue("dog-1-overnight-consent", "yes");
    setValue("dog-1-crate-consent", "no");
    setValue("dog-1-medication-consent", "yes");
    setValue("dog-1-emergency-treatment-consent", "yes");

    setValue("dog-2-name", "Fictional Pippin");
    setValue("dog-2-breed", "Imaginary Terrier cross");
    setValue("dog-2-age", "Approximately 7 fictional years");
    setValue("dog-2-sex", "female");
    setValue("dog-2-neutered", "yes");
    setValue("dog-2-microchipped", "no");
    setValue("dog-2-insured", "no");
    setValue(
      "dog-2-vet-details",
      "Sample Animal Clinic, 2 Imaginary Street, 01000 222222",
    );
    setValue("dog-2-vaccination-date", "2026-08-11");
    setValue("dog-2-worming-date", "2026-09-11");
    setValue("dog-2-flea-date", "2026-09-11");
    setValue("dog-2-medical-conditions", "yes");
    setValue(
      "dog-2-medical-details",
      "Fictional mild joint stiffness for the conditional nulling test.",
    );
    setValue("dog-2-medication", "yes");
    setValue(
      "dog-2-medication-details",
      "One fictional tablet with the evening meal.",
    );
    setValue("dog-2-allergies", "yes");
    setValue("dog-2-allergy-details", "Fictional seasonal pollen sensitivity.");
    setValue(
      "dog-2-daily-routine",
      "A short morning walk, rest periods and an evening stroll.",
    );
    setValue("dog-2-feeding-routine", "Two small fictional meals each day.");
    setValue("dog-2-exercise-requirements", "Short walks at a gentle pace.");
    setValue("dog-2-sleeping-arrangements", "Sleeps in her own supplied crate.");
    setValue("dog-2-other-dogs", "Prefers calm dogs and gradual introductions.");
    setValue("dog-2-separation-anxiety", "May whine briefly when first left.");
    setValue("dog-2-aggression-fear", "yes");
    setValue(
      "dog-2-aggression-fear-details",
      "Fictionally nervous around unfamiliar large dogs; use distance and treats.",
    );
    setValue("dog-2-other-care", "Entirely fictional care information.");
    setValue("dog-2-feeding-consent", "no");
    setValue("dog-2-on-lead-consent", "yes");
    setValue("dog-2-off-lead-consent", "no");
    setValue("dog-2-other-household-walk-consent", "yes");
    setValue("dog-2-socialising-consent", "yes");
    setValue("dog-2-overnight-consent", "yes");
    setValue("dog-2-crate-consent", "yes");
    setChecked("dog-2-crate-agreement");
    setValue("dog-2-medication-consent", "yes");
    setValue("dog-2-emergency-treatment-consent", "yes");

    setChecked("accuracyConfirmation");
    setChecked("enquiryAcknowledgement");
  }

  function prepareReview() {
    const form = formRef.current;
    if (!form) return;

    if (!form.checkValidity()) {
      setValidationMessage(
        "Some required information is missing. Please complete the highlighted question shown by your browser.",
      );
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const dates =
      service === "boarding"
        ? `${String(data.get("arrivalDate"))} to ${String(data.get("departureDate"))}`
        : String(data.get("dayCareDates"));

    setValidationMessage("");
    setSubmissionState("idle");
    setSubmissionMessage("");
    setReview({
      name: String(data.get("fullName")),
      email: String(data.get("email")),
      telephone: String(data.get("telephone")),
      service: service === "boarding" ? "Home from Home Boarding" : "Doggy Day Care",
      dates,
      dogs: dogs.map((dog) => dog.name),
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionState === "submitting") return;

    if (!review) {
      prepareReview();
      return;
    }

    const form = formRef.current;
    if (!form || !form.checkValidity()) {
      prepareReview();
      return;
    }

    const formData = new FormData(form);
    let submissionKey =
      submissionAttemptRef.current?.submissionKey ?? crypto.randomUUID();

    try {
      let payload = serializeBookingEnquiry({ formData, dogs, submissionKey });
      let payloadJson = JSON.stringify(payload);

      if (
        submissionAttemptRef.current &&
        submissionAttemptRef.current.payloadJson !== payloadJson
      ) {
        submissionKey = crypto.randomUUID();
        payload = serializeBookingEnquiry({ formData, dogs, submissionKey });
        payloadJson = JSON.stringify(payload);
      }

      submissionAttemptRef.current = { submissionKey, payloadJson };
      setSubmissionState("submitting");
      setSubmissionMessage("");
      setValidationMessage("");

      const response = await fetch("/api/booking-enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Booking-Anti-Bot": String(formData.get("antiBotField") ?? ""),
        },
        body: payloadJson,
      });

      if (response.status === 200 || response.status === 201) {
        submissionAttemptRef.current = null;
        setSubmissionState("success");
        setSubmissionMessage("");
        setReview(null);
        return;
      }

      if (response.status === 400) {
        setSubmissionMessage(
          "Some information could not be accepted. Please review the form and try again.",
        );
      } else if (response.status === 409) {
        submissionAttemptRef.current = null;
        setSubmissionMessage(
          "We could not safely retry this enquiry. Please review it and try sending it again.",
        );
      } else {
        setSubmissionMessage(
          "We could not send your enquiry just now. Your information is still here, so please try again.",
        );
      }

      setSubmissionState("error");
    } catch {
      setSubmissionState("error");
      setSubmissionMessage(
        "We could not send your enquiry just now. Your information is still here, so please try again.",
      );
    }
  }

  function handleFormChange() {
    if (review) setReview(null);
    if (submissionState !== "submitting") {
      setSubmissionState("idle");
      setSubmissionMessage("");
    }
    if (validationMessage) setValidationMessage("");
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onChange={handleFormChange}
      aria-busy={submissionState === "submitting"}
      className="mx-auto max-w-5xl"
    >
      <div hidden aria-hidden="true">
        <label>
          Anti-bot check: leave this field empty
          <input
            name="antiBotField"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="mb-6 flex flex-wrap items-center gap-3 border border-dashed border-amber-600 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <button
            type="button"
            onClick={fillTestData}
            className="shrink-0 border border-amber-800 px-3 py-2 font-bold hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800"
          >
            Fill test data
          </button>
          <button
            type="button"
            onClick={fillTwoDogBoardingTestData}
            className="border border-amber-800 px-3 py-2 font-bold hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800"
          >
            Fill two-dog boarding test
          </button>
          <span>Development testing only</span>
        </div>
      )}

      <div className="mb-10 flex flex-col gap-3 border-l-4 border-blue-800 bg-blue-50 px-5 py-4 text-sm leading-6 text-slate-700 sm:flex-row sm:justify-between">
        <p>
          Fields marked <span className="font-bold text-red-700">*</span> are required.
        </p>
        <p>Your information is only sent after you review and submit the enquiry.</p>
      </div>

      {submissionState === "success" && (
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          className="mb-10 border border-green-700 bg-green-50 p-5 outline-none focus:ring-2 focus:ring-green-700"
        >
          <h2 className="text-xl font-bold text-green-900">Enquiry received</h2>
          <p className="mt-2 leading-7 text-green-900">
            Thank you. Your booking enquiry has been received. This does not confirm a
            booking; Kerry will contact you about availability and the next steps.
          </p>
        </div>
      )}

      {submissionState === "error" && (
        <div role="alert" className="mb-10 border border-red-700 bg-red-50 p-4 text-red-900">
          <p className="font-bold">Your enquiry was not sent</p>
          <p className="mt-1 text-sm">{submissionMessage}</p>
        </div>
      )}

      {validationMessage && (
        <div role="alert" className="mb-10 border border-red-700 bg-red-50 p-4 text-red-900">
          <p className="font-bold">Please check the form</p>
          <p className="mt-1 text-sm">{validationMessage}</p>
        </div>
      )}

      <FormSection number="01" title="Your details">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="font-bold text-slate-900">
            Full name
            <RequiredMark />
            <input name="fullName" type="text" autoComplete="name" required className={inputStyles} />
          </label>
          <label className="font-bold text-slate-900">
            Telephone number
            <RequiredMark />
            <input name="telephone" type="tel" autoComplete="tel" required className={inputStyles} />
          </label>
          <label className="font-bold text-slate-900 sm:col-span-2">
            Email address
            <RequiredMark />
            <input name="email" type="email" autoComplete="email" required className={inputStyles} />
          </label>
          <label className="font-bold text-slate-900 sm:col-span-2">
            Home address
            <RequiredMark />
            <textarea
              name="homeAddress"
              autoComplete="street-address"
              required
              rows={3}
              className={inputStyles}
            />
          </label>
          <label className="font-bold text-slate-900">
            Postcode
            <RequiredMark />
            <input
              name="postcode"
              type="text"
              autoComplete="postal-code"
              required
              className={inputStyles}
            />
          </label>
        </div>
      </FormSection>

      <FormSection
        number="02"
        title="Booking dates"
        description="Dates are requested only and remain subject to availability."
      >
        <div className="grid gap-7">
          <fieldset>
            <legend className="font-bold text-slate-900">
              Which service do you need?
              <RequiredMark />
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 border border-slate-300 p-4">
                <input
                  name="service"
                  type="radio"
                  value="day-care"
                  required
                  checked={service === "day-care"}
                  onChange={() => setService("day-care")}
                  className="size-4 accent-blue-800"
                />
                <span className="font-bold text-slate-800">Doggy Day Care</span>
              </label>
              <label className="flex items-center gap-3 border border-slate-300 p-4">
                <input
                  name="service"
                  type="radio"
                  value="boarding"
                  required
                  checked={service === "boarding"}
                  onChange={() => setService("boarding")}
                  className="size-4 accent-blue-800"
                />
                <span className="font-bold text-slate-800">Home from Home Boarding</span>
              </label>
            </div>
          </fieldset>

          {service === "day-care" && (
            <label className="font-bold text-slate-900">
              Requested day care date or dates
              <RequiredMark />
              <input
                name="dayCareDates"
                type="text"
                required
                placeholder="For example: 12 October, or Mondays during November"
                className={inputStyles}
              />
            </label>
          )}

          {service === "boarding" && (
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="font-bold text-slate-900">
                Arrival date
                <RequiredMark />
                <input name="arrivalDate" type="date" required className={inputStyles} />
              </label>
              <label className="font-bold text-slate-900">
                Departure date
                <RequiredMark />
                <input name="departureDate" type="date" required className={inputStyles} />
              </label>
            </div>
          )}

          {service && (
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="font-bold text-slate-900">
                Preferred arrival time
                <input name="arrivalTime" type="time" className={inputStyles} />
              </label>
              <label className="font-bold text-slate-900">
                Preferred collection time
                <input name="collectionTime" type="time" className={inputStyles} />
              </label>
            </div>
          )}

          <YesNoQuestion
            name="sameHouseholdDogs"
            legend="Will more than one dog from this household attend or board at the same time?"
            required
          />

          <label className="font-bold text-slate-900">
            Additional booking notes
            <textarea name="bookingNotes" rows={3} className={inputStyles} />
          </label>
        </div>
      </FormSection>

      <FormSection
        number="03"
        title="Dog details"
        description="Add every dog from your household included in this enquiry."
      >
        <div className="grid gap-8">
          {dogs.map((dog, index) => (
            <article key={dog.id} className="border border-slate-300 p-5 sm:p-7">
              <div className="flex items-start justify-between gap-5">
                <DogHeading dog={dog} index={index} />
                {dogs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDog(dog.id)}
                    className="font-bold text-red-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <label className="font-bold text-slate-900">
                  Dog’s name
                  <RequiredMark />
                  <input
                    name={`dog-${dog.id}-name`}
                    type="text"
                    required
                    value={dog.name}
                    onChange={(event) => updateDogName(dog.id, event.target.value)}
                    className={inputStyles}
                  />
                </label>
                <label className="font-bold text-slate-900">
                  Breed
                  <RequiredMark />
                  <input name={`dog-${dog.id}-breed`} type="text" required className={inputStyles} />
                </label>
                <label className="font-bold text-slate-900">
                  Date of birth or approximate age
                  <RequiredMark />
                  <input name={`dog-${dog.id}-age`} type="text" required className={inputStyles} />
                </label>
                <label className="font-bold text-slate-900">
                  Sex
                  <RequiredMark />
                  <select name={`dog-${dog.id}-sex`} required defaultValue="" className={inputStyles}>
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </label>
              </div>

              <div className="mt-7 grid gap-7">
                <YesNoQuestion
                  name={`dog-${dog.id}-neutered`}
                  legend="Is this dog neutered or spayed?"
                  required
                />
                <YesNoQuestion
                  name={`dog-${dog.id}-microchipped`}
                  legend="Is this dog microchipped?"
                  required
                  value={dog.microchipped}
                  onChange={(value) => updateDogCondition(dog.id, "microchipped", value)}
                />
                {dog.microchipped === "yes" && (
                  <label className="font-bold text-slate-900">
                    Microchip number
                    <RequiredMark />
                    <input
                      name={`dog-${dog.id}-microchip-number`}
                      type="text"
                      required
                      className={inputStyles}
                    />
                  </label>
                )}

                <YesNoQuestion
                  name={`dog-${dog.id}-insured`}
                  legend="Is this dog currently insured?"
                  required
                  value={dog.insured}
                  onChange={(value) => updateDogCondition(dog.id, "insured", value)}
                />
                {dog.insured === "yes" && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="font-bold text-slate-900">
                      Insurance company
                      <RequiredMark />
                      <input
                        name={`dog-${dog.id}-insurance-company`}
                        type="text"
                        required
                        className={inputStyles}
                      />
                    </label>
                    <label className="font-bold text-slate-900">
                      Policy number
                      <RequiredMark />
                      <input
                        name={`dog-${dog.id}-policy-number`}
                        type="text"
                        required
                        className={inputStyles}
                      />
                    </label>
                  </div>
                )}
              </div>
            </article>
          ))}

          <button
            type="button"
            onClick={addDog}
            disabled={dogs.length >= 5}
            className="justify-self-start border border-blue-800 px-5 py-3 font-bold text-blue-800 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
          >
            {dogs.length >= 5 ? "Maximum of five dogs" : "+ Add another dog"}
          </button>
        </div>
      </FormSection>

      <FormSection
        number="04"
        title="Health and medication"
        description="Please provide these details separately for every dog."
      >
        <div className="grid gap-8">
          {dogs.map((dog, index) => (
            <fieldset key={dog.id} className="border border-slate-300 p-5 sm:p-7">
              <legend className="px-2">
                <DogHeading dog={dog} index={index} />
              </legend>
              <div className="grid gap-7">
                <label className="font-bold text-slate-900">
                  Usual veterinary practice — name, address and contact details
                  <RequiredMark />
                  <textarea
                    name={`dog-${dog.id}-vet-details`}
                    rows={4}
                    required
                    className={inputStyles}
                  />
                </label>

                <div className="grid gap-6 sm:grid-cols-3">
                  <label className="font-bold text-slate-900">
                    Most recent vaccination
                    <RequiredMark />
                    <input
                      name={`dog-${dog.id}-vaccination-date`}
                      type="date"
                      required
                      className={inputStyles}
                    />
                  </label>
                  <label className="font-bold text-slate-900">
                    Most recent worming
                    <RequiredMark />
                    <input
                      name={`dog-${dog.id}-worming-date`}
                      type="date"
                      required
                      className={inputStyles}
                    />
                  </label>
                  <label className="font-bold text-slate-900">
                    Most recent flea treatment
                    <RequiredMark />
                    <input
                      name={`dog-${dog.id}-flea-date`}
                      type="date"
                      required
                      className={inputStyles}
                    />
                  </label>
                </div>

                <YesNoQuestion
                  name={`dog-${dog.id}-medical-conditions`}
                  legend="Does this dog have any medical conditions?"
                  required
                  value={dog.medicalConditions}
                  onChange={(value) => updateDogCondition(dog.id, "medicalConditions", value)}
                />
                {dog.medicalConditions === "yes" && (
                  <label className="font-bold text-slate-900">
                    Medical condition details
                    <RequiredMark />
                    <textarea
                      name={`dog-${dog.id}-medical-details`}
                      rows={3}
                      required
                      className={inputStyles}
                    />
                  </label>
                )}

                <YesNoQuestion
                  name={`dog-${dog.id}-medication`}
                  legend="Does this dog currently take medication?"
                  required
                  value={dog.medication}
                  onChange={(value) => updateDogCondition(dog.id, "medication", value)}
                />
                {dog.medication === "yes" && (
                  <label className="font-bold text-slate-900">
                    Medication, dosage and administration instructions
                    <RequiredMark />
                    <textarea
                      name={`dog-${dog.id}-medication-details`}
                      rows={4}
                      required
                      className={inputStyles}
                    />
                  </label>
                )}

                <YesNoQuestion
                  name={`dog-${dog.id}-allergies`}
                  legend="Does this dog have any allergies?"
                  required
                  value={dog.allergies}
                  onChange={(value) => updateDogCondition(dog.id, "allergies", value)}
                />
                {dog.allergies === "yes" && (
                  <label className="font-bold text-slate-900">
                    Allergy details
                    <RequiredMark />
                    <textarea
                      name={`dog-${dog.id}-allergy-details`}
                      rows={3}
                      required
                      className={inputStyles}
                    />
                  </label>
                )}
              </div>
            </fieldset>
          ))}
        </div>
      </FormSection>

      <FormSection
        number="05"
        title="Behaviour and care"
        description="Tell us what helps each dog feel safe, comfortable and settled."
      >
        <div className="grid gap-8">
          {dogs.map((dog, index) => (
            <fieldset key={dog.id} className="border border-slate-300 p-5 sm:p-7">
              <legend className="px-2">
                <DogHeading dog={dog} index={index} />
              </legend>
              <div className="grid gap-6">
                <label className="font-bold text-slate-900">
                  Daily routine and care preferences
                  <RequiredMark />
                  <textarea
                    name={`dog-${dog.id}-daily-routine`}
                    rows={4}
                    required
                    placeholder="Usual waking, rest, toilet and bedtime routines"
                    className={inputStyles}
                  />
                </label>
                <label className="font-bold text-slate-900">
                  Feeding routine
                  <RequiredMark />
                  <textarea
                    name={`dog-${dog.id}-feeding-routine`}
                    rows={3}
                    required
                    className={inputStyles}
                  />
                </label>
                <label className="font-bold text-slate-900">
                  Exercise requirements
                  <textarea
                    name={`dog-${dog.id}-exercise-requirements`}
                    rows={3}
                    className={inputStyles}
                  />
                </label>
                <label className="font-bold text-slate-900">
                  Sleeping arrangements
                  <textarea
                    name={`dog-${dog.id}-sleeping-arrangements`}
                    rows={3}
                    className={inputStyles}
                  />
                </label>
                <label className="font-bold text-slate-900">
                  Behaviour around other dogs
                  <RequiredMark />
                  <textarea
                    name={`dog-${dog.id}-other-dogs`}
                    rows={3}
                    required
                    className={inputStyles}
                  />
                </label>
                <label className="font-bold text-slate-900">
                  Separation anxiety or distress
                  <textarea
                    name={`dog-${dog.id}-separation-anxiety`}
                    rows={3}
                    className={inputStyles}
                  />
                </label>

                <YesNoQuestion
                  name={`dog-${dog.id}-aggression-fear`}
                  legend="Does this dog have any history of aggression, fear or reactivity?"
                  required
                  value={dog.aggressionOrFear}
                  onChange={(value) => updateDogCondition(dog.id, "aggressionOrFear", value)}
                />
                {dog.aggressionOrFear === "yes" && (
                  <label className="font-bold text-slate-900">
                    Please describe the behaviour, triggers and how it is normally managed
                    <RequiredMark />
                    <textarea
                      name={`dog-${dog.id}-aggression-fear-details`}
                      rows={4}
                      required
                      className={inputStyles}
                    />
                  </label>
                )}

                <label className="font-bold text-slate-900">
                  Anything else we should know about caring for this dog?
                  <textarea name={`dog-${dog.id}-other-care`} rows={4} className={inputStyles} />
                </label>
              </div>
            </fieldset>
          ))}
        </div>
      </FormSection>

      <FormSection
        number="06"
        title="Permissions and consent"
        description="Please answer separately for each dog. A ‘no’ answer helps us assess suitability and care arrangements."
      >
        <div className="grid gap-8">
          {dogs.map((dog, index) => (
            <fieldset key={dog.id} className="border border-slate-300 p-5 sm:p-7">
              <legend className="px-2">
                <DogHeading dog={dog} index={index} />
              </legend>
              <div className="grid gap-8">
                {consentQuestions.map((question) => {
                  const isCrateQuestion = question.key === "crate-consent";

                  return (
                    <div key={question.key}>
                      <YesNoQuestion
                        name={`dog-${dog.id}-${question.key}`}
                        legend={question.label}
                        required
                        value={isCrateQuestion ? dog.crateRequired : undefined}
                        onChange={
                          isCrateQuestion
                            ? (value) =>
                                updateDogCondition(dog.id, "crateRequired", value)
                            : undefined
                        }
                      />
                      {isCrateQuestion && dog.crateRequired === "yes" && (
                        <label className="mt-4 flex items-start gap-3 border-l-4 border-blue-800 bg-blue-50 px-4 py-3">
                          <input
                            name={`dog-${dog.id}-crate-agreement`}
                            type="checkbox"
                            required
                            className="mt-1 size-4 shrink-0 accent-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
                          />
                          <span className="font-bold text-slate-900">
                            You will need to provide your own crate. Do you agree?
                            <RequiredMark />
                          </span>
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      </FormSection>

      <FormSection
        number="07"
        title="Review and submit"
        description="Review your information before sending your booking enquiry."
      >
        <div>
          <div className="grid gap-4">
            <label className="flex items-start gap-3">
              <input
                name="accuracyConfirmation"
                type="checkbox"
                required
                className="mt-1 size-4 shrink-0 accent-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
              />
              <span className="text-slate-700">
                I confirm that the information supplied is accurate and complete.
                <RequiredMark />
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                name="enquiryAcknowledgement"
                type="checkbox"
                required
                className="mt-1 size-4 shrink-0 accent-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
              />
              <span className="text-slate-700">
                I understand that this is an enquiry and does not confirm availability or
                a booking.
                <RequiredMark />
              </span>
            </label>
          </div>

          {!review && submissionState !== "success" && (
            <button
              type="button"
              onClick={prepareReview}
              className="mt-8 bg-blue-800 px-7 py-4 font-bold text-white hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            >
              Review enquiry
            </button>
          )}

          {review && (
            <div id="enquiry-review" className="mt-9 border-y border-slate-300 py-8">
              <h3
                ref={reviewRef}
                tabIndex={-1}
                className="text-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-800"
              >
                Check your enquiry
              </h3>
              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-slate-500">Your name</dt>
                  <dd className="mt-1 font-bold text-slate-900">{review.name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Contact</dt>
                  <dd className="mt-1 text-slate-900">{review.email}</dd>
                  <dd className="text-slate-900">{review.telephone}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Service</dt>
                  <dd className="mt-1 font-bold text-slate-900">{review.service}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Requested dates</dt>
                  <dd className="mt-1 font-bold text-slate-900">{review.dates}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm text-slate-500">Dogs included</dt>
                  <dd className="mt-1 font-bold text-slate-900">{review.dogs.join(", ")}</dd>
                </div>
              </dl>
              <p className="mt-6 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-950">
                This remains an enquiry only. Availability and the booking must be
                confirmed directly by Doggy Day Care &amp; Home from Home Boarding.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={submissionState === "submitting"}
                  className="bg-blue-800 px-7 py-4 font-bold text-white hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submissionState === "submitting"
                    ? "Sending enquiry..."
                    : submissionState === "error"
                      ? "Try sending again"
                      : "Submit booking enquiry"}
                </button>
                <button
                  type="button"
                  onClick={() => setReview(null)}
                  disabled={submissionState === "submitting"}
                  className="border border-slate-400 px-7 py-4 font-bold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Edit details
                </button>
              </div>
            </div>
          )}
        </div>
      </FormSection>
    </form>
  );
}
