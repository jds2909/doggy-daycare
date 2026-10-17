"use client";

import { useActionState } from "react";
import { enquiryStatuses } from "@/lib/admin/enquiry-schema";
import { changeStatus } from "./actions";

export function StatusForm({ enquiryId, status }: { enquiryId: string; status: string }) {
  const [state, action, pending] = useActionState(changeStatus, { error: "", success: "" });
  return (
    <form action={action} className="my-6 space-y-3 border border-slate-300 p-5">
      <input type="hidden" name="enquiryId" value={enquiryId} />
      <label htmlFor="enquiry-status" className="block font-semibold">Enquiry status</label>
      <div className="flex flex-wrap gap-3">
        <select key={status} id="enquiry-status" name="status" defaultValue={status} disabled={pending} className="border border-slate-400 bg-white p-3">
          {enquiryStatuses.map((value) => <option key={value} value={value}>{value.replaceAll("_", " ")}</option>)}
        </select>
        <button disabled={pending} className="bg-blue-900 px-5 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Saving…" : "Save status"}</button>
      </div>
      {state.error && <p role="alert" className="text-red-800">{state.error}</p>}
      {state.success && <p role="status" className="text-green-800">{state.success}</p>}
    </form>
  );
}
