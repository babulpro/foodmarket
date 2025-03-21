 
import { CreateJwtToken } from "@/app/Library/Auth/authFunction/JwtHelper";
import dbConnect from "@/app/Library/db/db";
import { User } from "@/app/Library/db/model/AllModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
 


export async function POST(req) {
    const data = await req.json();
    data.otp="0"
  
    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);
    data.password = hash;
  
    await dbConnect();
  
    const user = await User.findOne({ email:data.email })
    if(!user){
        try {
          const newUser = await User.create({ ...data });
          const token = await CreateJwtToken(newUser.email,newUser._id)
          const response = NextResponse.json({ status: "success",data:newUser });
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
  

export async function GET(req,res) {
     await dbConnect()
     try{
      let result = await User.find({})
      return NextResponse.json({status:"success",data:result})

     }
     catch(e){
      return NextResponse.json({status:"fail",data:e})
     }

    
}