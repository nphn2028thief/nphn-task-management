import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { asc, sql } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { tasks } from "@/drizzle/schema";

async function POST(req: Request, res: Response) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ errorMessage: "Unauthorized!", status: 401 });
    }

    const { title, description, date, isImportant } = await req.json();

    if (!title || !date) {
      return NextResponse.json({ errorMessage: "Bad request", status: 400 });
    }

    const newTask = await db
      .insert(tasks)
      .values({
        title,
        description,
        date,
        isCompleted: false,
        isImportant,
        userId,
      })
      .returning();
    return NextResponse.json({ data: newTask, status: 201 });
  } catch (error) {
    console.error("Create task: ", error);
    return NextResponse.json({
      errorMessage: "Create task failed!",
      status: 500,
    });
  }
}

async function GET(req: Request, res: Response) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ errorMessage: "Unauthorized!", status: 401 });
    }

    const allTasks = await db
      .select()
      .from(tasks)
      .where(sql`${tasks.userId} = ${userId}`)
      .orderBy(asc(tasks.createdAt));
    return NextResponse.json({ data: allTasks, status: 200 });
  } catch (error) {
    console.error("Get tasks error: ", error);
    return NextResponse.json({
      errorMessage: "Get tasks failed!",
      status: 500,
    });
  }
}

export { POST, GET };
