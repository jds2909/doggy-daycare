import { beforeEach, describe, expect, it, vi } from "vitest";

import { enquiryId, makeDayCareSubmission } from "@/tests/fixtures/booking-enquiry";

const mocks = vi.hoisted(() => ({ send: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.send };
  },
}));

import { sendBookingEnquiryNotification } from "@/lib/booking-email";

describe("sendBookingEnquiryNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("RESEND_API_KEY", "re_fictional_test_key");
    vi.stubEnv("BOOKING_NOTIFICATION_EMAIL", "inbox@example.test");
    vi.stubEnv(
      "BOOKING_FROM_EMAIL",
      "Doggy Day Care Bookings <bookings@example.test>",
    );
    mocks.send.mockResolvedValue({ data: { id: "email-id" }, error: null });
  });

  it("sends only the intended operational summary and excludes sensitive details", async () => {
    const payload = makeDayCareSubmission();
    payload.dogs[0].microchipNumber = "SECRET-MICROCHIP";
    payload.dogs[0].insuranceCompany = "SECRET-INSURER";
    payload.dogs[0].insurancePolicyNumber = "SECRET-POLICY";
    payload.dogs[0].health.veterinaryPracticeDetails = "SECRET-VET";
    payload.dogs[0].health.medicalConditionDetails = "SECRET-MEDICAL";
    payload.dogs[0].health.medicationDetails = "SECRET-MEDICATION";
    payload.dogs[0].health.allergyDetails = "SECRET-ALLERGY";

    await sendBookingEnquiryNotification(enquiryId, payload);

    expect(mocks.send).toHaveBeenCalledOnce();
    const [message, options] = mocks.send.mock.calls[0];
    const rendered = `${message.text}\n${message.html}`;

    expect(message).toMatchObject({
      from: "Doggy Day Care Bookings <bookings@example.test>",
      to: "inbox@example.test",
      replyTo: payload.owner.email,
    });
    expect(message.subject).toContain("Taylor Example");
    expect(rendered).toContain(enquiryId);
    expect(rendered).toContain(payload.owner.fullName);
    expect(rendered).toContain(payload.owner.email);
    expect(rendered).toContain(payload.owner.telephone);
    expect(rendered).toContain("Doggy Day Care");
    expect(rendered).toContain(payload.booking.dayCareDatesText);
    expect(rendered).toContain(payload.booking.preferredArrivalTime);
    expect(rendered).toContain(payload.booking.preferredCollectionTime);
    expect(rendered).toContain("Number of dogs: 1");
    expect(rendered).toContain(payload.dogs[0].name);
    expect(rendered).toContain(payload.booking.notes);
    expect(options.idempotencyKey).toBe(`booking-enquiry/${enquiryId}`);

    for (const secret of [
      "SECRET-MICROCHIP",
      "SECRET-INSURER",
      "SECRET-POLICY",
      "SECRET-VET",
      "SECRET-MEDICAL",
      "SECRET-MEDICATION",
      "SECRET-ALLERGY",
    ]) {
      expect(rendered).not.toContain(secret);
    }
  });

  it("HTML-escapes every user-supplied summary value", async () => {
    const payload = makeDayCareSubmission();
    payload.owner.fullName = '<script>alert("owner")</script>';
    payload.dogs[0].name = "Fido & <Milo>";
    payload.booking.notes = '<img src="x" onerror="alert(1)">';

    await sendBookingEnquiryNotification(enquiryId, payload);

    const [{ html }] = mocks.send.mock.calls[0];
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("Fido & <Milo>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("Fido &amp; &lt;Milo&gt;");
    expect(html).toContain("&lt;img src=&quot;x&quot;");
  });
});
