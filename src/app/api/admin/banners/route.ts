import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, image, link, active, order } = body;

    const banner = await prisma.banner.create({
      data: {
        title,
        image,
        link,
        active: !!active,
        order: parseInt(order) || 0,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Banner API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
