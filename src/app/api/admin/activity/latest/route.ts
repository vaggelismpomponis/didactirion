import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [post, teacher, message, popup, success] = await Promise.all([
      prisma.post.findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
      prisma.teacher.findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
      prisma.contactMessage.findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
      prisma.popup.findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
      prisma.successStory.findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
    ]);

    const dates = [
      post?.createdAt,
      teacher?.createdAt,
      message?.createdAt,
      popup?.createdAt,
      success?.createdAt,
    ].filter(Boolean) as Date[];

    if (dates.length === 0) {
      return NextResponse.json({ latestTimestamp: 0 });
    }

    const latest = Math.max(...dates.map(d => d.getTime()));
    return NextResponse.json({ latestTimestamp: latest });
  } catch (error) {
    console.error("Latest Activity API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
