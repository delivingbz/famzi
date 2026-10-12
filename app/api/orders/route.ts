// FAMZI FILE GUIDE: Creates customer orders from current database prices and exposes protected admin order updates.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hasAdminSession } from "@/lib/admin-auth";
import { sendOrderStatusWhatsAppUpdate } from "@/lib/whatsapp";

function isValidPhoneNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return /^\+?[0-9\s()-]+$/.test(phone.trim()) && digits.length >= 10 && digits.length <= 15;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      orderId,
      customerName,
      phone,
      address,
      fulfillmentType,
      paymentMethod,
      whatsappUpdatesOptIn,
      note,
      items,
    } = body;

    if (
      typeof orderId !== "string" ||
      !orderId.trim() ||
      typeof customerName !== "string" ||
      !customerName.trim() ||
      typeof phone !== "string" ||
      !isValidPhoneNumber(phone) ||
      typeof address !== "string" ||
      !address.trim() ||
      !["Delivery", "Pickup"].includes(fulfillmentType) ||
      paymentMethod !== "WhatsApp" ||
      typeof whatsappUpdatesOptIn !== "boolean" ||
      (note !== undefined && typeof note !== "string") ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid order data." },
        { status: 400 }
      );
    }

    if (
      items.some(
        (item) =>
          !item ||
          !Number.isSafeInteger(item.id) ||
          item.id < 1 ||
          !Number.isSafeInteger(item.quantity) ||
          item.quantity < 1
      )
    ) {
      return NextResponse.json(
        { error: "Invalid order items." },
        { status: 400 }
      );
    }

    const itemIds = items.map((item: { id: number }) => item.id);
    if (new Set(itemIds).size !== itemIds.length) {
      return NextResponse.json(
        { error: "Duplicate menu items are not allowed." },
        { status: 400 }
      );
    }

    const currentMenuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: itemIds },
        available: true,
      },
    });
    const menuItemsById = new Map(
      currentMenuItems.map((item) => [item.id, item])
    );

    if (
      currentMenuItems.length !== items.length ||
      items.some((item: { id: number; price?: number }) => {
        const menuItem = menuItemsById.get(item.id);
        return !menuItem || item.price !== menuItem.price;
      })
    ) {
      return NextResponse.json(
        {
          error:
            "A menu item is unavailable or its price changed. Please refresh the menu and update your cart.",
        },
        { status: 409 }
      );
    }

    const orderItems = items.map(
      (item: { id: number; quantity: number }) => {
        const menuItem = menuItemsById.get(item.id)!;
        return {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: item.quantity,
        };
      }
    );
    const validatedSubtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    // Delivery charges are confirmed with the customer in WhatsApp.
    const validatedDeliveryFee = 0;
    const whatsappNumber = process.env.WHATSAPP_BUSINESS_NUMBER?.replace(/\D/g, "");
    if (!whatsappNumber) {
      return NextResponse.json(
        { error: "WhatsApp ordering is not configured. Please contact Dfamiliz directly." },
        { status: 503 }
      );
    }

    const order = await prisma.order.create({
      data: {
        orderId,
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        fulfillmentType,
        paymentMethod,
        paymentStatus: "Awaiting WhatsApp Confirmation",
        status: "New",
        note: note?.trim() || null,
        subtotal: validatedSubtotal,
        deliveryFee: validatedDeliveryFee,
        total: validatedSubtotal + validatedDeliveryFee,
        whatsappUpdatesOptIn,
        items: {
          create: orderItems,
        },
        statusEvents: {
          create: { status: "New" },
        },
      },
      include: {
        items: true,
        statusEvents: { orderBy: { createdAt: "asc" } },
      },
    });

    const whatsappText = [
      `Hello Dfamiliz, I just placed order ${order.orderId}. Please confirm my payment.`,
      `Name: ${order.customerName}`,
      `Phone: ${order.phone}`,
      `${order.fulfillmentType === "Pickup" ? "Pickup point" : "Delivery address"}: ${order.address}`,
      ...(order.fulfillmentType === "Delivery" ? ["Delivery fee: To be discussed and confirmed on WhatsApp."] : []),
      "Items:",
      ...order.items.map((item) => `- ${item.name} x ${item.quantity}: NGN ${(item.price * item.quantity).toLocaleString("en-NG")}`),
      `Total: NGN ${order.total.toLocaleString("en-NG")}`,
      ...(order.note ? [`Note: ${order.note}`] : []),
    ].join("\n");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

    return NextResponse.json(
      {
        success: true,
        order,
        whatsappUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create order:", error);

    return NextResponse.json(
      {
        error: "Failed to create order.",
        ...(process.env.NODE_ENV === "development" && error instanceof Error
          ? { details: error.message }
          : {}),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        statusEvents: { orderBy: { createdAt: "asc" } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);

    return NextResponse.json(
      { error: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, paymentStatus, retryWhatsAppUpdate } = body;
    const allowedStatuses = [
      "Received",
      "Accepted",
      "Preparing",
      "Ready",
      "Out for Delivery",
      "Completed",
      "New",
    ];

    if (!Number.isSafeInteger(id) || id < 1) {
      return NextResponse.json(
        { error: "A valid order ID is required." },
        { status: 400 }
      );
    }

    if (status !== undefined && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid order status." },
        { status: 400 }
      );
    }
    if (retryWhatsAppUpdate !== undefined && typeof retryWhatsAppUpdate !== "boolean") {
      return NextResponse.json({ error: "Invalid WhatsApp retry request." }, { status: 400 });
    }

    const previousOrder = await prisma.order.findUnique({
      where: { id: Number(id) },
      select: {
        status: true,
        fulfillmentType: true,
        phone: true,
        customerName: true,
        orderId: true,
        whatsappUpdatesOptIn: true,
      },
    });
    if (!previousOrder) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    if (status === "Out for Delivery" && previousOrder.fulfillmentType !== "Delivery") {
      return NextResponse.json({ error: "Only delivery orders can be marked out for delivery." }, { status: 400 });
    }

    if (
      paymentStatus !== undefined &&
      !["Awaiting Transfer", "Awaiting WhatsApp Confirmation", "Paid"].includes(paymentStatus)
    ) {
      return NextResponse.json(
        { error: "Invalid payment status." },
        { status: 400 }
      );
    }

    const updateData: { status?: string; paymentStatus?: string } = {};
    if (status !== undefined) updateData.status = status;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    if (!Object.keys(updateData).length) {
      return NextResponse.json(
        { error: "Provide an order or payment status to update." },
        { status: 400 }
      );
    }

    const statusChanged = status !== undefined && status !== previousOrder.status;
    const order = await prisma.order.update({
      where: {
        id: Number(id),
      },
      data: {
        ...updateData,
        ...(statusChanged ? { statusEvents: { create: { status: status! } } } : {}),
      },
      include: {
        items: true,
        statusEvents: { orderBy: { createdAt: "asc" } },
      },
    });

    const shouldSendNotification = status !== undefined &&
      ["Received", "Preparing", "Out for Delivery"].includes(status) &&
      (statusChanged || retryWhatsAppUpdate === true);
    const notification = shouldSendNotification
      ? await sendOrderStatusWhatsAppUpdate({
          phone: previousOrder.phone,
          customerName: previousOrder.customerName,
          orderId: previousOrder.orderId,
          status,
          optedIn: previousOrder.whatsappUpdatesOptIn,
        })
      : undefined;

    return NextResponse.json({
      success: true,
      order,
      notification,
    });
  } catch (error) {
    console.error("Failed to update order:", error);

    return NextResponse.json(
      { error: "Failed to update order." },
      { status: 500 }
    );
  }
}
