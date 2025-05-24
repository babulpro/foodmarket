 
 
import { NextResponse } from "next/server";
 ;
import { cookies } from "next/headers";
 
import dbConnect from "@/app/lib/db/db";
import { User } from "@/app/lib/db/model/AllModel";
import { DecodedJwtToken } from "@/app/lib/component/authFunction/JwtHelper";

 
export async function GET(req) {
  await dbConnect();

  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')
     const decoded = await DecodedJwtToken(token.value)
     if (!decoded?.id) {
                 return NextResponse.json(
                     { status: "fail", message: "Invalid token" },
                     { status: 401 }
                 )
             }

    const users = await User.find({_id:decoded.id});
    return NextResponse.json({status:"success",data:users});
  } catch (error) {
    return NextResponse.json({ status: "error", msg: error.message }, { status: 400 });
  }
}

 