import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { getCanonicalMenuCategory, normalizeMenuCategory } from "@/data/menu-categories";

type MenuInput = {
  name?: unknown;
  description?: unknown;
  price?: unknown;
  category?: unknown;
  image?: unknown;
  popular?: unknown;
  available?: unknown;
};

function parseMenuFields(body: MenuInput, partial = false) {
  const data: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    image?: string;
    popular?: boolean;
    available?: boolean;
  } = {};
  const errors: string[] = [];

  for (const field of ["name", "description", "category", "image"] as const) {
    const value = body[field];
    if (value === undefined && partial) continue;
    if (typeof value !== "string" || !value.trim()) {
      errors.push(`${field} is required.`);
    } else if (field === "category") {
      const canonicalCategory = getCanonicalMenuCategory(value);
      if (canonicalCategory) {
        data.category = canonicalCategory;
      } else if (partial) {
        data.category = normalizeMenuCategory(value);
      } else {
        errors.push("Choose a category from the list.");
      }
    } else {
      data[field] = value.trim();
    }
  }

  if (body.price !== undefined || !partial) {
    if (!Number.isInteger(body.price) || Number(body.price) < 1) {
      errors.push("Price must be a positive whole number.");
    } else {
      data.price = Number(body.price);
    }
  }

  for (const field of ["popular", "available"] as const) {
    const value = body[field];
    if (value === undefined && partial) continue;
    if (value !== undefined && typeof value !== "boolean") {
      errors.push(`${field} must be true or false.`);
    } else if (typeof value === "boolean") {
      data[field] = value;
    } else if (!partial) {
      data[field] = field === "available";
    }
  }

  return { data, errors };
}

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({
      menuItems: menuItems.map((item) => ({
        ...item,
        category: normalizeMenuCategory(item.category),
      })),
    });
  } catch (error) {
    console.error("Failed to fetch admin menu:", error);
    return NextResponse.json(
      { error: "Failed to load menu items." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const parsedBody: unknown = await request.json();
    if (
      !parsedBody ||
      typeof parsedBody !== "object" ||
      Array.isArray(parsedBody)
    ) {
      return NextResponse.json({ error: "Invalid menu item." }, { status: 400 });
    }
    const body = parsedBody as MenuInput;
    const { data, errors } = parseMenuFields(body);
    if (errors.length) {
      return NextResponse.json({ error: errors[0] }, { status: 400 });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name: data.name!,
        description: data.description!,
        price: data.price!,
        category: data.category!,
        image: data.image!,
        popular: data.popular ?? false,
        available: data.available ?? true,
      },
    });
    return NextResponse.json({ menuItem }, { status: 201 });
  } catch (error) {
    console.error("Failed to create menu item:", error);
    return NextResponse.json(
      { error: "Failed to create menu item." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const parsedBody: unknown = await request.json();
    if (
      !parsedBody ||
      typeof parsedBody !== "object" ||
      Array.isArray(parsedBody)
    ) {
      return NextResponse.json({ error: "Invalid menu item." }, { status: 400 });
    }
    const body = parsedBody as MenuInput & { id?: unknown };
    const id = Number(body.id);
    if (!Number.isInteger(id) || id < 1) {
      return NextResponse.json({ error: "Invalid menu item ID." }, { status: 400 });
    }

    const { data, errors } = parseMenuFields(body, true);
    if (errors.length || Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: errors[0] || "No menu item changes provided." },
        { status: 400 },
      );
    }

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data,
    });
    return NextResponse.json({ menuItem });
  } catch (error) {
    console.error("Failed to update menu item:", error);
    return NextResponse.json(
      { error: "Failed to update menu item." },
      { status: 500 },
    );
  }
}
