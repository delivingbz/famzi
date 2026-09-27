import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      orderId,
      customerName,
      phone,
      address,
      note,
      items,
      subtotal,
      deliveryFee,
      total,
    } = body;

    if (
      !orderId ||
      !customerName ||
      !phone ||
      !address ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid order data." },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        orderId,
        customerName,
        phone,
        address,
        note: note || null,
        subtotal,
        deliveryFee,
        total,
        items: {
          create: items.map((item: {
            id: number;
            name: string;
            price: number;
            quantity: number;
          }) => ({
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        order,
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