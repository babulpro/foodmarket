import dbConnect from "@/app/Library/db/db";
import { Category } from "@/app/Library/db/model/AllModel";
import { NextResponse } from "next/server";

export async function POST(req,res){
    try{
        await dbConnect()
        const data = await req.json();
        const category = await Category.findOne({name:data.name})
        if(!category){
            let result = await Category.create({...data

            })
            return NextResponse.json({status:"success",data:result})
        }
        else{
            return NextResponse.json({status:"fail",msg:"already exist"})
        }
    

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:e})

    }
}

export async function GET(req,res){
    try{
        await dbConnect()
        let result = await Category.find({})
        return NextResponse.json({status:"success",data:result})

    }
    catch(e){
        return NextResponse.json({status:"fail",data:e})
    }
}