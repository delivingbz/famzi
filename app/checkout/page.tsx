// FAMZI FILE GUIDE: Checkout form that validates delivery or pickup details and submits an order.
"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import CartMenuReviewNotice from "@/components/CartMenuReviewNotice";
import { useCartMenuSync } from "@/hooks/useCartMenuSync";

export default function CheckoutPage() {
  const {
    cartItems,
    cartTotal,
    menuReviewChanges,
    acknowledgeMenuChanges,
    clearCart,
  } = useCart();
  const { isChecking, error: menuCheckError, checkMenu } = useCartMenuSync();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappUpdatesOptIn, setWhatsappUpdatesOptIn] = useState(false);
  const [address, setAddress] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState<"Delivery" | "Pickup">("Delivery");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Delivery charges are agreed with the customer in WhatsApp after checkout.
  const deliveryFee = 0;
  const grandTotal = cartTotal;
  const [reviewedGrandTotal, setReviewedGrandTotal] = useState<number | null>(null);
  const needsMenuReview = Boolean(
    menuReviewChanges &&
      (menuReviewChanges.priceChanges.length > 0 ||
        menuReviewChanges.renamedItems.length > 0 ||
        menuReviewChanges.unavailableItems.length > 0),
  );

  const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  if (isChecking || menuCheckError) {
    setError(
      menuCheckError || "Please wait while we check current menu prices.",
    );
    return;
  }

  if (needsMenuReview) {
    setError("Please review and confirm the updated order total.");
    return;
  }

  if (!customerName.trim()) {
    setError("Please enter your name.");
    return;
  }

  if (!phone.trim()) {
    setError("Please enter your phone number.");
    return;
  }

  const phoneDigits = phone.replace(/\D/g, "");
  if (!/^\+?[0-9\s()-]+$/.test(phone.trim()) || phoneDigits.length < 10 || phoneDigits.length > 15) {
    setError("Please enter a valid phone number with 10 to 15 digits.");
    return;
  }

  if (!address.trim()) {
    setError(fulfillmentType === "Delivery"
      ? "Please enter your delivery address."
      : "Please enter your pickup point or address.");
    return;
  }

  if (cartItems.length === 0) {
    setError("Your cart is empty.");
    return;
  }

  setError("");
  setIsSubmitting(true);

  const orderId = `FAM-${Date.now()}`;

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        fulfillmentType,
        paymentMethod: "WhatsApp",
        whatsappUpdatesOptIn,
        note: note.trim(),
        items: cartItems,
        subtotal: cartTotal,
        deliveryFee,
        total: grandTotal,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        setReviewedGrandTotal(null);
        await checkMenu();
        throw new Error(
          "The menu changed while you were checking out. We refreshed your cart. Review the updated items and total before placing your order.",
        );
      }
      throw new Error(
        data.details
          ? `${data.error || "Failed to place your order."} ${data.details}`
          : data.error || "Failed to place your order."
      );
    }

    localStorage.setItem("famzi-order", JSON.stringify({ ...data.order, whatsappUrl: data.whatsappUrl }));
    clearCart();
    window.location.href = data.whatsappUrl || "/order-confirmation";
  } catch (error) {
    console.error("Order submission failed:", error);

    setError(
      error instanceof Error
        ? error.message
        : "Something went wrong while placing your order."
    );

    setIsSubmitting(false);
  }
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
            {menuReviewChanges?.unavailableItems.length
              ? "Some items became unavailable and were removed from your cart. Choose replacements from the menu."
              : "Add some delicious meals before proceeding to checkout."}
          </p>

          <div className="mt-5 w-full text-left">
            <CartMenuReviewNotice changes={menuReviewChanges} />
          </div>

          {menuCheckError && (
            <div className="mt-4">
              <p role="alert" className="text-sm font-semibold text-red-600">
                {menuCheckError}
              </p>
              <button
                type="button"
                onClick={() => void checkMenu()}
                className="mt-3 text-sm font-bold text-orange-600"
              >
                Try again
              </button>
            </div>
          )}

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
            Choose pickup or delivery and enter your contact details.
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
              Fulfillment and Customer Details
            </h2>

            <div className="mt-6 space-y-5">
              {isChecking && (
                <p className="rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
                  Checking current menu prices and availability...
                </p>
              )}
              {menuCheckError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p role="alert" className="text-sm font-semibold text-red-600">
                    {menuCheckError}
                  </p>
                  <button
                    type="button"
                    onClick={() => void checkMenu()}
                    className="mt-2 text-sm font-bold text-red-700 underline"
                  >
                    Try again
                  </button>
                </div>
              )}
              <CartMenuReviewNotice changes={menuReviewChanges} />

              <fieldset>
                <legend className="mb-2 block text-sm font-bold text-[#171717]">
                  How would you like to receive your order?
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(["Delivery", "Pickup"] as const).map((option) => (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                        fulfillmentType === option
                          ? "border-orange-500 bg-orange-50"
                          : "border-black/10 bg-white hover:border-orange-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="fulfillmentType"
                        value={option}
                        checked={fulfillmentType === option}
                        onChange={() => setFulfillmentType(option)}
                        className="mt-1 accent-orange-500"
                      />
                      <span>
                        <span className="block text-sm font-bold">{option}</span>
                        <span className="mt-1 block text-xs text-black/50">
                          {option === "Delivery"
                            ? "We bring your order to your address."
                            : "Tell us the pickup point or address and we will coordinate with you."}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

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
                  {fulfillmentType === "Delivery" ? "Delivery Address" : "Pickup Point / Address"}
                </label>

                <textarea
                  id="address"
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  placeholder={fulfillmentType === "Delivery"
                    ? "Enter your complete delivery address"
                    : "Enter the address or pickup point where you will collect your order"}
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

              <label className="flex items-start gap-3 rounded-2xl border border-black/10 bg-[#fafafa] p-4 text-sm text-black/70">
                <input
                  type="checkbox"
                  checked={whatsappUpdatesOptIn}
                  onChange={(event) => setWhatsappUpdatesOptIn(event.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-orange-500"
                />
                <span>
                  I agree to receive WhatsApp status updates for this order, including when it is received, being prepared, and out for delivery.
                </span>
              </label>

              <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
                <p className="text-sm font-black text-[#171717]">Confirm payment on WhatsApp</p>
                <p className="mt-2 text-sm leading-6 text-black/60">
                  Place your order to save it, then WhatsApp will open with your order details. Send the message to coordinate and confirm payment with Dfamiliz.
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {needsMenuReview && (
              <label className="mt-5 flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm font-semibold text-orange-950">
                <input
                  type="checkbox"
                  checked={reviewedGrandTotal === grandTotal}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setReviewedGrandTotal(grandTotal);
                      setError("");
                      acknowledgeMenuChanges();
                    } else {
                      setReviewedGrandTotal(null);
                    }
                  }}
                  className="mt-0.5 h-4 w-4 accent-orange-500"
                />
                <span>
                  I reviewed the updated items and confirm the new total of ₦
                  {grandTotal.toLocaleString()}.
                </span>
              </label>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={
                isSubmitting ||
                isChecking ||
                Boolean(menuCheckError) ||
                needsMenuReview
              }
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
                <span>{fulfillmentType === "Delivery" ? "Delivery fee" : "Pickup"}</span>

                <span>
                  {fulfillmentType === "Delivery" ? "Discuss on WhatsApp" : "Free"}
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
