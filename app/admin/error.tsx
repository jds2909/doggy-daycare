"use client";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div role="alert">
      <h1 className="text-2xl font-bold">Admin is temporarily unavailable</h1>
      <p className="mt-3">Please try again. If this continues, check the server configuration and Supabase connection.</p>
      <button onClick={reset} className="mt-5 border border-slate-400 px-4 py-2">Try again</button>
    </div>
  );
}
