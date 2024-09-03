import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

import { db } from "@/database/db";
import { trees } from "@/database/schema";

async function POST(req: Request, res: Response) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ errorMessage: "Unauthorized!", status: 401 });
    }

    const { name, type, fileType, level, isOpen, parentId, children } =
      await req.json();

    if (!name || !type || !level) {
      return NextResponse.json({ errorMessage: "Bad request", status: 400 });
    }

    const newTree = await db.insert(trees).values({
      name,
      type,
      fileType,
      level,
      isOpen,
      parentId,
      userId,
    });

    // prismaClient.trees.create({
    //   data: {
    //     name,
    //     type,
    //     fileType,
    //     level,
    //     isOpen,
    //     parentId,
    //     children: {
    //       create: [],
    //     },
    //     userId,
    //   },
    // });
    return NextResponse.json({ data: newTree, status: 201 });
  } catch (error) {
    console.error("Create tree: ", error);
    return NextResponse.json({
      errorMessage: "Create tree failed!",
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

    const allRootTrees = await db
      .select()
      .from(trees)
      .where(sql`${trees.userId} = ${userId} AND ${trees.parentId} IS NULL`);

    return NextResponse.json({ data: allRootTrees, status: 200 });
  } catch (error) {
    console.error("Get trees error: ", error);
    return NextResponse.json({
      errorMessage: "Get trees failed!",
      status: 500,
    });
  }
}

export { POST, GET };
