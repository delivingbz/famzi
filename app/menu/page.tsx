"use client";

import { useMemo, useState } from "react";
import FoodCard from "@/components/FoodCard";
import { menuItems } from "@/data/menu";

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(menuItems.map((item) => item.category))),
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;

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

          {filteredItems.length > 0 ? (
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