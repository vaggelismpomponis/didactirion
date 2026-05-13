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
    const { name, university, faculty, year, photo } = body;

    const story = await prisma.successStory.create({
      data: {
        name,
        university,
        faculty,
        year: parseInt(year),
        photo,
      },
    });

    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error("Success Story API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const stories = await prisma.successStory.findMany({
      orderBy: { year: "desc" },
    });
    return NextResponse.json(stories);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
