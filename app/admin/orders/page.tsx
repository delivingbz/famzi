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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("/api/orders");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load orders."
          );
        }

        setOrders(data.orders);
      } catch (error) {
        console.error("Failed to load orders:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load orders."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  const receivedOrders = orders.filter(
    (order) => order.status === "Received"
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "Preparing"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            FAMZI Admin
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#171717] sm:text-4xl">
            Orders
          </h1>

          <p className="mt-2 text-sm text-black/50">
            Manage incoming customer orders.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-black/40">
              Total Orders
            </p>

            <p className="mt-2 text-2xl font-black text-[#171717]">
              {orders.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-black/40">
              Received
            </p>

            <p className="mt-2 text-2xl font-black text-orange-500">
              {receivedOrders}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-black/40">
              Preparing
            </p>

            <p className="mt-2 text-2xl font-black text-blue-600">
              {preparingOrders}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-black/40">
              Completed
            </p>

            <p className="mt-2 text-2xl font-black text-green-600">
              {completedOrders}
            </p>
          </div>

        </div>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-semibold text-black/50">
              Loading orders...
            </p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-semibold text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !error &&
          orders.length === 0 && (
            <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

              <div className="text-5xl">
                📦
              </div>

              <h2 className="mt-4 text-xl font-black">
                No orders yet
              </h2>

              <p className="mt-2 text-sm text-black/50">
                New customer orders will appear here.
              </p>

            </div>
          )}

        {/* Orders */}
        {!isLoading &&
          !error &&
          orders.length > 0 && (
            <div className="space-y-4">

              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block"
                >
                  <article className="rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      {/* Customer */}
                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-3">

                          <h2 className="text-lg font-black text-[#171717]">
                            {order.customerName}
                          </h2>

                          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                            {order.status}
                          </span>

                        </div>

                        <p className="mt-1 text-xs font-semibold text-black/35">
                          {order.orderId}
                        </p>

                        <p className="mt-3 text-sm text-black/55">
                          {order.phone}
                        </p>

                        <p className="mt-1 text-sm text-black/55">
                          {order.address}
                        </p>

                      </div>

                      {/* Items */}
                      <div className="lg:min-w-[260px]">

                        <p className="text-xs font-bold uppercase tracking-wide text-black/35">
                          Items
                        </p>

                        <div className="mt-2 space-y-1">

                          {order.items.map((item) => (
                            <p
                              key={item.id}
                              className="text-sm text-black/65"
                            >
                              {item.quantity} × {item.name}
                            </p>
                          ))}

                        </div>

                      </div>

                      {/* Total */}
                      <div className="lg:text-right">

                        <p className="text-xs font-bold uppercase tracking-wide text-black/35">
                          Total
                        </p>

                        <p className="mt-1 text-2xl font-black text-orange-500">
                          ₦{order.total.toLocaleString()}
                        </p>

                        <p className="mt-1 text-xs text-black/40">
                          {new Date(
                            order.createdAt
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>

                  </article>
                </Link>
              ))}

            </div>
          )}

      </div>
    </main>
  );
}