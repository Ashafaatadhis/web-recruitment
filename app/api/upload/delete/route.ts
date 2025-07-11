import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { filePath } = await req.json();
    console.log(filePath, "SILIT");
    if (!filePath || typeof filePath !== "string") {
      return NextResponse.json(
        { status: "fail", message: "filePath is required" },
        { status: 400 }
      );
    }

    // Optional: remove leading slash, kalau backend tidak mengharapkan itu
    const parsedUrl = new URL(filePath);
    const normalizedPath = parsedUrl.pathname.replace(/^\/+/, "");

    const form = new FormData();
    form.append("FilePath", normalizedPath);

    const backendRes = await fetch(
      "https://be-brevet.tcugapps.com/api/v1/upload",
      {
        method: "DELETE",
        body: form,
      }
    );

    const result = await backendRes.json();

    if (!backendRes.ok) {
      throw new Error(result?.message || "Delete failed on backend");
    }

    return NextResponse.json({
      status: "success",
      message: "File deleted from CDN",
      ...result,
    });
  } catch (e) {
    console.error("Delete error:", e);
    return NextResponse.json(
      { status: "fail", error: `${e}` },
      { status: 500 }
    );
  }
}
