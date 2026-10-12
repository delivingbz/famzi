// FAMZI FILE GUIDE: About page for the FAMZI brand and ordering service.
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About FAMZI | Dfamiliz",
  description: "Learn about FAMZI, Dfamiliz's online meal ordering experience.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fffaf3] text-[#171717]">
      <section className="bg-[#171717] px-4 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">About FAMZI</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
            Good food. Good moments. Made easier.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
            FAMZI is Dfamiliz&apos;s online way to discover meals, place an order, and let us know what you would love us to prepare.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1fr] md:items-center lg:px-8 lg:py-24">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">Food, your way</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">A simple experience built around your meal</h2>
        </div>
        <div className="space-y-5 text-sm leading-7 text-black/60 sm:text-base">
          <p>
            Browse the menu, check current prices, and add your choices to the cart. At checkout, choose delivery or tell us the pickup point that works for you.
          </p>
          <p>
            Quick Meals offer soup in convenient sizes, from a quarter litre to a pot. Looking for something special? Send us your fantasy meal idea and our team can discuss it with you.
          </p>
          <p>
            When you place an order, we save it and open WhatsApp with the order details, so you can coordinate with Dfamiliz and confirm payment.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {[
            { title: "Explore", body: "Find Nigerian favourites, familiar comfort meals, and options across the menu." },
            { title: "Make it yours", body: "Choose a Quick Meal size, add a note to your order, or share a custom meal idea." },
            { title: "Talk to our team", body: "Use WhatsApp to coordinate payment, delivery, pickup, or a special request." },
          ].map((value, index) => (
            <article key={value.title} className="rounded-3xl border border-black/5 bg-[#fffaf3] p-6 sm:p-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-sm font-black text-orange-600">0{index + 1}</span>
              <h3 className="mt-5 text-xl font-black">{value.title}</h3>
              <p className="mt-3 text-sm leading-6 text-black/55">{value.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <h2 className="text-2xl font-black">Ready to find your next meal?</h2>
          <p className="mt-2 text-sm text-black/55">Browse the menu or get in touch with Dfamiliz.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/menu" className="rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600">Explore the menu</Link>
          <Link href="/contact" className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-bold transition hover:bg-black/5">Contact us</Link>
        </div>
      </section>
    </main>
  );
}
