// FAMZI FILE GUIDE: Admin inbox for viewing and updating customer meal requests.
"use client";

import { useCallback, useEffect, useState } from "react";

type MealRequest = {
  id: number;
  customerName: string;
  phone: string;
  description: string;
  status: "Received" | "Preparing" | "Completed";
  createdAt: string;
};

const statuses: MealRequest["status"][] = ["Received", "Preparing", "Completed"];

export default function AdminMealRequestsPage() {
  const [requests, setRequests] = useState<MealRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
    try {
      const response = await fetch("/api/meal-requests", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load requests.");
      setRequests(data.mealRequests);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load requests.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
    const interval = setInterval(() => void loadRequests(), 15000);
    return () => clearInterval(interval);
  }, [loadRequests]);

  async function updateStatus(id: number, status: MealRequest["status"]) {
    setError("");
    try {
      const response = await fetch("/api/meal-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update request.");
      setRequests((current) =>
        current.map((request) =>
          request.id === id ? data.mealRequest : request,
        ),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update request.",
      );
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
            FAMZI Admin
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Fantasy Meal Requests</h1>
          <p className="mt-2 text-sm text-black/50">
            Customer meal ideas refresh automatically every 15 seconds.
          </p>
        </div>

        {error && (
          <p role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="rounded-3xl bg-white p-10 text-center text-sm font-semibold text-black/50">
            Loading meal requests...
          </div>
        ) : requests.length ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <article key={request.id} className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="text-lg font-black">{request.customerName}</h2>
                    <a
                      href={`tel:${request.phone}`}
                      className="mt-1 inline-block text-sm font-semibold text-orange-600 hover:underline"
                    >
                      {request.phone}
                    </a>
                    <p className="mt-1 text-xs text-black/40">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <label className="text-xs font-bold uppercase tracking-wide text-black/45">
                    Status
                    <select
                      value={request.status}
                      onChange={(event) =>
                        void updateStatus(
                          request.id,
                          event.target.value as MealRequest["status"],
                        )
                      }
                      className="mt-2 block rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-bold text-[#171717]"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <p className="mt-5 whitespace-pre-wrap rounded-2xl bg-[#fffaf3] p-4 text-sm leading-6 text-black/70">
                  {request.description}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-black">No meal requests yet</h2>
            <p className="mt-2 text-sm text-black/50">
              Customer ideas will appear here when they submit the home page form.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
