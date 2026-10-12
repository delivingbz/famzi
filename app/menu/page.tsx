// FAMZI FILE GUIDE: Customer menu browser with search, category filters, and refresh.
"use client";

import { useEffect, useMemo, useState } from "react";
import FoodCard from "@/components/FoodCard";
import type { MenuItem } from "@/data/menu";
import { normalizeMenuCategory } from "@/data/menu-categories";

function categoryKey(category: string) {
  return normalizeMenuCategory(category).toLocaleLowerCase();
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    let hasInitializedCategory = false;

    async function loadMenu() {
      try {
        const response = await fetch("/api/menu", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to load menu.");
        }
        if (isMounted) {
          setMenuItems(data.menuItems);
          setError("");
          if (!hasInitializedCategory) {
            const requestedCategory = new URLSearchParams(
              window.location.search,
            ).get("category");
            const matchingItem = requestedCategory
              ? data.menuItems.find(
                  (item: MenuItem) =>
                    categoryKey(item.category) === categoryKey(requestedCategory),
                )
              : undefined;
            setActiveCategory(
              matchingItem?.category.trim().replace(/\s+/g, " ") ?? "All",
            );
            hasInitializedCategory = true;
          }
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load menu.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadMenu();
    const refreshInterval = window.setInterval(() => {
      void loadMenu();
    }, 15000);

    return () => {
      isMounted = false;
      window.clearInterval(refreshInterval);
    };
  }, []);

  const categories = [
    "All",
    ...Array.from(
      menuItems.reduce((uniqueCategories, item) => {
        const label = item.category.trim().replace(/\s+/g, " ");
        const key = categoryKey(label);
        if (label && !uniqueCategories.has(key)) {
          uniqueCategories.set(key, label);
        }
        return uniqueCategories;
      }, new Map<string, string>()).values(),
    ),
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" ||
        categoryKey(item.category) === categoryKey(activeCategory);

      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <main className="min-h-screen bg-[#f8f5ef]">
      {/* Header */}
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            FAMZI — by Dfamiliz
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#171717] sm:text-5xl">
            Our Menu
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/55 sm:text-base">
            Explore freshly prepared meals, sandwiches, drinks and treats
            from Dfamiliz.
          </p>
        </div>
      </section>

      {/* Menu controls */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="max-w-xl">
          <label
            htmlFor="menu-search"
            className="mb-2 block text-sm font-bold text-[#171717]"
          >
            Search menu
          </label>

          <input
            id="menu-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search for jollof rice, shawarma..."
            className="w-full rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
          />
        </div>

        {/* Categories */}
        <div className="mt-6 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                    isActive
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "bg-white text-black/60 hover:bg-orange-50 hover:text-orange-500"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black text-[#171717]">
              {activeCategory === "All" ? "All Meals" : activeCategory}
            </h2>

            <span className="text-sm font-medium text-black/40">
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "item" : "items"}
            </span>
          </div>

          {isLoading ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <p className="text-sm font-semibold text-black/50">
                Loading menu...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {filteredItems.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-black/5 bg-white px-6 py-16 text-center">
              <div className="text-5xl">🍽️</div>

              <h3 className="mt-4 text-xl font-black text-[#171717]">
                No meals found
              </h3>

              <p className="mt-2 text-sm text-black/50">
                Try another search term or select a different category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="mt-6 rounded-2xl bg-[#171717] px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
