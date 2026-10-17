import "server-only";

import { Resend } from "resend";

import type { BookingEnquirySubmission } from "@/lib/booking-enquiry-schema";

const EMAIL_TIMEOUT_MS = 10_000;

let resendClient: Resend | undefined;

export type BookingNotificationFailureReason =
  | "configuration"
  | "delivery"
  | "unexpected";

export class BookingNotificationError extends Error {
  constructor(
    readonly reason: BookingNotificationFailureReason,
    message = "Booking notification email could not be sent",
  ) {
    super(message);
    this.name = "BookingNotificationError";
  }
}

function getEmailConfiguration() {
  const apiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.BOOKING_NOTIFICATION_EMAIL;
  const fromEmail = process.env.BOOKING_FROM_EMAIL;

  if (!apiKey) {
    throw new BookingNotificationError(
      "configuration",
      "Missing required server environment variable: RESEND_API_KEY",
    );
  }

  if (!notificationEmail) {
    throw new BookingNotificationError(
      "configuration",
      "Missing required server environment variable: BOOKING_NOTIFICATION_EMAIL",
    );
  }

  if (!fromEmail) {
    throw new BookingNotificationError(
      "configuration",
      "Missing required server environment variable: BOOKING_FROM_EMAIL",
    );
  }

  resendClient ??= new Resend(apiKey);

  return {
    fromEmail,
    notificationEmail,
    resend: resendClient,
  };
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

function singleLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function formatService(service: BookingEnquirySubmission["booking"]["service"]) {
  return service === "boarding" ? "Home from Home Boarding" : "Doggy Day Care";
}

function formatRequestedDates(booking: BookingEnquirySubmission["booking"]) {
  if (booking.service === "boarding") {
    return `${booking.arrivalDate} to ${booking.departureDate}`;
  }

  return booking.dayCareDatesText ?? "Not supplied";
}

function buildNotificationContent(
  enquiryId: string,
  submission: BookingEnquirySubmission,
) {
  const service = formatService(submission.booking.service);
  const requestedDates = formatRequestedDates(submission.booking);
  const dogNames = submission.dogs.map((dog) => dog.name).join(", ");
  const arrivalTime = submission.booking.preferredArrivalTime ?? "Not specified";
  const collectionTime = submission.booking.preferredCollectionTime ?? "Not specified";
  const notes = submission.booking.notes ?? "None";

  const text = [
    "A new booking enquiry has been stored.",
    "",
    `Enquiry ID: ${enquiryId}`,
    `Customer: ${submission.owner.fullName}`,
    `Email: ${submission.owner.email}`,
    `Telephone: ${submission.owner.telephone}`,
    `Service: ${service}`,
    `Requested dates: ${requestedDates}`,
    `Preferred arrival time: ${arrivalTime}`,
    `Preferred collection time: ${collectionTime}`,
    `Number of dogs: ${submission.dogs.length}`,
    `Dogs: ${dogNames}`,
    `Booking notes: ${notes}`,
    "",
    "Additional identification, insurance, health, care and permission details are available in the booking system.",
  ].join("\n");

  const rows = [
    ["Enquiry ID", enquiryId],
    ["Customer", submission.owner.fullName],
    ["Email", submission.owner.email],
    ["Telephone", submission.owner.telephone],
    ["Service", service],
    ["Requested dates", requestedDates],
    ["Preferred arrival time", arrivalTime],
    ["Preferred collection time", collectionTime],
    ["Number of dogs", String(submission.dogs.length)],
    ["Dogs", dogNames],
    ["Booking notes", notes],
  ]
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:6px 12px 6px 0;vertical-align:top">${escapeHtml(label)}</th><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const html = `
    <h1>New booking enquiry</h1>
    <p>A new booking enquiry has been stored.</p>
    <table>${rows}</table>
    <p>Additional identification, insurance, health, care and permission details are available in the booking system.</p>
  `;

  return {
    html,
    service,
    text,
  };
}

export async function sendBookingEnquiryNotification(
  enquiryId: string,
  submission: BookingEnquirySubmission,
) {
  const { fromEmail, notificationEmail, resend } = getEmailConfiguration();
  const content = buildNotificationContent(enquiryId, submission);

  try {
    const { error } = await resend.emails.send(
      {
        from: fromEmail,
        to: notificationEmail,
        replyTo: submission.owner.email,
        subject: `New booking enquiry - ${singleLine(submission.owner.fullName)} - ${content.service}`,
        html: content.html,
        text: content.text,
      },
      {
        idempotencyKey: `booking-enquiry/${enquiryId}`,
        signal: AbortSignal.timeout(EMAIL_TIMEOUT_MS),
      },
    );

    if (error) {
      throw new BookingNotificationError("delivery");
    }
  } catch (error) {
    if (error instanceof BookingNotificationError) throw error;
    throw new BookingNotificationError("unexpected");
  }
}
