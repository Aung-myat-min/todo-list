import { NextRequest, NextResponse } from "next/server";
import { read } from "./read";
import { write } from "./write";
import { updateOrder } from "./update";

export async function GET() {
  try {
    const todos = await read();
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json("Error", {
      status: 500,
      statusText: "Error reading todo items from the database.",
    });
  }
}

export async function POST(req: Request) {
  const todo = await req.json();

  try {
    await write(todo);
    return NextResponse.json({ success: true, todo });
  } catch (error) {
    return NextResponse.json("Error", {
      status: 500,
      statusText: "Error adding todo item to the database.",
    });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, sort_order } = await req.json();
    console.log(id, sort_order);
    if (!id || !sort_order) {
      return NextResponse.json("Not Found", {
        status: 400,
        statusText: "Both id and order must be provided in the request body",
      });
    }

    await updateOrder(id, sort_order);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in PUT route:", error.message);
    return NextResponse.json("Error", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
