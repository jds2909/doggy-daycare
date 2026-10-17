import { z } from "zod";

export const enquiryStatuses = ["NEW", "PENDING_REVIEW", "CONTACTED", "CLOSED"] as const;
export const statusUpdateSchema = z.object({
  enquiryId: z.uuid(),
  status: z.enum(enquiryStatuses),
}).strict();

export type AdminActionState = { error: string; success: string };

export const enquirySummarySchema = z.object({
  id: z.uuid(),
  full_name: z.string(),
  service: z.enum(["day-care", "boarding"]),
  day_care_dates_text: z.string().nullable(),
  arrival_date: z.string().nullable(),
  departure_date: z.string().nullable(),
  created_at: z.string(),
  status: z.enum(enquiryStatuses),
  enquiry_dogs: z.array(z.object({ id: z.uuid() })),
});

// Stored records contain scalar columns. Only explicitly labelled business fields are rendered.
const storedRecord = z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]));
export const enquiryDetailSchema = z.object({
  id: z.uuid(),
  status: z.enum(enquiryStatuses),
  full_name: z.string(),
  enquiry_dogs: z.array(z.object({
    id: z.uuid(),
    name: z.string(),
    position: z.number(),
    dog_permissions: z.union([storedRecord, z.array(storedRecord), z.null()]),
  }).catchall(z.union([z.string(), z.number(), z.boolean(), z.null()]))),
}).catchall(z.union([z.string(), z.number(), z.boolean(), z.null()]));

export type StoredRecord = z.infer<typeof storedRecord>;
