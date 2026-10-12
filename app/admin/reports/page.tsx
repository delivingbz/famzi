// FAMZI FILE GUIDE: Admin sales report that calculates order and payment totals.
"use client";

import { useEffect, useMemo, useState } from "react";

type ReportOrder = {
  id: number;
  orderId: string;
  customerName: string;
  total: number;
  status: string;
  paymentStatus: string | null;
  createdAt: string;
  items: { name: string; quantity: number }[];
};

type Period = "day" | "month";

function localDateKey(value: string | Date) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMoney(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<ReportOrder[]>([]);
  const [period, setPeriod] = useState<Period>("day");
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSelectedDate(localDateKey(new Date()));

    async function loadOrders() {
      try {
        const response = await fetch("/api/orders", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load report data.");
        setOrders(data.orders);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load report data.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrders();
  }, []);

  const reportOrders = useMemo(() => {
    if (!selectedDate) return [];
    return orders.filter((order) => {
      const orderDate = localDateKey(order.createdAt);
      return period === "day"
        ? orderDate === selectedDate
        : orderDate.slice(0, 7) === selectedDate.slice(0, 7);
    });
  }, [orders, period, selectedDate]);

  const metrics = useMemo(() => {
    const completed = reportOrders.filter((order) => order.status === "Completed").length;
    const paidOrders = reportOrders.filter((order) => order.paymentStatus === "Paid");
    const paidRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
    const grossOrderValue = reportOrders.reduce((sum, order) => sum + order.total, 0);
    const itemCounts = new Map<string, number>();
    for (const order of reportOrders) {
      for (const item of order.items) {
        itemCounts.set(item.name, (itemCounts.get(item.name) ?? 0) + item.quantity);
      }
    }
    const popularItems = [...itemCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    return { completed, paidOrders: paidOrders.length, paidRevenue, grossOrderValue, popularItems };
  }, [reportOrders]);

  const reportLabel = period === "day" ? "Daily performance" : "Monthly report";

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-500">FAMZI Admin</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Reports</h1>
            <p className="mt-2 text-sm text-black/50">Review order activity and payment performance.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl bg-white p-1 shadow-sm" aria-label="Report period">
              {(["day", "month"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPeriod(option)}
                  aria-pressed={period === option}
                  className={`rounded-lg px-4 py-2 text-sm font-bold ${period === option ? "bg-orange-500 text-white" : "text-black/60 hover:bg-black/5"}`}
                >
                  {option === "day" ? "Daily" : "Monthly"}
                </button>
              ))}
            </div>
            <input
              aria-label={period === "day" ? "Choose report date" : "Choose report month"}
              type={period === "day" ? "date" : "month"}
              value={period === "day" ? selectedDate : selectedDate.slice(0, 7)}
              onChange={(event) => {
                const value = event.target.value;
                setSelectedDate(period === "month" && value ? `${value}-01` : value);
              }}
              className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm font-semibold shadow-sm"
            />
          </div>
        </div>

        {isLoading && <p className="mt-8 rounded-2xl bg-white p-6 text-sm font-semibold text-black/50">Loading report...</p>}
        {!isLoading && error && <p role="alert" className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">{error}</p>}

        {!isLoading && !error && (
          <>
            <h2 className="mt-8 text-lg font-black">{reportLabel} · {period === "day" ? selectedDate : selectedDate.slice(0, 7)}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Orders received", value: reportOrders.length.toLocaleString() },
                { label: "Orders completed", value: metrics.completed.toLocaleString() },
                { label: "Confirmed payments", value: formatMoney(metrics.paidRevenue), detail: `${metrics.paidOrders} paid orders` },
                { label: "Total order value", value: formatMoney(metrics.grossOrderValue), detail: "Includes orders awaiting payment" },
              ].map((metric) => (
                <section key={metric.label} className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-black/40">{metric.label}</p>
                  <p className="mt-3 text-2xl font-black">{metric.value}</p>
                  {metric.detail && <p className="mt-2 text-xs font-medium text-black/40">{metric.detail}</p>}
                </section>
              ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="border-b border-black/5 p-5">
                  <h3 className="font-black">Orders in this period</h3>
                </div>
                {reportOrders.length === 0 ? (
                  <p className="p-8 text-center text-sm font-medium text-black/45">No orders for this period.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#faf9f7] text-xs uppercase tracking-wide text-black/40">
                        <tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Payment</th></tr>
                      </thead>
                      <tbody>
                        {reportOrders.map((order) => (
                          <tr key={order.id} className="border-t border-black/5">
                            <td className="px-5 py-4 font-bold">{order.orderId}</td>
                            <td className="px-5 py-4">{order.customerName}</td>
                            <td className="px-5 py-4 font-semibold">{formatMoney(order.total)}</td>
                            <td className="px-5 py-4">{order.paymentStatus || "Not recorded"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <section className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="font-black">Top meals</h3>
                {metrics.popularItems.length === 0 ? (
                  <p className="mt-4 text-sm text-black/45">No meal sales recorded for this period.</p>
                ) : (
                  <ol className="mt-4 divide-y divide-black/5">
                    {metrics.popularItems.map(([name, quantity]) => (
                      <li key={name} className="flex justify-between gap-4 py-3 text-sm">
                        <span className="font-semibold">{name}</span><span className="shrink-0 text-black/50">{quantity} sold</span>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
