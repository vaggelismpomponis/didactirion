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
    const { title, content, image, active } = body;

    // If this popup is set to active, deactivate all other popups
    if (active) {
      await prisma.popup.updateMany({
        where: { active: true },
        data: { active: false },
      });
    }

    const popup = await prisma.popup.create({
      data: {
        title,
        content,
        image,
        active: !!active,
      },
    });

    return NextResponse.json(popup, { status: 201 });
  } catch (error) {
    console.error("Popup API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const popups = await prisma.popup.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(popups);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
