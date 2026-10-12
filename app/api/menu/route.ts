// FAMZI FILE GUIDE: Returns the public menu with canonicalized category names.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeMenuCategory } from "@/data/menu-categories";

export async function GET() {
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
    console.error("Failed to fetch menu:", error);
    return NextResponse.json(
      { error: "Failed to load the menu." },
      { status: 500 },
    );
  }
}
