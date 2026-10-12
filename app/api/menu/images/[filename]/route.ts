// FAMZI FILE GUIDE: Serves validated uploaded menu images from local persistent storage.
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const imageTypes: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  if (!/^[0-9a-f-]{36}\.(jpg|png|webp)$/.test(filename)) {
    return new Response("Not found.", { status: 404 });
  }

  const extension = filename.split(".").at(-1)!;
  try {
    const image = await readFile(path.join(process.cwd(), "uploads", filename));
    return new Response(Uint8Array.from(image), {
      headers: {
        "Content-Type": imageTypes[extension],
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found.", { status: 404 });
  }
}
