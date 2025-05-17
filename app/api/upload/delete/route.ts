import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    const filePath = path.join(process.cwd(), "public", url);

    await fs.unlink(filePath);

    return NextResponse.json({ status: "success", ok: true }, { status: 200 });
  } catch (e) {
    console.error("Error deleting file:", e);
    return NextResponse.json(
      { status: "fail", error: e, ok: false },
      { status: 500 }
    );
  }
}
