// FAMZI FILE GUIDE: Creates customer orders from current database prices and exposes protected admin order updates.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hasAdminSession } from "@/lib/admin-auth";

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
    const validatedDeliveryFee = fulfillmentType === "Delivery" ? 1000 : 0;
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
        note: note?.trim() || null,
        subtotal: validatedSubtotal,
        deliveryFee: validatedDeliveryFee,
        total: validatedSubtotal + validatedDeliveryFee,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    const whatsappText = [
      `Hello Dfamiliz, I just placed order ${order.orderId}. Please confirm my payment.`,
      `Name: ${order.customerName}`,
      `Phone: ${order.phone}`,
      `${order.fulfillmentType === "Pickup" ? "Pickup point" : "Delivery address"}: ${order.address}`,
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
      { error: "Failed to create order." },
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
    const { id, status, paymentStatus } = body;
    const allowedStatuses = [
      "Received",
      "Accepted",
      "Preparing",
      "Ready",
      "Completed",
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

    const order = await prisma.order.update({
      where: {
        id: Number(id),
      },
      data: updateData,
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Failed to update order:", error);

    return NextResponse.json(
      { error: "Failed to update order." },
      { status: 500 }
    );
  }
}
