// FAMZI FILE GUIDE: Homepage event section with wedding invitation, admin-managed cakes, and carousel.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { MenuItem } from "@/data/menu";

const cakeIdeas = [
  { name: "The Ivory Classic", detail: "An elegant finish for intimate celebrations", price: "Made to order", tiers: 2 },
  { name: "Rose Gold Luxe", detail: "Soft florals and a little extra sparkle", price: "Made to order", tiers: 3 },
  { name: "Grand Celebration", detail: "A showpiece made for your biggest moments", price: "Made to order", tiers: 4 },
];

function CakeIllustration({ tiers }: { tiers: number }) {
  const cakeTiers = Array.from({ length: tiers }, (_, index) => {
    const width = 116 - index * 19;
    const x = (220 - width) / 2;
    const y = 164 - index * 31;
    return { width, x, y };
  });

  return (
    <svg viewBox="0 0 220 220" role="img" aria-label={`${tiers}-tier celebration cake illustration`} className="h-full w-full">
      <defs>
        <linearGradient id={`icing-${tiers}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fffdf8" />
          <stop offset="1" stopColor="#ead8c3" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="187" rx="91" ry="15" fill="#d9b98c" />
      <path d="M43 185h134l-9 10H52z" fill="#a97749" />
      {cakeTiers.map(({ width, x, y }, index) => (
        <g key={index}>
          <rect x={x} y={y} width={width} height="34" rx="7" fill={`url(#icing-${tiers})`} stroke="#c8a77d" strokeWidth="1.5" />
          <path d={`M${x + 5} ${y + 23}c8-10 15 10 23 0s15 10 23 0 15 10 23 0`} fill="none" stroke="#c79b62" strokeWidth="2" opacity=".9" />
          <circle cx={x + width * .28} cy={y + 10} r="3" fill={index % 2 ? "#bd7d74" : "#d0a362"} />
          <circle cx={x + width * .72} cy={y + 10} r="3" fill={index % 2 ? "#d0a362" : "#bd7d74"} />
        </g>
      ))}
      <path d="M110 25c-9 9-8 17 0 23 8-6 9-14 0-23Z" fill="#d0a362" />
      <path d="M110 44v9" stroke="#a97749" strokeWidth="2" />
      <circle cx="98" cy="79" r="5" fill="#c98680" />
      <circle cx="105" cy="74" r="5" fill="#d7a09a" />
      <circle cx="112" cy="79" r="5" fill="#be716c" />
      <circle cx="105" cy="82" r="4" fill="#e8b8ad" />
    </svg>
  );
}

