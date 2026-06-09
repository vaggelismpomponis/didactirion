import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = parseInt(searchParams.get("offset") || "0");

    const [images, total] = await Promise.all([
      prisma.galleryImage.findMany({
        orderBy: { order: "asc" },
        take: limit,
        skip: offset,
      }),
      prisma.galleryImage.count(),
    ]);

    return NextResponse.json({ images, total });
  } catch (error) {
    console.error("GET Gallery Images Public Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
