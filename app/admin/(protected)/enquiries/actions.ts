"use server";

import { revalidatePath } from "next/cache";
import { updateEnquiryStatus } from "@/lib/admin/enquiries";
import type { AdminActionState } from "@/lib/admin/enquiry-schema";

export async function changeStatus(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  // The data operation independently authenticates and validates before obtaining the service client.
  const result = await updateEnquiryStatus({
    enquiryId: formData.get("enquiryId"),
    status: formData.get("status"),
  });
  if (result.success) {
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin/enquiries/[id]", "page");
  }
  return result;
}
