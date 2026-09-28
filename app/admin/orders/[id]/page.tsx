"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OrderItem = {
  id: number;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number;
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  note: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function AdminOrderDetailsPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        const orderId = window.location.pathname.split("/").pop();

        if (!orderId) {
          throw new Error("Order ID is missing.");
        }

        const response = await fetch("/api/orders");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load order."
          );
        }

        const foundOrder = data.orders.find(
          (item: Order) => item.id === Number(orderId)
        );

        if (!foundOrder) {
          throw new Error("Order not found.");
        }

        setOrder(foundOrder);
      } catch (error) {
        console.error("Failed to load order:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load order."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, []);

  const updateStatus = async (status: string) => {
    if (!order) {
      return;
    }

    setIsUpdating(true);
    setUpdateMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: order.id,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update order status."
        );
      }

      setOrder(data.order);
      setUpdateMessage(
        `Order status updated to ${status}.`
      );
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );

      setUpdateMessage(
        error instanceof Error
          ? error.message
          : "Failed to update order status."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-semibold text-black/50">
              Loading order...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/admin/orders"
            className="text-sm font-bold text-orange-500 transition hover:text-orange-600"
          >
            ← Back to Orders
          </Link>

          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-semibold text-red-600">
              {error || "Order not found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          href="/admin/orders"
          className="text-sm font-bold text-orange-500 transition hover:text-orange-600"
        >
          ← Back to Orders
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Order Details
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#171717]">
              {order.orderId}
            </h1>

            <p className="mt-2 text-sm text-black/45">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Status Controls */}
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <span className="w-fit rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-orange-600">
              {order.status}
            </span>

            <select
              value={order.status}
              onChange={(event) =>
                updateStatus(event.target.value)
              }
              disabled={isUpdating}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-[#171717] outline-none transition focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="Received">
                Received
              </option>

              <option value="Accepted">
                Accepted
              </option>

              <option value="Preparing">
                Preparing
              </option>

              <option value="Ready">
                Ready
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>

            {isUpdating && (
              <p className="text-xs font-semibold text-black/40">
                Updating status...
              </p>
            )}

            {!isUpdating && updateMessage && (
              <p
                className={`text-xs font-semibold ${
                  updateMessage.startsWith(
                    "Order status updated"
                  )
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {updateMessage}
              </p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">

          {/* Left Column */}
          <div className="space-y-6">

            {/* Customer Information */}
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-[#171717]">
                Customer Information
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">

                {/* Name */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-black/35">
                    Name
                  </p>

                  <p className="mt-1 text-sm font-semibold text-black/75">
                    {order.customerName}
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-black/35">
                    Phone
                  </p>

                  <a
                    href={`tel:${order.phone}`}
                    className="mt-1 block text-sm font-semibold text-orange-500"
                  >
                    {order.phone}
                  </a>
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-black/35">
                    Delivery Address
                  </p>

                  <p className="mt-1 text-sm font-semibold text-black/75">
                    {order.address}
                  </p>
                </div>

                {/* Note */}
                {order.note && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-black/35">
                      Customer Note
                    </p>

                    <p className="mt-1 text-sm text-black/65">
                      {order.note}
                    </p>
                  </div>
                )}

              </div>
            </section>

            {/* Order Items */}
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-[#171717]">
                Order Items
              </h2>

              <div className="mt-5 divide-y divide-black/5">

                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">

                      <p className="font-bold text-[#171717]">
                        {item.name}
                      </p>

                      <p className="mt-1 text-sm text-black/45">
                        ₦{item.price.toLocaleString()} ×{" "}
                        {item.quantity}
                      </p>

                    </div>

                    <p className="whitespace-nowrap font-black text-[#171717]">
                      ₦
                      {(
                        item.price * item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}

              </div>
            </section>
          </div>

          {/* Right Column */}
          <aside>

            {/* Order Summary */}
            <section className="rounded-3xl bg-[#171717] p-6 text-white shadow-sm">

              <h2 className="text-lg font-black">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4 text-sm">

                {/* Subtotal */}
                <div className="flex justify-between gap-4 text-white/60">
                  <span>Subtotal</span>

                  <span>
                    ₦{order.subtotal.toLocaleString()}
                  </span>
                </div>

                {/* Delivery */}
                <div className="flex justify-between gap-4 text-white/60">
                  <span>Delivery</span>

                  <span>
                    ₦{order.deliveryFee.toLocaleString()}
                  </span>
                </div>

                {/* Total */}
                <div className="border-t border-white/10 pt-4">

                  <div className="flex justify-between gap-4">

                    <span className="font-bold">
                      Total
                    </span>

                    <span className="text-2xl font-black text-orange-400">
                      ₦{order.total.toLocaleString()}
                    </span>

                  </div>

                </div>

              </div>

            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}