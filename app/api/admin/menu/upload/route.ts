// FAMZI FILE GUIDE: Authenticated image upload endpoint with file type and size checks.
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const imageTypes = {
  "image/jpeg": { extension: "jpg", signature: [0xff, 0xd8, 0xff] },
  "image/png": { extension: "png", signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  "image/webp": { extension: "webp", signature: [0x52, 0x49, 0x46, 0x46] },
} as const;

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const image = formData.get("image");
    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
    }
    if (image.size === 0 || image.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Image must be smaller than 5 MB." }, { status: 400 });
    }

    const type = imageTypes[image.type as keyof typeof imageTypes];
    if (!type) {
      return NextResponse.json({ error: "Use a JPG, PNG, or WebP image." }, { status: 400 });
    }

    const bytes = Buffer.from(await image.arrayBuffer());
    const hasSignature = type.signature.every((byte, index) => bytes[index] === byte);
    const isWebp = image.type !== "image/webp" || bytes.toString("ascii", 8, 12) === "WEBP";
    if (!hasSignature || !isWebp) {
      return NextResponse.json({ error: "The selected file is not a valid image of that type." }, { status: 400 });
    }

    const fileName = `${randomUUID()}.${type.extension}`;
    const uploadDirectory = path.join(process.cwd(), "uploads");
    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(path.join(uploadDirectory, fileName), bytes, { flag: "wx" });

    return NextResponse.json({ image: `/api/menu/images/${fileName}` }, { status: 201 });
  } catch (error) {
    console.error("Failed to upload menu image:", error);
    return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
  }
}
