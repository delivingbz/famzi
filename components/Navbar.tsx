// FAMZI FILE GUIDE: Shared customer navigation and responsive menu controls.
"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#171717] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 font-black text-white">
            F
          </div>

          <div className="leading-tight">
            <p className="text-lg font-black tracking-tight">
              FAMZI
            </p>

            <p className="text-[10px] font-medium text-white/50">
              by Dfamiliz
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/menu"
            className="rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Menu
          </Link>

          <Link
            href="/about"
            className="rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            About
          </Link>

          <div className="group relative">
            <Link href="/services" className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400">
              Services <span aria-hidden="true" className="text-xs transition group-hover:rotate-180 group-focus-within:rotate-180">⌄</span>
            </Link>
            <div className="invisible absolute left-0 top-full z-50 w-60 translate-y-2 pt-2 opacity-0 transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
             <div className="rounded-2xl border border-white/10 bg-[#222] p-2 shadow-2xl">
              <Link href="/services" className="block rounded-xl px-3 py-2 text-sm font-bold text-orange-400 transition hover:bg-white/10">All services</Link>
              {[
                ["Cakes", "cakes"],
                ["Small chops", "small-chops"],
                ["Pastries", "pastries"],
                ["Catering", "catering"],
                ["Event Management", "event-management"],
                ["Need a chef?", "private-chef"],
              ].map(([label, id]) => (
                <Link key={id} href={`/services#${id}`} className="block rounded-xl px-3 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white">{label}</Link>
              ))}
             </div>
            </div>
          </div>

          <Link
            href="/contact"
            className="rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Contact Us
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative ml-2 flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-bold transition hover:bg-white/10"
          >
            <span className="text-lg">🛒</span>

            <span>Cart</span>

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/menu"
            className="ml-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Order Now
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Cart */}
          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-lg transition hover:bg-white/10"
          >
            🛒

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-xl transition hover:bg-white/10"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#171717] px-4 pb-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 pt-4">
            <Link
              href="/menu"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Menu
            </Link>

            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              About
            </Link>

            <details className="group rounded-2xl px-4 py-3 text-sm font-semibold text-white/70">
              <summary className="flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
                Services <span aria-hidden="true" className="text-xs transition group-open:rotate-180">⌄</span>
              </summary>
              <div className="mt-3 flex flex-col gap-1 border-l border-white/15 pl-3">
                <Link href="/services" onClick={() => setIsMenuOpen(false)} className="rounded-lg py-2 font-bold text-orange-400">All services</Link>
                {[
                  ["Cakes", "cakes"],
                  ["Small chops", "small-chops"],
                  ["Pastries", "pastries"],
                  ["Catering", "catering"],
                  ["Event Management", "event-management"],
                  ["Need a chef?", "private-chef"],
                ].map(([label, id]) => (
                  <Link key={id} href={`/services#${id}`} onClick={() => setIsMenuOpen(false)} className="rounded-lg py-2 text-white/70 transition hover:text-white">{label}</Link>
                ))}
              </div>
            </details>

            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Contact Us
            </Link>

            <Link
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <span>Cart</span>

              {cartCount > 0 && (
                <span className="rounded-full bg-orange-500 px-2 py-1 text-[10px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/menu"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 rounded-2xl bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Order Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
