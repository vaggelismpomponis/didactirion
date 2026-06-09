import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "30");
    const offset = parseInt(searchParams.get("offset") || "0");

    const [stories, total] = await Promise.all([
      prisma.successStory.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.successStory.count(),
    ]);

    return NextResponse.json({ stories, total });
  } catch (error) {
    console.error("GET Success Stories Public Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
