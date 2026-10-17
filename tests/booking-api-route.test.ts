import { beforeEach, describe, expect, it, vi } from "vitest";

import { enquiryId, makeDayCareSubmission } from "@/tests/fixtures/booking-enquiry";

const mocks = vi.hoisted(() => ({
  rpc: vi.fn(),
  sendNotification: vi.fn(),
}));

vi.mock("@/lib/supabase-server", () => ({
  getSupabaseServerClient: () => ({ rpc: mocks.rpc }),
}));

vi.mock("@/lib/booking-email", () => {
  class BookingNotificationError extends Error {
    constructor(readonly reason: string) {
      super("Notification failed");
    }
  }

  return {
    BookingNotificationError,
    sendBookingEnquiryNotification: mocks.sendNotification,
  };
});

import { POST } from "@/app/api/booking-enquiries/route";

const allowedOrigin = "https://booking.example.test";

type ApiResponseBody = {
  enquiryId?: string;
  wasCreated?: boolean;
  message?: string;
  error?: { code?: string };
};

function request(body: string, headers: Record<string, string> = {}) {
  return new Request("https://booking.example.test/api/booking-enquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: allowedOrigin,
      ...headers,
    },
    body,
  });
}

async function responseBody(response: Response) {
  return response.json() as Promise<ApiResponseBody>;
}

describe("POST /api/booking-enquiries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("BOOKING_ALLOWED_ORIGINS", allowedOrigin);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  it("returns 400 for malformed JSON", async () => {
    const response = await POST(request("{not-json"));
    expect(response.status).toBe(400);
    expect((await responseBody(response)).error?.code).toBe("MALFORMED_JSON");
  });

  it("returns 400 for a schema-invalid enquiry", async () => {
    const response = await POST(request(JSON.stringify({ dogs: [] })));
    expect(response.status).toBe(400);
    expect((await responseBody(response)).error?.code).toBe("VALIDATION_ERROR");
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it.each([
    ["missing", undefined],
    ["unexpected", "https://unexpected.example"],
  ])("returns 403 for a %s Origin", async (_name, origin) => {
    const headers = new Headers({ "Content-Type": "application/json" });
    if (origin) headers.set("Origin", origin);
    const response = await POST(new Request("https://booking.example.test/api/booking-enquiries", {
      method: "POST",
      headers,
      body: JSON.stringify(makeDayCareSubmission()),
    }));

    expect(response.status).toBe(403);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("returns 413 before parsing an oversized body", async () => {
    const response = await POST(request(JSON.stringify({ padding: "x".repeat(70_000) })));
    expect(response.status).toBe(413);
    expect((await responseBody(response)).error?.code).toBe("PAYLOAD_TOO_LARGE");
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("returns a neutral 200 for a filled honeypot without persisting", async () => {
    const response = await POST(request("{}", { "X-Booking-Anti-Bot": "filled" }));
    expect(response.status).toBe(200);
    expect(await responseBody(response)).toMatchObject({ wasCreated: false });
    expect(mocks.rpc).not.toHaveBeenCalled();
    expect(mocks.sendNotification).not.toHaveBeenCalled();
  });

  it("returns 201 and emails after a newly created enquiry", async () => {
    const payload = makeDayCareSubmission();
    mocks.rpc.mockResolvedValue({
      data: [{ enquiry_id: enquiryId, was_created: true }],
      error: null,
    });
    mocks.sendNotification.mockResolvedValue(undefined);

    const response = await POST(request(JSON.stringify(payload)));

    expect(response.status).toBe(201);
    expect(await responseBody(response)).toMatchObject({ enquiryId, wasCreated: true });
    expect(mocks.rpc).toHaveBeenCalledWith("create_booking_enquiry", { payload });
    expect(mocks.sendNotification).toHaveBeenCalledWith(enquiryId, payload);
  });

  it("returns 200 for an identical retry without sending another email", async () => {
    mocks.rpc.mockResolvedValue({
      data: [{ enquiry_id: enquiryId, was_created: false }],
      error: null,
    });

    const response = await POST(request(JSON.stringify(makeDayCareSubmission())));

    expect(response.status).toBe(200);
    expect(await responseBody(response)).toMatchObject({ enquiryId, wasCreated: false });
    expect(mocks.sendNotification).not.toHaveBeenCalled();
  });

  it("returns 409 for submission-key reuse with different content", async () => {
    mocks.rpc.mockResolvedValue({ data: null, error: { code: "23505" } });
    const response = await POST(request(JSON.stringify(makeDayCareSubmission())));

    expect(response.status).toBe(409);
    expect((await responseBody(response)).error?.code).toBe("SUBMISSION_KEY_CONFLICT");
    expect(mocks.sendNotification).not.toHaveBeenCalled();
  });

  it("returns a safe 500 for an unexpected persistence failure", async () => {
    mocks.rpc.mockRejectedValue(new Error("private database details"));
    const response = await POST(request(JSON.stringify(makeDayCareSubmission())));
    const body = await responseBody(response);

    expect(response.status).toBe(500);
    expect(body).toEqual({ message: "Unable to process booking enquiry." });
    expect(JSON.stringify(body)).not.toContain("private database details");
  });

  it("keeps the 201 persistence response when email delivery fails", async () => {
    mocks.rpc.mockResolvedValue({
      data: [{ enquiry_id: enquiryId, was_created: true }],
      error: null,
    });
    mocks.sendNotification.mockRejectedValue(new Error("Resend unavailable"));

    const response = await POST(request(JSON.stringify(makeDayCareSubmission())));

    expect(response.status).toBe(201);
    expect(await responseBody(response)).toMatchObject({ enquiryId, wasCreated: true });
    expect(mocks.sendNotification).toHaveBeenCalledOnce();
  });
});
