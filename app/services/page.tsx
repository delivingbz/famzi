import type { Metadata } from "next";
import HomeScrollReveal from "@/components/HomeScrollReveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Services | FAMZI by Dfamiliz",
  description: "Explore Dfamiliz services: cakes, small chops, pastries, catering, event management, and private chef bookings.",
};

const services = [
  {
    id: "cakes",
    number: "01",
    title: "Cakes",
    subtitle: "A centrepiece worth gathering around.",
    description: "Order a cake for birthdays, anniversaries, celebrations, or a simple sweet moment. Tell us the occasion, preferred flavour, size, design, and date, and we’ll discuss the options with you.",
    details: ["Celebration and occasion cakes", "Flavour and size discussed to suit your event", "Share design inspiration when you enquire"],
    prompt: "Hi Dfamiliz, I would like to enquire about ordering a cake.",
  },
  {
    id: "small-chops",
    number: "02",
    title: "Small chops",
    subtitle: "Easy-to-enjoy bites for your guests.",
    description: "Add a crowd-pleasing selection of small chops to your gathering. Let us know your event date, guest count, preferred selection, and serving time so we can plan your order together.",
    details: ["Suitable for parties, meetings, and celebrations", "Portions planned around your guest count", "Confirm the selection and timing with our team"],
    prompt: "Hi Dfamiliz, I would like to enquire about small chops for an event.",
  },
  {
    id: "pastries",
    number: "03",
    title: "Pastries",
    subtitle: "Fresh treats for sharing or keeping close.",
    description: "Ask us about pastries for your home, office, celebration, or gathering. Share what you have in mind, how many people you are serving, and when you need your order.",
    details: ["Pastry orders for everyday moments and events", "Quantity planned for your needs", "Ask about available choices when you message"],
    prompt: "Hi Dfamiliz, I would like to ask about your pastries.",
  },
  {
    id: "catering",
    number: "04",
    title: "Catering",
    subtitle: "A thoughtful menu for your gathering.",
    description: "Planning a celebration, family occasion, meeting, or work event? We can discuss a food plan based on your date, venue, guest count, preferences, and budget.",
    details: ["Food planning for private and business events", "Menu and portions discussed for your guest list", "Delivery, setup, and timing confirmed during enquiry"],
    prompt: "Hi Dfamiliz, I would like to discuss catering for an event.",
  },
  {
    id: "event-management",
    number: "05",
    title: "Event Management",
    subtitle: "Help bringing the details together.",
    description: "Tell us about the event you are planning and the kind of support you need. We will talk through your vision, date, guest count, venue, priorities, and the services to coordinate.",
    details: ["Planning support shaped around your occasion", "Coordination needs discussed with you", "Scope and arrangements agreed before booking"],
    prompt: "Hi Dfamiliz, I would like to enquire about event management.",
  },
  {
    id: "private-chef",
    number: "06",
    title: "Need a chef?",
    subtitle: "Talk to us about a chef for your occasion.",
    description: "If you need a chef for a private gathering or special occasion, message us with the date, location, number of guests, meal preferences, and the kind of service you are looking for.",
    details: ["Chef enquiries for private occasions", "Menu and service expectations discussed in advance", "Availability and arrangements confirmed by our team"],
    prompt: "Hi Dfamiliz, I need a chef for an occasion and would like to discuss availability.",
  },
];

export default function ServicesPage() {
  const whatsappNumber = process.env.WHATSAPP_BUSINESS_NUMBER?.replace(/\D/g, "");

  return (
    <main className="min-h-screen bg-[#fffaf3] text-[#171717]">
      <section className="bg-[#171717] px-4 py-20 text-white sm:py-28">
        <HomeScrollReveal variant="scale">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">Dfamiliz services</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Good food and thoughtful help for your occasion.</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
            From cakes and small chops to catering, event support, and chef enquiries, tell us what you are planning and we can discuss the details with you.
          </p>
          <a href="#our-services" className="mt-8 inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600">Explore our services</a>
        </div>
        </HomeScrollReveal>
      </section>

      <section id="our-services" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <HomeScrollReveal variant="left">
        <div className="mb-9 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">How we can help</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Services for the moments you bring people together</h2>
          <p className="mt-4 text-sm leading-7 text-black/55 sm:text-base">Every occasion is different. Contact us with your date, location, guest count, and what you have in mind; we’ll follow up to discuss availability and arrangements.</p>
        </div>
        </HomeScrollReveal>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const whatsappUrl = whatsappNumber
              ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(service.prompt)}`
              : null;

            return (
              <HomeScrollReveal key={service.id} variant={(["up", "scale", "right", "left", "soft", "up"] as const)[index]}>
              <article id={service.id} className="scroll-mt-28 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-sm font-black text-orange-600">{service.number}</span>
                <h3 className="mt-5 text-2xl font-black">{service.title}</h3>
                <p className="mt-1 text-sm font-bold text-orange-600">{service.subtitle}</p>
                <p className="mt-4 text-sm leading-7 text-black/60">{service.description}</p>
                <ul className="mt-5 space-y-2 text-sm leading-6 text-black/55">
                  {service.details.map((detail) => <li key={detail} className="flex gap-2"><span className="font-black text-orange-500">•</span><span>{detail}</span></li>)}
                </ul>
                {whatsappUrl ? (
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex rounded-full bg-[#171717] px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600">Enquire on WhatsApp</a>
                ) : (
                  <p className="mt-7 text-sm font-semibold text-orange-700">WhatsApp enquiries are temporarily unavailable.</p>
                )}
              </article>
              </HomeScrollReveal>
            );
          })}
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <HomeScrollReveal variant="soft">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-3xl bg-[#fff4e6] p-7 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">Let’s plan it together</p>
            <h2 className="mt-2 text-2xl font-black">Have a date or idea in mind?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">Send us the details and our team will talk through availability, options, and next steps with you.</p>
          </div>
          {whatsappNumber ? (
            <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Dfamiliz, I would like to enquire about your services.")}`} target="_blank" rel="noreferrer" className="inline-flex shrink-0 justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600">Contact us on WhatsApp</a>
          ) : (
            <a href="/contact" className="inline-flex shrink-0 justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600">Contact us</a>
          )}
        </div>
        </HomeScrollReveal>
      </section>
    </main>
  );
}
