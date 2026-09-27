"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = 1000;
  const grandTotal = cartTotal + deliveryFee;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!address.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const orderId = `FAM-${Date.now()}`;

    localStorage.setItem(
      "famzi-order",
      JSON.stringify({
        orderId,
        customerName,
        phone,
        address,
        note,
        items: cartItems,
        subtotal: cartTotal,
        deliveryFee,
        total: grandTotal,
        createdAt: new Date().toISOString(),
        status: "Received",
      })
    );

    window.location.href = "/order-confirmation";
  };

  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <main className="min-h-screen bg-[#f8f5ef] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="text-6xl">🛒</div>

          <h1 className="mt-6 text-2xl font-black text-[#171717]">
            Your cart is empty
          </h1>

          <p className="mt-3 text-sm leading-6 text-black/50">
            Add some delicious meals before proceeding to checkout.
          </p>

          <Link
            href="/menu"
            className="mt-7 inline-flex rounded-2xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
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

          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#171717] sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-3 text-sm text-black/50">
            Tell us where to deliver your order.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          {/* Customer Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-xl font-black text-[#171717]">
              Customer Details
            </h2>

            <div className="mt-6 space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="customerName"
                  className="mb-2 block text-sm font-bold text-[#171717]"
                >
                  Full Name
                </label>

                <input
                  id="customerName"
                  type="text"
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-bold text-[#171717]"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="08012345678"
                  className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-bold text-[#171717]"
                >
                  Delivery Address
                </label>

                <textarea
                  id="address"
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  placeholder="Enter your complete delivery address"
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              {/* Order Note */}
              <div>
                <label
                  htmlFor="note"
                  className="mb-2 block text-sm font-bold text-[#171717]"
                >
                  Order Note{" "}
                  <span className="font-normal text-black/40">
                    (Optional)
                  </span>
                </label>

                <textarea
                  id="note"
                  value={note}
                  onChange={(event) =>
                    setNote(event.target.value)
                  }
                  placeholder="Any special instruction for your order?"
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 w-full rounded-2xl bg-orange-500 py-4 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? "Processing Order..."
                : `Place Order — ₦${grandTotal.toLocaleString()}`}
            </button>
          </form>

          {/* Order Summary */}
          <aside className="h-fit rounded-3xl bg-[#171717] p-6 text-white shadow-sm sm:p-8 lg:sticky lg:top-24">
            <h2 className="text-xl font-black">
              Order Summary
            </h2>

            <div className="mt-6 space-y-5">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 border-b border-white/10 pb-5"
                >
                  <div>
                    <p className="text-sm font-bold">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      ₦{item.price.toLocaleString()} ×{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-sm font-bold">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-b border-white/10 pb-6 text-sm">
              <div className="flex items-center justify-between text-white/60">
                <span>Subtotal</span>

                <span>
                  ₦{cartTotal.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-white/60">
                <span>Delivery</span>

                <span>
                  ₦{deliveryFee.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="font-bold">
                Total
              </span>

              <span className="text-2xl font-black text-orange-500">
                ₦{grandTotal.toLocaleString()}
              </span>
            </div>

            <Link
              href="/cart"
              className="mt-6 block text-center text-sm font-semibold text-white/50 transition hover:text-white"
            >
              ← Back to Cart
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}