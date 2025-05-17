import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Ambil extension file
    const ext = path.extname(file.name);
    // Generate random string unik
    const randomStr = crypto.randomBytes(8).toString("hex");
    // Buat nama file baru: random + extension
    const uniqueFileName = `${randomStr}${ext}`;

    await fs.writeFile(`./public/uploads/${uniqueFileName}`, buffer);

    revalidatePath("/");

    return NextResponse.json({
      status: "success",
      url: `/uploads/${uniqueFileName}`,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: "fail", error: e });
  }
}
