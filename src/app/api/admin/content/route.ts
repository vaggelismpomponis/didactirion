import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
  if (!pageKey) {
    return NextResponse.json({ error: "pageKey required" }, { status: 400 });
  }

  // Strip empty strings — they mean "use default", so no need to store them
  function cleanContent(obj: Record<string, any>): Record<string, any> {
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === "string" && val.trim() === "") continue;
      if (val != null && typeof val === "object" && !Array.isArray(val)) {
        const sub = cleanContent(val);
        if (Object.keys(sub).length > 0) cleaned[key] = sub;
      } else {
        cleaned[key] = val;
      }
    }
    return cleaned;
  }

  const cleaned = content ? cleanContent(content) : {};
  try {
    const row = await prisma.pageContent.upsert({
      where: { pageKey },
      update: { content: cleaned, updatedBy: session.user.email ?? undefined },
      create: { pageKey, content: cleaned, updatedBy: session.user.email ?? undefined },
    });

    try {
      if (pageKey === "gallery") {
        revalidatePath("/organization/gallery");
      } else if (pageKey === "home") {
        revalidatePath("/");
      } else if (pageKey === "teachers-header") {
        revalidatePath("/organization/teachers");
      } else if (pageKey === "success-header") {
        revalidatePath("/organization/success-stories");
      } else if (pageKey === "announcements-header") {
        revalidatePath("/announcements");
      } else if (pageKey.startsWith("curricula/")) {
        revalidatePath(`/curricula/${pageKey.split("/")[1]}`);
      } else if (pageKey.startsWith("exams/")) {
        revalidatePath(`/exams/${pageKey.split("/")[1]}`);
      } else {
        revalidatePath(`/${pageKey}`);
      }
    } catch (revalErr) {
      console.warn("[content PUT] revalidation error", revalErr);
    }

    return NextResponse.json({ ok: true, updatedAt: row.updatedAt });
  } catch (err) {
    console.error("[content PUT]", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
