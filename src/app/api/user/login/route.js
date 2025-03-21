 
import dbConnect from "@/app/Library/db/db";
import { User } from "@/app/Library/db/model/AllModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { CreateJwtToken } from "@/app/Library/Auth/authFunction/JwtHelper";
import { cookies } from "next/headers";
 


export async function POST(req) {
    const data = await req.json();
    await dbConnect();
  
    const user = await User.findOne({ email:data.email })
    if(user){
      const match = await bcrypt.compare(data.password, user.password);
      if(match){
        const token = await CreateJwtToken(user.email,user._id)
        const response = NextResponse.json({status:"success",data:token})
        response.cookies.set({
          name:'token',
          value:token,
          httpOnly:true,
          secure:true,
          sameSite:"strict",
          path:"/",
          maxAge:60*60*24*7
        });
        return response
      }
    }
    else{
      return NextResponse.json({ status: "false", msg: "already user" }, { status: 400 });
    }
  
  }
  

  export async function GET(req) {
      cookies().delete('token')
      return NextResponse.json({ msg:"request Completed",status:"success"})   
        
  }