"use client";

import { useState, type FormEvent } from "react";

export default function FantasyMealRequest() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/meal-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, phone, description }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send request.");
      if (!data.whatsappUrl) {
        throw new Error("Your request was saved, but WhatsApp could not be opened. Please contact Dfamiliz directly.");
      }
      window.location.href = data.whatsappUrl;
      return;
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to send request. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section id="fantasy-meal" className="bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
            Made just for you
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Dream up your fantasy meal
          </h2>
          <p className="mt-4 leading-7 text-black/55">
            Have a special dish in mind? Tell us what you would love us to
            prepare. Share the details and our team will get back to you.
          </p>
        </div>

        <form
          onSubmit={submitRequest}
          className="rounded-3xl border border-black/5 bg-[#fffaf3] p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">
              Your name
              <input
                required
                maxLength={100}
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 font-normal outline-none focus:border-orange-500"
              />
            </label>
            <label className="text-sm font-bold">
              Phone number
              <input
                required
                maxLength={40}
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 font-normal outline-none focus:border-orange-500"
              />
            </label>
          </div>
          <label className="mt-4 block text-sm font-bold">
            Describe your fantasy meal
            <textarea
              required
              maxLength={2000}
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Tell us the dish, ingredients, spice level, portions, or anything else you have in mind."
              className="mt-2 w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 font-normal outline-none focus:border-orange-500"
            />
          </label>
          {error && (
            <p role="alert" className="mt-4 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isSending}
            className="mt-5 w-full rounded-xl bg-[#171717] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending ? "Saving and opening WhatsApp..." : "Submit & Continue to WhatsApp"}
          </button>
        </form>
      </div>
    </section>
  );
}
