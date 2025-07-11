import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const location = formData.get("location") as string;

    if (!file) {
      return NextResponse.json(
        { status: "fail", message: "No file uploaded" },
        { status: 400 }
      );
    }

    const proxyForm = new FormData();
    proxyForm.append("file", file);
    proxyForm.append("location", "winnicode/" + location); // sesuai format backend-mu

    const uploadRes = await fetch(
      "https://be-brevet.tcugapps.com/api/v1/upload/images",
      {
        method: "POST",
        body: proxyForm,
      }
    );

    const result = await uploadRes.json();

    if (!uploadRes.ok) {
      throw new Error(result?.message || "Upload failed");
    }

    return NextResponse.json({
      status: "success",
      url: result.data, // Pastikan backend return { url: "https://cdn.tcugapps.com/..." }
    });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json(
      { status: "fail", error: `${e}` },
      { status: 500 }
    );
  }
}
