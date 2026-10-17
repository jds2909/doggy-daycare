import "server-only";

import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { enquiryDetailSchema, enquirySummarySchema, statusUpdateSchema } from "@/lib/admin/enquiry-schema";
import { getSupabaseServerClient } from "@/lib/supabase-server";

const PAGE_SIZE = 25;

export async function listEnquiries(page: number) {
  await requireAdmin();
  const validPage = z.number().int().min(1).max(100_000).parse(page);
  const start = (validPage - 1) * PAGE_SIZE;
  const { data, error, count } = await getSupabaseServerClient()
    .from("booking_enquiries")
    .select("id,full_name,service,day_care_dates_text,arrival_date,departure_date,created_at,status,enquiry_dogs(id)", { count: "exact" })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(start, start + PAGE_SIZE - 1);
  const parsed = z.array(enquirySummarySchema).safeParse(data);
  if (error || !parsed.success) throw new Error("Unable to load booking enquiries.");
  return { enquiries: parsed.data, hasNext: (count ?? 0) > start + PAGE_SIZE };
}

export async function getEnquiry(id: string) {
  await requireAdmin();
  if (!z.uuid().safeParse(id).success) return null;
  const { data, error } = await getSupabaseServerClient()
    .from("booking_enquiries")
    .select("*,enquiry_dogs(*,dog_permissions(*))")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("Unable to load this enquiry.");
  if (!data) return null;
  const parsed = enquiryDetailSchema.safeParse(data);
  if (!parsed.success) throw new Error("Unable to load this enquiry.");
  parsed.data.enquiry_dogs.sort((a, b) => a.position - b.position);
  return parsed.data;
}

export async function updateEnquiryStatus(input: unknown) {
  await requireAdmin();
  const validation = statusUpdateSchema.safeParse(input);
  if (!validation.success) return { error: "Choose a valid enquiry and status.", success: "" };
  const { enquiryId, status } = validation.data;
  const { data, error } = await getSupabaseServerClient()
    .from("booking_enquiries")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", enquiryId)
    .select("id")
    .maybeSingle();
  if (error) return { error: "The status could not be saved. Please try again.", success: "" };
  if (!data) return { error: "This enquiry no longer exists.", success: "" };
  return { error: "", success: "Status saved." };
}
