
"use client";
import type { MenuItem } from "@/data/menu";
import { useCart } from "@/components/CartProvider";

type FoodCardProps = {
  item: MenuItem;
};

export default function FoodCard({ item }: FoodCardProps) {
  const { addToCart } = useCart();
  return (
    <article className="group overflow-hidden rounded-3xl border border-black/5 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-orange-50">
        <div className="flex h-full items-center justify-center text-6xl">
          🍽️
        </div>

        {item.popular && (
          <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
            Popular
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold">
              {item.name}
            </h3>

            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-black/35">
              {item.category}
            </p>
          </div>

          <span className="whitespace-nowrap text-sm font-black text-orange-500">
            ₦{item.price.toLocaleString()}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-black/50">
          {item.description}
        </p>

       
        <button
              onClick={() => addToCart(item)}
              className="mt-5 w-full rounded-2xl bg-[#171717] py-3 text-sm font-bold text-white transition hover:bg-orange-500"
        >
            Add to Cart
      </button>
      </div>
    </article>
  );
}