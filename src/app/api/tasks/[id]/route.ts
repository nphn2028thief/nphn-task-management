import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { tasks } from "@/drizzle/schema";

async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ errorMessage: "Unauthorized!", status: 401 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({
        errorMessage: "Task is invalid!",
        status: 400,
      });
    }

    const { title, description, date, isImportant, isCompleted } =
      await req.json();

    const updatedTask = await db
      .update(tasks)
      .set({
        title,
        description,
        date,
        isCompleted,
        isImportant,
        userId,
      })
      .where(sql`${tasks.id} = ${id}`);

    // .tasks.update({
    //   data: {
    //     title,
    //     description,
    //     date,
    //     isCompleted,
    //     isImportant,
    //     userId,
    //   },
    //   where: {
    //     id,
    //   },
    // });
    return NextResponse.json({ data: updatedTask, status: 200 });
  } catch (error) {
    console.error("Edit task error: ", error);
    return NextResponse.json({
      errorMessage: "Edit task failed!",
      status: 500,
    });
  }
}

async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ errorMessage: "Unauthorized!", status: 401 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({
        errorMessage: "Task is invalid!",
        status: 400,
      });
    }

    const deletedTask = await db.delete(tasks).where(sql`${tasks.id} = ${id}`);

    // prismaClient.tasks.delete({
    //   where: {
    //     id,
    //   },
    // });
    return NextResponse.json({ data: deletedTask, status: 200 });
  } catch (error) {
    console.error("Delete task error: ", error);
    return NextResponse.json({
      errorMessage: "Delete task failed!",
      status: 500,
    });
  }
}

export { PATCH, DELETE };
