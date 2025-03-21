import { Product } from "@/app/lib/db/model/AllModel"
import { NextResponse } from "next/server"

export async function GET(req) {
    let {searchParams}= new URL(req.url)
    let id = searchParams.get('id')
    try{
        const result = await Product.find({_id:id})
        return NextResponse.json({status:"ok" ,data:result})

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:e})
    }
}