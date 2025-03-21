import { Product } from "@/app/lib/db/model/AllModel"
import { NextResponse } from "next/server"

export async function GET(req) {
    try{
        const result = await Product.find({})
        return NextResponse.json({status:"ok" ,data:result})

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:e})
    }
}