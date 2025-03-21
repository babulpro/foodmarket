import dbConnect from "@/app/lib/db/db";
import { Comment } from "@/app/lib/db/model/AllModel";
import { NextResponse } from "next/server";

export async function GET(req,res){
    let {searchParams}= new URL(req.url)
    let id = searchParams.get('id')
    try{
        await dbConnect();
        let result= await Comment.find({ postID: id })
        if(!result) return NextResponse.json({status:"fail",data:"No data found"})
        return NextResponse.json({status:"ok",data:result})
    }
    catch(error){
        return NextResponse.json({status:"fail",data:error})
    }
}