function WeddingInvitation() {
  return (
    <div className="relative mx-auto flex aspect-[4/3] w-full max-w-[310px] items-center justify-center rounded-[2rem] bg-[#f2dfce] p-5 shadow-inner sm:p-7">
      <div className="absolute left-5 top-5 h-12 w-12 rounded-full bg-[#b87a69]/15 sm:left-7 sm:top-7" />
      <div className="absolute bottom-5 right-5 h-20 w-20 rounded-full border border-[#bd9b69]/30 sm:bottom-7 sm:right-7" />
      <div className="relative w-full rotate-[-3deg] rounded-md bg-[#fffdf8] px-5 py-6 text-center shadow-[0_18px_35px_rgba(62,37,28,0.18)] sm:px-8 sm:py-8">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#bd9b69] font-serif text-sm text-[#9e7551]">F</div>
        <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#9b7654] sm:text-[10px]">Together with their families</p>
        <p className="mt-3 font-serif text-xl italic text-[#553d36] sm:text-2xl">A celebration of love</p>
        <div className="mx-auto my-3 h-px w-12 bg-[#c6a674]" />
        <p className="font-serif text-xs tracking-[0.16em] text-[#76594b]">A DAY TO REMEMBER</p>
        <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-[#9b7654]">Good food · beautiful moments</p>
        <svg viewBox="0 0 40 40" aria-hidden="true" className="absolute -right-3 -top-4 h-9 w-9 rotate-12 drop-shadow-md">
          <path d="M20 37S5 23 5 14a15 15 0 1 1 30 0c0 9-15 23-15 23Z" fill="#8e3d37" />
          <circle cx="20" cy="14" r="5" fill="#fff7ed" />
        </svg>
      </div>
      <span className="absolute bottom-3 left-4 rounded-full bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#76594b] shadow-sm sm:bottom-4 sm:left-6">Your day, beautifully catered</span>
    </div>
  );
}

export default function EventCakesShowcase() {
  const [cakes, setCakes] = useState<MenuItem[]>([]);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCakes() {
      try {
        const response = await fetch("/api/menu", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) return;
        if (isMounted) {
          setCakes(
            data.menuItems.filter(
              (item: MenuItem) => item.category === "Event Cakes" && item.available !== false,
            ),
          );
        }
      } catch {
        // Keep the illustrated inspiration slides available if the menu cannot load.
      }
    }

    void loadCakes();
    const interval = window.setInterval(() => void loadCakes(), 15000);
    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const totalSlides = cakes.length === 1 ? cakeIdeas.length + 1 : cakes.length || cakeIdeas.length;
  const currentCake = cakes.length === 1
    ? index === 0 ? cakes[0] : null
    : cakes.length ? cakes[index % cakes.length] : null;
  const ideaIndex = cakes.length === 1
    ? Math.max(0, index - 1) % cakeIdeas.length
    : index % cakeIdeas.length;
  const idea = cakeIdeas[ideaIndex];

  useEffect(() => {
    if (totalSlides < 2 || isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const autoplay = window.setInterval(() => {
      setIndex((current) => (current + 1) % totalSlides);
    }, 4800);

    return () => window.clearInterval(autoplay);
  }, [isPaused, totalSlides]);

  function moveSlide(direction: number) {
    setIndex((current) => (current + direction + totalSlides) % totalSlides);
  }

  return (
    <section className="bg-[#fffaf3] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-7">
          <article className="event-sensation-panel relative isolate overflow-hidden rounded-[2rem] bg-[#342321] p-6 text-white shadow-xl sm:p-9">
            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div className="event-sensation-invitation">
                <WeddingInvitation />
              </div>
              <div className="event-sensation-copy">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e7c99a]">Weddings · Gatherings · Good food</p>
                <h2 className="mt-4 max-w-md text-3xl font-black leading-tight sm:text-4xl">Make your special day a sensation.</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/70">Beautifully prepared food and thoughtful cake designs for the moments you want to remember.</p>
              </div>
            </div>
          </article>

          <article
            className="flex min-w-0 flex-col rounded-[2rem] border border-[#e8ddcd] bg-white p-5 shadow-sm sm:p-7"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={(event) => {
              if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
                setIsPaused(false);
              }
            }}
          >
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">Made for your moment</p>
                <h2 className="mt-2 text-2xl font-black sm:text-3xl">Luxury event cakes</h2>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => moveSlide(-1)} aria-label="Previous cake" className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg transition hover:bg-orange-50">‹</button>
                <button type="button" onClick={() => moveSlide(1)} aria-label="Next cake" className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg transition hover:bg-orange-50">›</button>
              </div>
            </div>

            <div key={currentCake?.id ?? `idea-${ideaIndex}`} className="event-cake-slide mt-5 grid flex-1 gap-4 sm:grid-cols-[1.1fr_0.9fr] sm:items-center">
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-[#fbf2e7] via-[#fffaf3] to-[#ead7c3] p-3">
                <CakeIllustration tiers={currentCake ? Math.min(4, Math.max(1, (index % 3) + 2)) : idea.tiers} />
                {currentCake?.image && (
                  <img src={currentCake.image} alt={currentCake.name} onError={(event) => { event.currentTarget.style.display = "none"; }} className="absolute inset-0 h-full w-full object-cover" />
                )}
                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#71533e]">{currentCake ? "Custom design" : "Cake inspiration"}</span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b38b59]">{currentCake ? "Event cake" : `Design ${ideaIndex + 1} of ${cakeIdeas.length}`}</p>
                <h3 className="mt-2 text-xl font-black leading-tight">{currentCake?.name ?? idea.name}</h3>
                <p className="mt-2 text-sm leading-6 text-black/55">{currentCake?.description ?? idea.detail}</p>
                {currentCake && <p className="mt-3 text-lg font-black text-orange-600">₦{currentCake.price.toLocaleString()}</p>}
                <Link href="/contact" className="mt-5 inline-flex w-fit rounded-full bg-[#402c2a] px-5 py-3 text-xs font-bold text-white transition hover:bg-orange-600">Ask about this design</Link>
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-2" role="group" aria-label={`Slide ${index + 1} of ${totalSlides}`}>
              {Array.from({ length: totalSlides }, (_, slide) => (
                <button key={slide} type="button" onClick={() => setIndex(slide)} aria-label={`Show cake ${slide + 1}`} aria-current={slide === index ? "true" : undefined} className={`h-2 rounded-full transition-all ${slide === index ? "w-7 bg-orange-500" : "w-2 bg-black/15 hover:bg-black/30"}`} />
              ))}
            </div>
          </article>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-[2rem] bg-[#e9b96e] px-6 py-7 sm:flex-row sm:items-center sm:px-10 sm:py-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#553d27]">Your celebration, your design</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#2b2119] sm:text-3xl">ORDER FOR YOUR EVENT CAKES</h2>
          </div>
          <Link href="/contact" className="inline-flex rounded-full bg-[#402c2a] px-7 py-4 text-sm font-black uppercase tracking-wide text-white shadow-lg transition hover:bg-[#241817]">Plan your cake</Link>
        </div>
      </div>
    </section>
  );
}
