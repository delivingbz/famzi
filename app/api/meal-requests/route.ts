import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const allowedStatuses = ["Received", "Preparing", "Completed"];

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid meal request." }, { status: 400 });
    }

    const { customerName, phone, description } = body as Record<string, unknown>;
    if (
      typeof customerName !== "string" ||
      !customerName.trim() ||
      customerName.trim().length > 100 ||
      typeof phone !== "string" ||
      !phone.trim() ||
      phone.trim().length > 40 ||
      typeof description !== "string" ||
      !description.trim() ||
      description.trim().length > 2000
    ) {
      return NextResponse.json(
        { error: "Enter your name, phone number, and meal description (up to 2,000 characters)." },
        { status: 400 },
      );
    }

    const whatsappNumber = process.env.WHATSAPP_BUSINESS_NUMBER?.replace(/\D/g, "");
    if (!whatsappNumber) {
      return NextResponse.json(
        { error: "WhatsApp is not configured. Please contact Dfamiliz directly." },
        { status: 503 },
      );
    }

    const mealRequest = await prisma.mealRequest.create({
      data: {
        customerName: customerName.trim(),
        phone: phone.trim(),
        description: description.trim(),
      },
    });
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      `Hi, I have a fantasy meal request.\nName: ${mealRequest.customerName}\nPhone: ${mealRequest.phone}\nMeal: ${mealRequest.description}`,
    )}`;

    return NextResponse.json({ success: true, whatsappUrl }, { status: 201 });
  } catch (error) {
    console.error("Failed to save meal request:", error);
    return NextResponse.json(
      { error: "Failed to send your meal request. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const mealRequests = await prisma.mealRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ mealRequests });
  } catch (error) {
    console.error("Failed to load meal requests:", error);
    return NextResponse.json(
      { error: "Failed to load meal requests." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request update." }, { status: 400 });
    }
    const { id, status } = body as { id?: unknown; status?: unknown };
    if (!Number.isSafeInteger(id) || Number(id) < 1 || !allowedStatuses.includes(String(status))) {
      return NextResponse.json({ error: "Invalid request ID or status." }, { status: 400 });
    }

    const mealRequest = await prisma.mealRequest.update({
      where: { id: Number(id) },
      data: { status: String(status) },
    });
    return NextResponse.json({ mealRequest });
  } catch (error) {
    console.error("Failed to update meal request:", error);
    return NextResponse.json(
      { error: "Failed to update meal request." },
      { status: 500 },
    );
  }
}
