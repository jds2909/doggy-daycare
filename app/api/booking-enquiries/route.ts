import { z } from "zod";

import {
  BookingNotificationError,
  sendBookingEnquiryNotification,
} from "@/lib/booking-email";
import { bookingEnquirySchema } from "@/lib/booking-enquiry-schema";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 64 * 1024;
const HONEYPOT_HEADER = "x-booking-anti-bot";

const persistenceResultSchema = z
  .array(
    z.object({
      enquiry_id: z.uuid(),
      was_created: z.boolean(),
    }),
  )
  .length(1);

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const parsedOrigin = new URL(origin);

    if (
      process.env.NODE_ENV === "development" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(parsedOrigin.hostname)
    ) {
      return parsedOrigin.protocol === "http:" || parsedOrigin.protocol === "https:";
    }

    const allowedOrigins = (process.env.BOOKING_ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => new URL(value).origin);

    return allowedOrigins.includes(parsedOrigin.origin);
  } catch {
    return false;
  }
}

async function readLimitedJson(request: Request): Promise<unknown> {
  const contentLength = request.headers.get("content-length");

  if (contentLength !== null) {
    const declaredBytes = Number(contentLength);
    if (Number.isFinite(declaredBytes) && declaredBytes > MAX_REQUEST_BYTES) {
      throw new RequestBodyTooLargeError();
    }
  }

  if (!request.body) throw new SyntaxError("Missing request body");

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let receivedBytes = 0;
  let body = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    receivedBytes += value.byteLength;
    if (receivedBytes > MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new RequestBodyTooLargeError();
    }

    body += decoder.decode(value, { stream: true });
  }

  body += decoder.decode();
  return JSON.parse(body);
}

class RequestBodyTooLargeError extends Error {}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return errorResponse(403, "ORIGIN_NOT_ALLOWED", "This request is not allowed");
  }

  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();

  if (contentType !== "application/json") {
    return errorResponse(400, "INVALID_CONTENT_TYPE", "Content-Type must be application/json");
  }

  // Return a neutral response so automated submitters do not learn which
  // anti-bot check they triggered. Nothing is validated, stored or emailed.
  if ((request.headers.get(HONEYPOT_HEADER) ?? "").trim() !== "") {
    return Response.json(
      {
        wasCreated: false,
        message: "Booking enquiry received. This does not confirm a booking.",
      },
      { status: 200 },
    );
  }

  let requestBody: unknown;

  try {
    requestBody = await readLimitedJson(request);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return errorResponse(
        413,
        "PAYLOAD_TOO_LARGE",
        "The booking enquiry is larger than the allowed limit",
      );
    }

    return errorResponse(400, "MALFORMED_JSON", "The request body must contain valid JSON");
  }

  const validation = bookingEnquirySchema.safeParse(requestBody);

  if (!validation.success) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "The booking enquiry contains invalid or missing information",
          fields: validation.error.issues.map((issue) => ({
            path: issue.path.map(String).join("."),
            message: issue.message,
          })),
        },
      },
      { status: 400 },
    );
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.rpc("create_booking_enquiry", {
      payload: validation.data,
    });

    if (error) {
      if (error.code === "23505") {
        return errorResponse(
          409,
          "SUBMISSION_KEY_CONFLICT",
          "This submission key has already been used for a different enquiry",
        );
      }

      console.error("Booking enquiry persistence failed");
      return errorResponse(
        500,
        "PERSISTENCE_ERROR",
        "The booking enquiry could not be saved. Please try again later",
      );
    }

    const persistenceResult = persistenceResultSchema.safeParse(data);

    if (!persistenceResult.success) {
      console.error("Booking enquiry persistence returned an unexpected result");
      return errorResponse(
        500,
        "PERSISTENCE_ERROR",
        "The booking enquiry could not be saved. Please try again later",
      );
    }

    const result = persistenceResult.data[0];
    const status = result.was_created ? 201 : 200;

    if (result.was_created) {
      try {
        await sendBookingEnquiryNotification(result.enquiry_id, validation.data);
      } catch (error) {
        const reason =
          error instanceof BookingNotificationError ? error.reason : "unexpected";

        console.error("Booking enquiry notification failed", {
          enquiryId: result.enquiry_id,
          reason,
        });
      }
    }

    return Response.json(
      {
        enquiryId: result.enquiry_id,
        wasCreated: result.was_created,
        message: result.was_created
          ? "Booking enquiry received. This does not confirm a booking."
          : "This booking enquiry was already received. No duplicate was created.",
      },
      { status },
    );
  } catch {
    console.error("Booking enquiry API encountered an unexpected server error");

    return Response.json(
      {
        message: "Unable to process booking enquiry.",
      },
      { status: 500 },
    );
  }
}
