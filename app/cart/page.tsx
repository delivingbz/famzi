"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8f5ef] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
          <div className="text-6xl">🛒</div>

          <h1 className="mt-6 text-3xl font-black text-[#171717]">
            Your cart is empty
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-black/50">
            Looks like you haven&apos;t added anything to your order yet.
            Explore our menu and find something delicious.
          </p>

          <Link
            href="/menu"
            className="mt-8 rounded-2xl bg-orange-500 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Browse Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef]">
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            FAMZI — by Dfamiliz
          </p>

          <h1 className="mt-3 text-4xl font-black text-[#171717]">
            Your Cart
          </h1>

          <p className="mt-3 text-sm text-black/50">
            Review your order before checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Cart items */}
          <div className="space-y-4">
            {cartItems.map((item) => {
              const itemTotal = item.price * item.quantity;

              return (
                <article
                  key={item.id}
                  className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="flex gap-4">
                    {/* Temporary image area */}
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-4xl sm:h-28 sm:w-28">
                      🍽️
                    </div>

                    {/* Item information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-base font-black text-[#171717] sm:text-lg">
                            {item.name}
                          </h2>

                          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-black/35">
                            {item.category}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs font-bold text-red-500 transition hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-4">
                        {/* Quantity */}
                        <div className="flex items-center rounded-xl border border-black/10">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="flex h-9 w-9 items-center justify-center text-lg font-bold transition hover:bg-black/5"
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            −
                          </button>

                          <span className="w-9 text-center text-sm font-bold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="flex h-9 w-9 items-center justify-center text-lg font-bold transition hover:bg-black/5"
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-sm font-black text-orange-500 sm:text-base">
                          ₦{itemTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Order summary */}
          <aside className="h-fit rounded-3xl bg-[#171717] p-6 text-white lg:sticky lg:top-24">
            <h2 className="text-xl font-black">Order Summary</h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between text-white/60">
                <span>Items</span>
                <span>
                  {cartItems.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-white/60">
                <span>Subtotal</span>
                <span>₦{cartTotal.toLocaleString()}</span>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Total</span>

                  <span className="text-xl font-black text-orange-400">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Link
                  href="/checkout"
                   className="mt-6 block w-full rounded-2xl bg-orange-500 py-4 text-center text-sm font-black text-white transition hover:bg-orange-600"
            >
                    Proceed to Checkout
            </Link>
            

            <Link
              href="/menu"
              className="mt-3 block w-full rounded-2xl border border-white/15 py-4 text-center text-sm font-bold text-white/80 transition hover:bg-white/5 hover:text-white"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}