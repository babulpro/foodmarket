 
import {DecodedJwtToken } from "@/app/lib/component/authFunction/JwtHelper";
import dbConnect from "@/app/lib/db/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Comment } from "@/app/lib/db/model/AllModel";

 
 


export async function POST(req) {
    
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
    let data =await req.json();
    data.userID=decoded?.id;
    let result = await Comment.find({userID:data.userID,postID:data.postID});
    if(result.length>0){

        return NextResponse.json({ status: "ok", msg:"already commented" }, { status: 200 });
    }
    let newresult = await Comment.create({...data})  
     
      return NextResponse.json({ status: "ok", msg: newresult}, { status: 404 });
    } 
    catch (error) {
    return NextResponse.json({ status: "error", msg: error.message }, { status: 500 });
  }
}


export async function GET(req) {
    
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
   
    let result = await Comment.find({userID:decoded?.id}).populate('postID'); ;
    if(result.length>0){

        return NextResponse.json({ status: "success", data:result }, { status: 200 });
    }
   
     
      return NextResponse.json({ status: "success", msg: "no comments yet"}, { status: 404 });
    } 
    catch (error) {
    return NextResponse.json({ status: "error", msg: error.message }, { status: 500 });
  }
}