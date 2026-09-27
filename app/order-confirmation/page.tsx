"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CartItem } from "@/components/CartProvider";
import { useCart } from "@/components/CartProvider";

type OrderData = {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  note: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  status: string;
};

export default function OrderConfirmationPage() {
  const { clearCart } = useCart();

  const [order, setOrder] = useState<OrderData | null>(null);
  const hasClearedCart = useRef(false);

  useEffect(() => {
    const savedOrder = localStorage.getItem("famzi-order");

    if (!savedOrder) {
      return;
    }

    try {
      const parsedOrder: OrderData = JSON.parse(savedOrder);

      setOrder(parsedOrder);

      if (!hasClearedCart.current) {
        hasClearedCart.current = true;
        clearCart();
      }
    } catch {
      localStorage.removeItem("famzi-order");
    }
  }, [clearCart]);

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f8f5ef] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="text-6xl">📦</div>

          <h1 className="mt-6 text-2xl font-black text-[#171717]">
            Loading your order...
          </h1>

          <p className="mt-3 text-sm leading-6 text-black/50">
            Please wait while we retrieve your order details.
          </p>
        </div>
      </main>
    );
  }

  const orderDate = new Date(order.createdAt);

  return (
    <main className="min-h-screen bg-[#f8f5ef]">
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            FAMZI — by Dfamiliz
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#171717] sm:text-4xl">
            Order Confirmed 🎉
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/50 sm:text-base">
            Thank you, {order.customerName}. Your order has been received.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Confirmation */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
                  ✓
                </div>

                <div>
                  <h2 className="text-xl font-black text-[#171717]">
                    We&apos;ve received your order
                  </h2>

                  <p className="mt-1 text-sm text-black/50">
                    Placed on{" "}
                    {orderDate.toLocaleString("en-NG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              {/* Order ID */}
              <div className="mt-6 rounded-2xl border border-black/5 bg-[#fafafa] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-black/35">
                  Order ID
                </p>

                <p className="mt-2 text-lg font-black tracking-wide text-[#171717]">
                  {order.orderId}
                </p>
              </div>

              {/* Order Status */}
              <div className="mt-4 rounded-2xl bg-orange-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Order Status
                </p>

                <p className="mt-2 text-lg font-black text-[#171717]">
                  {order.status}
                </p>

                <p className="mt-1 text-sm leading-6 text-black/50">
                  Dfamiliz has received your order and will begin preparing
                  it for delivery.
                </p>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-black text-[#171717]">
                Delivery Details
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-black/35">
                    Customer
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#171717]">
                    {order.customerName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-black/35">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#171717]">
                    {order.phone}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-black/35">
                    Delivery Address
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#171717]">
                    {order.address}
                  </p>
                </div>

                {order.note && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-black/35">
                      Order Note
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#171717]">
                      {order.note}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <aside className="h-fit rounded-3xl bg-[#171717] p-6 text-white shadow-sm sm:p-8 lg:sticky lg:top-24">
            <h2 className="text-xl font-black">
              Your Order
            </h2>

            <div className="mt-6 space-y-5">
              {order.items.map((item) => (
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
                  ₦{order.subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-white/60">
                <span>Delivery</span>

                <span>
                  ₦{order.deliveryFee.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="font-bold">
                Total
              </span>

              <span className="text-2xl font-black text-orange-500">
                ₦{order.total.toLocaleString()}
              </span>
            </div>
          </aside>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/menu"
            className="rounded-2xl bg-orange-500 px-7 py-3.5 text-center text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Order More Food
          </Link>

          <Link
            href="/"
            className="rounded-2xl border border-black/10 bg-white px-7 py-3.5 text-center text-sm font-bold text-[#171717] transition hover:bg-black/5"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}