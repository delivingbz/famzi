// FAMZI FILE GUIDE: Admin dashboard with a compact summary of recent orders.
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

const statusStyles: Record<string, string> = {
  New: "bg-amber-50 text-amber-700",
  Received: "bg-orange-50 text-orange-600",
  Accepted: "bg-purple-50 text-purple-600",
  Preparing: "bg-blue-50 text-blue-600",
  Ready: "bg-emerald-50 text-emerald-600",
  Completed: "bg-green-50 text-green-600",
  "Out for Delivery": "bg-cyan-50 text-cyan-700",
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  async function loadOrders() {
    try {
      const response = await fetch("/api/orders", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load dashboard data."
        );
      }

      setOrders(data.orders);
      setError("");
    } catch (error) {
      console.error(
        "Failed to load dashboard data:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard data."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Load immediately
  loadOrders();

  // Refresh every 15 seconds
  const interval = setInterval(() => {
    loadOrders();
  }, 15000);

  // Stop polling when leaving the dashboard
  return () => {
    clearInterval(interval);
  };
}, []);

  const newOrders = orders.filter(
    (order) => order.status === "New" || order.status === "Received"
  ).length;

  const acceptedOrders = orders.filter(
    (order) => order.status === "Accepted"
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "Preparing"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const recentOrders = orders.slice(0, 5);

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#171717]">

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

            {/* Greeting */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-orange-500">
                FAMZI Admin
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Good evening, Admin
              </h1>

              <p className="mt-2 text-sm text-black/45">
                Here&apos;s what&apos;s happening with your restaurant today.
              </p>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                <p className="text-sm font-semibold text-black/50">
                  Loading dashboard...
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

            {/* Dashboard */}
            {!isLoading && !error && (
              <>

                {/* KPI Cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                  {/* New */}
                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-black/40">
                          New
                        </p>

                        <p className="mt-3 text-3xl font-black">
                          {newOrders}
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                        🛎️
                      </div>
                    </div>

                    <p className="mt-4 text-xs font-medium text-black/35">
                      Awaiting staff action
                    </p>
                  </div>

                  {/* Accepted */}
                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-black/40">
                          Accepted
                        </p>

                        <p className="mt-3 text-3xl font-black">
                          {acceptedOrders}
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                        ✓
                      </div>
                    </div>

                    <p className="mt-4 text-xs font-medium text-black/35">
                      Accepted orders
                    </p>
                  </div>

                  {/* Preparing */}
                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-black/40">
                          Preparing
                        </p>

                        <p className="mt-3 text-3xl font-black">
                          {preparingOrders}
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        🍳
                      </div>
                    </div>

                    <p className="mt-4 text-xs font-medium text-black/35">
                      Currently being prepared
                    </p>
                  </div>

                  {/* Completed */}
                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-black/40">
                          Completed
                        </p>

                        <p className="mt-3 text-3xl font-black">
                          {completedOrders}
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                        ✓
                      </div>
                    </div>

                    <p className="mt-4 text-xs font-medium text-black/35">
                      Successfully completed
                    </p>
                  </div>

                </div>

                {/* Recent Orders */}
                <section className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm">

                  {/* Section Header */}
                  <div className="flex flex-col gap-4 border-b border-black/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

                    <div>
                      <h2 className="text-xl font-black">
                        Recent Orders
                      </h2>

                      <p className="mt-1 text-sm text-black/45">
                        The latest customer orders.
                      </p>
                    </div>

                    <Link
                      href="/admin/orders"
                      className="w-fit rounded-xl bg-[#171717] px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
                    >
                      View All Orders
                    </Link>

                  </div>

                  {/* Empty */}
                  {recentOrders.length === 0 && (
                    <div className="p-12 text-center">
                      <div className="text-4xl">
                        📦
                      </div>

                      <p className="mt-3 text-sm font-semibold text-black/50">
                        No orders yet.
                      </p>
                    </div>
                  )}

                  {/* Desktop Table */}
                  {recentOrders.length > 0 && (
                    <div className="hidden overflow-x-auto md:block">

                      <table className="w-full text-left">

                        <thead>
                          <tr className="border-b border-black/5 bg-[#faf9f7]">

                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-black/35">
                              Order ID
                            </th>

                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-black/35">
                              Customer
                            </th>

                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-black/35">
                              Total
                            </th>

                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-black/35">
                              Status
                            </th>

                          </tr>
                        </thead>

                        <tbody>

                          {recentOrders.map((order) => (
                            <tr
                              key={order.id}
                              onClick={() => {
                                window.location.href =
                                  `/admin/orders/${order.id}`;
                              }}
                              className="cursor-pointer border-b border-black/5 transition hover:bg-orange-50/40"
                            >

                              <td className="px-6 py-5">
                                <p className="text-sm font-bold">
                                  {order.orderId}
                                </p>

                                <p className="mt-1 text-xs text-black/35">
                                  {new Date(
                                    order.createdAt
                                  ).toLocaleString()}
                                </p>
                              </td>

                              <td className="px-6 py-5">
                                <p className="text-sm font-bold">
                                  {order.customerName}
                                </p>

                                <p className="mt-1 text-xs text-black/40">
                                  {order.items.length} item
                                  {order.items.length !== 1
                                    ? "s"
                                    : ""}
                                </p>
                              </td>

                              <td className="px-6 py-5">
                                <p className="text-sm font-black text-orange-500">
                                  ₦{order.total.toLocaleString()}
                                </p>
                              </td>

                              <td className="px-6 py-5">

                                <span
                                  className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                                    statusStyles[
                                      order.status
                                    ] ||
                                    "bg-black/5 text-black/60"
                                  }`}
                                >
                                  {order.status}
                                </span>

                              </td>

                            </tr>
                          ))}

                        </tbody>

                      </table>

                    </div>
                  )}

                  {/* Mobile Orders */}
                  {recentOrders.length > 0 && (
                    <div className="divide-y divide-black/5 md:hidden">

                      {recentOrders.map((order) => (
                        <Link
                          key={order.id}
                          href={`/admin/orders/${order.id}`}
                          className="block p-5 transition hover:bg-orange-50/40"
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div className="min-w-0">

                              <p className="truncate text-sm font-black">
                                {order.orderId}
                              </p>

                              <p className="mt-1 text-sm font-semibold text-black/60">
                                {order.customerName}
                              </p>

                              <p className="mt-2 text-xs text-black/40">
                                {new Date(
                                  order.createdAt
                                ).toLocaleString()}
                              </p>

                            </div>

                            <div className="shrink-0 text-right">

                              <p className="text-sm font-black text-orange-500">
                                ₦{order.total.toLocaleString()}
                              </p>

                              <span
                                className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                                  statusStyles[
                                    order.status
                                  ] ||
                                  "bg-black/5 text-black/60"
                                }`}
                              >
                                {order.status}
                              </span>

                            </div>

                          </div>

                        </Link>
                      ))}

                    </div>
                  )}

                </section>

              </>
            )}

      </div>
    </main>
  );
}
