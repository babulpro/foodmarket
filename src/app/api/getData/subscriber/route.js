import dbConnect from "@/app/lib/db/db";  
import { Subscriber } from "@/app/lib/db/model/AllModel";
import { NextResponse } from "next/server";


export async function POST(req,res){
    await dbConnect()
    try{
        let data = await req.json()
        let check = await Subscriber.find({...data})
        if(check.length>0){
            return NextResponse.json({status:"fail",msg:"already subscribed"})
        }
        let result = await Subscriber.create({...data})
        return NextResponse.json({status:"ok",data:result})

    }
    catch(e){
        return NextResponse.json({status:"fail",data:e})
    }
}

export async function GET(req) {
    await dbConnect();

    try {
        const heroes = await Subscriber.find({});
        return NextResponse.json({ status: "ok", data: heroes });  
    } catch (error) {
        return NextResponse.json({ status: "false", msg: error.message }, { status: 400 });
    }
}