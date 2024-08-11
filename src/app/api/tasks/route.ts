import prismaClient from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

    const task = await prismaClient.task.create({
      data: {
        title,
        description,
        date,
        isCompleted: false,
        isImportant,
        userId,
      },
    });
    return NextResponse.json({ data: task, status: 201 });
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

    const tasks = await prismaClient.task.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        isCompleted: true,
        isImportant: true,
        userId: false,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return NextResponse.json({ data: tasks, status: 200 });
  } catch (error) {
    console.error("Get task error: ", error);
    return NextResponse.json({ errorMessage: "Get task failed!", status: 500 });
  }
}

export { POST, GET };
