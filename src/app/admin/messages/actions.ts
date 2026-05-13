"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteMessage(id: string) {
  try {
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete message:", error);
    return { success: false, error: "Αποτυχία διαγραφής" };
  }
}

export async function toggleMessageReadStatus(id: string, isRead: boolean) {
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Failed to update message status:", error);
    return { success: false, error: "Αποτυχία ενημέρωσης κατάστασης" };
  }
}
