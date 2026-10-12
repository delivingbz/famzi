// FAMZI FILE GUIDE: Loads the quick-meal size options and adds a selected option to the cart.
"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { MenuItem } from "@/data/menu";

const quickMealSizes = [
  { name: "Soup - Quarter Liter", label: "¼ Liter", icon: "bowl", fill: 0.28 },
  { name: "Soup - Half Liter", label: "½ Liter", icon: "bowl", fill: 0.52 },
  { name: "Soup - 1 Liter", label: "1 Liter", icon: "bowl", fill: 0.86 },
  { name: "Soup - 1 Pot", label: "1 Pot", icon: "pot", fill: 1 },
] as const;

function PortionIcon({ fill, pot }: { fill: number; pot: boolean }) {
  if (pot) {
    return (
      <svg viewBox="0 0 120 100" aria-hidden="true" className="h-24 w-28">
        <path d="M27 33h66l-5 49H32l-5-49Z" fill="#fff7ed" stroke="#9a3412" strokeWidth="4" />
        <path d="M31 48h58l-3 31H34l-3-31Z" fill="#f97316" />
        <path d="M22 43h-9v25h14m80-25h-9m9 0h-9v25h14M42 24h36m-18-9v9" fill="none" stroke="#9a3412" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M38 53c8-5 14 5 22 0s14 5 22 0" fill="none" stroke="#ffedd5" strokeWidth="3" />
      </svg>
    );
  }

  const soupTop = 72 - fill * 36;
  return (
    <svg viewBox="0 0 120 100" aria-hidden="true" className="h-24 w-28">
      <defs>
        <clipPath id={`bowl-fill-${fill}`}>
          <path d="M21 40h78c-3 31-18 47-39 47S24 71 21 40Z" />
        </clipPath>
      </defs>
      <path d="M21 40h78c-3 31-18 47-39 47S24 71 21 40Z" fill="#fff7ed" stroke="#9a3412" strokeWidth="4" />
      <path
        d={`M22 ${soupTop}h76c-3 31-18 47-38 47S25 ${soupTop + 31} 22 ${soupTop}Z`}
        fill="#f97316"
        clipPath={`url(#bowl-fill-${fill})`}
      />
      <path d="M18 39h84" stroke="#9a3412" strokeWidth="5" strokeLinecap="round" />
      <path d="M38 51c6-4 11 4 17 0s11 4 17 0 11 4 17 0" fill="none" stroke="#ffedd5" strokeWidth="3" />
    </svg>
  );
}

export default function QuickMeals() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;

    async function loadQuickMeals() {
      try {
        const response = await fetch("/api/menu", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to load quick meals.");
        }
        if (isMounted) {
          setItems(
            quickMealSizes.flatMap((size) => {
              const item = data.menuItems.find(
                (menuItem: MenuItem) =>
                  menuItem.category
                    .trim()
                    .replace(/\s+/g, " ")
                    .toLocaleLowerCase() === "quick meals" &&
                  menuItem.name.trim().toLocaleLowerCase() ===
                    size.name.toLocaleLowerCase(),
              );
              return item ? [item] : [];
            }),
          );
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load quick meals.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadQuickMeals();
    const refreshInterval = window.setInterval(() => void loadQuickMeals(), 15000);
    return () => {
      isMounted = false;
      window.clearInterval(refreshInterval);
    };
  }, []);

  return (
    <section id="quick-meals" className="bg-orange-50/70 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
          Ready to serve
        </p>
        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Quick Meals
            </h2>
            <p className="mt-3 max-w-2xl text-black/55">
              Order your favourite soup in exactly the amount you need. Choose
              a quarter liter, half liter, one liter, or a pot.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Quick Meal sizes">
              {["¼ Liter", "½ Liter", "1 Liter", "Pot"].map((size) => (
                <li
                  key={size}
                  className="rounded-full bg-white px-4 py-2 text-xs font-bold text-orange-700 shadow-sm"
                >
                  {size}
                </li>
              ))}
            </ul>
          </div>
          <a
            href="/menu?category=Quick%20Meals"
            className="text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            View Quick Meals →
          </a>
        </div>

        {isLoading ? (
          <p className="mt-8 rounded-3xl bg-white p-8 text-center text-sm font-semibold text-black/50">
            Loading Quick Meals...
          </p>
        ) : error ? (
          <p role="alert" className="mt-8 rounded-3xl bg-white p-8 text-sm font-semibold text-red-600">
            {error}
          </p>
        ) : items.length ? (
          <div className="mt-8 flex flex-wrap justify-center gap-5">
            {quickMealSizes.map((size) => {
              const item = items.find(
                (menuItem) =>
                  menuItem.name.trim().toLocaleLowerCase() ===
                  size.name.toLocaleLowerCase(),
              );
              if (!item) return null;

              return (
                <article
                  key={item.id}
                  className="w-full max-w-[250px] rounded-3xl border border-orange-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-2xl bg-orange-50">
                    <PortionIcon fill={size.fill} pot={size.icon === "pot"} />
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <h3 className="mt-3 text-lg font-black text-[#171717]">
                    {size.label}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-black/45">
                    {size.icon === "pot" ? "Family pot" : "Fresh soup"}
                  </p>
                  {item.available === false && (
                    <p className="mt-2 text-xs font-bold uppercase tracking-wide text-red-600">
                      Unavailable
                    </p>
                  )}
                  <p className="mt-4 text-2xl font-black text-orange-600">
                    ₦{item.price.toLocaleString()}
                  </p>
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    disabled={item.available === false}
                    className="mt-4 w-full rounded-xl bg-[#171717] px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-black/25 disabled:hover:bg-black/25"
                  >
                    {item.available === false ? "Unavailable" : "Add to Cart"}
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-orange-100 bg-white p-8 text-center">
            <p className="font-bold text-[#171717]">
              Quick Meal sizes are being prepared.
            </p>
            <p className="mt-2 text-sm text-black/55">
              Check back soon for soups and other meals priced by liter or pot.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
