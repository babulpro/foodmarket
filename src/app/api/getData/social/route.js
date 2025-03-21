import dbConnect from "@/app/lib/db/db";  
import { Social } from "@/app/lib/db/model/AllModel";
import { NextResponse } from "next/server";


export async function POST(req,res){
    try{
        await dbConnect()
        let data = await req.json()
        let result = await Social.create({...data})
        return NextResponse.json({status:"success", data:result}) 

    }
    catch(e){
        return NextResponse.json({status:"fail",data:e})
    }
}

 

export async function GET(req) {
    await dbConnect();

    try {
        const heroes = await Social.find({});
        return NextResponse.json({ status: "ok", data: heroes });  
    } catch (error) {
        return NextResponse.json({ status: "false", msg: error.message }, { status: 400 });
    }
}
