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
    const { stories } = body;

    if (!Array.isArray(stories) || stories.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Format the payload
    const formattedStories = stories.map((s: any) => ({
      name: s.name.trim(),
      university: s.university.trim(),
      photo: null, // default to no photo
    }));

    // Create many records in a single database transaction
    const result = await prisma.successStory.createMany({
      data: formattedStories,
    });

    return NextResponse.json({ success: true, count: result.count }, { status: 201 });
  } catch (error) {
    console.error("Success Story Bulk API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
