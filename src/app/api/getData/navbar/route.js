 
 
 
import dbConnect from "@/app/lib/db/db";
import { Category } from "@/app/lib/db/model/AllModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnect();
    try{
        const data = await req.json(); 
        const category = await Category.create({ ...data });
        return NextResponse.json({ status: "ok", data: category });
    }
    catch(e){
        return NextResponse.json({ status: "error", msg: e.message }, { status: 400 });
    }
}


export async function GET(req) {
    await dbConnect();

    try {
        const heroes = await Category.find({});
        return NextResponse.json({ status: "success", data: heroes});
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ status: "false", msg: error.message }, { status: 400 });
    }
}
