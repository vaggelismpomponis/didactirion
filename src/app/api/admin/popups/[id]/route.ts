import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, image, active, delay, duration } = body;

    // If this popup is being set to active, deactivate all other popups
    if (active) {
      await prisma.popup.updateMany({
        where: { 
          id: { not: id },
          active: true 
        },
        data: { active: false },
      });
    }

    const popup = await prisma.popup.update({
      where: { id },
      data: {
        title,
        content,
        image,
        active: !!active,
        delay: delay !== undefined ? Number(delay) : 2,
        duration: duration !== undefined ? Number(duration) : 10,
      },
    });

    return NextResponse.json(popup);
  } catch (error: any) {
    console.error("Popup Update API Error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      message: error?.message || String(error) 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.popup.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("Popup Delete API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
