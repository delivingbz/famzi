import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact FAMZI | Dfamiliz",
  description: "Contact the Dfamiliz team about an order, pickup, delivery, or a custom meal.",
};

export default function ContactPage() {
  const whatsappNumber = process.env.WHATSAPP_BUSINESS_NUMBER?.replace(/\D/g, "");
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Dfamiliz, I would like to make an enquiry.")}`
    : null;

  return (
    <main className="min-h-screen bg-[#fffaf3] text-[#171717]">
      <section className="bg-[#171717] px-4 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">Contact Dfamiliz</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">We&apos;re here to help with your next meal.</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
            Ask us about the menu, an order, pickup or delivery, or a meal you would like us to prepare.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">Talk to our team</p>
          <h2 className="mt-3 text-2xl font-black">WhatsApp is our quickest contact channel</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-black/55">
            Send us a message about your question. For an existing order, include your order reference so we can help faster. For a custom meal, tell us what you have in mind.
          </p>
          {whatsappUrl ? (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#1fb85a]">
                Message us on WhatsApp
              </a>
              <a href={`tel:+${whatsappNumber}`} className="text-sm font-bold text-black/65 hover:text-orange-600">
                +{whatsappNumber}
              </a>
            </div>
          ) : (
            <p className="mt-6 rounded-xl bg-orange-50 p-4 text-sm font-semibold text-orange-800">
              WhatsApp contact is temporarily unavailable. Please try again later.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <article className="rounded-3xl border border-black/5 bg-white p-6">
            <h3 className="font-black">Order and payment</h3>
            <p className="mt-2 text-sm leading-6 text-black/55">Place an order through checkout, then continue in WhatsApp to coordinate and confirm payment.</p>
            <Link href="/menu" className="mt-4 inline-flex text-sm font-bold text-orange-600 hover:text-orange-700">Browse the menu →</Link>
          </article>
          <article className="rounded-3xl border border-black/5 bg-white p-6">
            <h3 className="font-black">Pickup and delivery</h3>
            <p className="mt-2 text-sm leading-6 text-black/55">Enter your delivery address or preferred pickup point at checkout. Our team can coordinate the details with you.</p>
          </article>
          <article className="rounded-3xl border border-black/5 bg-white p-6">
            <h3 className="font-black">A meal idea of your own?</h3>
            <p className="mt-2 text-sm leading-6 text-black/55">Share the dish, ingredients, portion size, or any other details through the Fantasy Meal form.</p>
            <Link href="/#fantasy-meal" className="mt-4 inline-flex text-sm font-bold text-orange-600 hover:text-orange-700">Share your meal idea →</Link>
          </article>
        </div>
      </section>
    </main>
  );
}
