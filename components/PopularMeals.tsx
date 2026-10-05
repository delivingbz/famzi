"use client";

import { useEffect, useState } from "react";
import FoodCard from "@/components/FoodCard";
import type { MenuItem } from "@/data/menu";

export default function PopularMeals() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/menu", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to load popular meals.");
        }
        if (isMounted) {
          setItems(data.menuItems.filter((item: MenuItem) => item.popular));
          setIsLoading(false);
        }
      })
      .catch((loadError: unknown) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load popular meals.",
          );
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="mt-8 rounded-3xl bg-[#f8f5ef] p-8 text-center text-sm text-black/45">
        Loading popular meals...
      </div>
    );
  }

  if (error || items.length === 0) {
    return error ? (
      <p className="mt-8 text-sm text-black/45">{error}</p>
    ) : (
      <p className="mt-8 text-sm text-black/45">
        Popular meals will appear here when available.
      </p>
    );
  }

  return (
    <div
      className="popular-meals-carousel mt-8 overflow-hidden"
      role="region"
      aria-label="Popular meals carousel"
    >
      <div
        className="popular-meals-track flex w-max"
        style={{ animationDuration: `${Math.max(items.length * 6, 30)}s` }}
      >
        <div className="popular-meals-group flex shrink-0 gap-5 pr-5">
          {items.map((item) => (
            <div key={item.id} className="w-[min(82vw,300px)] shrink-0 sm:w-[300px]">
              <FoodCard item={item} />
            </div>
          ))}
        </div>

        <div
          className="popular-meals-group flex shrink-0 gap-5 pr-5"
          aria-hidden="true"
          inert
        >
          {items.map((item) => (
            <div key={`duplicate-${item.id}`} className="w-[min(82vw,300px)] shrink-0 sm:w-[300px]">
              <FoodCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
