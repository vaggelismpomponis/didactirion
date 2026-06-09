import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Add a single gallery image
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { url, title, aspect, order } = body;

    if (!url || !title || !aspect) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const galleryImage = await prisma.galleryImage.create({
      data: {
        url,
        title,
        aspect,
        order: parseInt(order) || 0,
      },
    });

    try {
      revalidatePath("/organization/gallery");
    } catch (e) {
      console.warn("Revalidation error:", e);
    }

    return NextResponse.json(galleryImage, { status: 201 });
  } catch (error) {
    console.error("POST Gallery Image Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Bulk update gallery images metadata (title, aspect, order)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { images } = body; // Array of { id, title, aspect, order }

    if (!Array.isArray(images)) {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    // Perform updates in a transaction
    const updates = images.map((img) =>
      prisma.galleryImage.update({
        where: { id: img.id },
        data: {
          title: img.title,
          aspect: img.aspect,
          order: parseInt(img.order) || 0,
        },
      })
    );

    await prisma.$transaction(updates, {
      timeout: 30000,
    });

    try {
      revalidatePath("/organization/gallery");
    } catch (e) {
      console.warn("Revalidation error:", e);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT Gallery Images Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Delete a single gallery image
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id parameter required" }, { status: 400 });
    }

    await prisma.galleryImage.delete({
      where: { id },
    });

    try {
      revalidatePath("/organization/gallery");
    } catch (e) {
      console.warn("Revalidation error:", e);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE Gallery Image Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
