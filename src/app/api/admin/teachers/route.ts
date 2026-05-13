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
    const { name, specialty, bio, photo, order } = body;

    const teacher = await prisma.teacher.create({
      data: {
        name,
        specialty,
        bio,
        photo,
        order: parseInt(order) || 0,
      },
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    console.error("Teacher API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
