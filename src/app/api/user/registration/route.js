 
 
import { CreateJwtToken,DecodedJwtToken } from "@/app/lib/component/authFunction/JwtHelper";
import dbConnect from "@/app/lib/db/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { User } from "@/app/lib/db/model/AllModel";
 

export async function POST(req) {
  const data = await req.json();

  // Password hashing
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(data.password, salt);
  data.password = hash;
  let email= data.email

  await dbConnect();
  const user = await User.findOne({ email })
  if(!user){
      try {
        const newUser = await User.create({ ...data });
        const token = await CreateJwtToken(email)
        const response = NextResponse.json({ msg: "Registation successful", status: "ok" , data:newUser});
        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,   // HTTP-only flag to prevent access from JavaScript
            secure: true,  // Ensure secure cookies in production
            sameSite: 'strict',  // Protect against CSRF attacks
            path: '/',  // Cookie accessible throughout the application
            maxAge: 60 * 60 * 24 * 7  // Valid for one week
        });

        return response;

        
      } catch (error) {
        return NextResponse.json({ status: "false", msg: error.message }, { status: 400 });
      }

  }
  else{
    return NextResponse.json({ status: "false", msg: "already user" }, { status: 400 });
  }

}

 

 