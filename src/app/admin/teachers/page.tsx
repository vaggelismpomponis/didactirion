export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { TeachersListClient } from "./TeachersListClient";

async function getTeachers() {
  return await prisma.teacher.findMany({ orderBy: { order: "asc" } });
}

export default async function AdminTeachersPage() {
  const teachers = await getTeachers();

  return <TeachersListClient initialTeachers={teachers} />;
}

