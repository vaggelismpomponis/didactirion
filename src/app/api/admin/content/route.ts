import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageKey = searchParams.get("pageKey");
  if (!pageKey) {
    return NextResponse.json({ error: "pageKey required" }, { status: 400 });
  }
  try {
    const row = await prisma.pageContent.findUnique({ where: { pageKey } });
    return NextResponse.json({ content: row?.content ?? null });
  } catch (err) {
    console.error("[content GET]", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { pageKey, content } = body;
  if (!pageKey || !content) {
    return NextResponse.json({ error: "pageKey and content required" }, { status: 400 });
  }
  try {
    const row = await prisma.pageContent.upsert({
      where: { pageKey },
      update: { content, updatedBy: session.user.email ?? undefined },
      create: { pageKey, content, updatedBy: session.user.email ?? undefined },
    });
    return NextResponse.json({ ok: true, updatedAt: row.updatedAt });
  } catch (err) {
    console.error("[content PUT]", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
