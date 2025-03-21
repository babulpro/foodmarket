 

import dbConnect from "@/app/lib/db/db";
import { NextResponse } from "next/server";
import { User } from "@/app/lib/db/model/AllModel";

 
export async function GET(req) {
  await dbConnect();

  try {
    const users = await User.find({});
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ status: "error", msg: error.message }, { status: 400 });
  }
}

 