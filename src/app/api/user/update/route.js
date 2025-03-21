 
 
import {DecodedJwtToken } from "@/app/lib/component/authFunction/JwtHelper";
import dbConnect from "@/app/lib/db/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { User } from "@/app/lib/db/model/AllModel";

 
 


export async function PUT(req) {
    
  await dbConnect();
 
  const token =await cookies().get('token');
  if (!token) {
    return NextResponse.json({ status: "false", msg: "Unauthorized" }, { status: 401 });
  }
  const decoded =await DecodedJwtToken(token.value);
  const email = decoded?.email;
  if (!email) {
    return NextResponse.json({ status: "false", msg: "Invalid token" }, { status: 400 });
  }

  try {
    const { firstName, lastName,mobile, password } = await req.json()
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (mobile) updateData.mobile = mobile;
    if (password) updateData.password = password;
    
    const user = await User.findOneAndUpdate(
      { email }, // Find user by email
      { $set: updateData }, // Only update provided fields
      { new: true, runValidators: true }
    )
    if (!user) {
      return NextResponse.json({ status: "false", msg: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "ok", msg: "Address updated successfully", user });
  } catch (error) {
    return NextResponse.json({ status: "error", msg: error.message }, { status: 500 });
  }
}