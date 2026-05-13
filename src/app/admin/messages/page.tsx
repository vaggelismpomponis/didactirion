import { prisma } from "@/lib/prisma";
import MessagesListClient from "./MessagesListClient";

async function getMessages() {
  return await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <MessagesListClient messages={messages} />
  );
}
