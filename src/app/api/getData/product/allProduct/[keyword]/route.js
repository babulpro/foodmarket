 
import dbConnect from "@/app/lib/db/db";
import { FoodItem } from "@/app/lib/db/model/AllModel";
import { NextResponse } from "next/server";
 
export async function GET(req,{params}) {
    
    const {keyword} =await params;
    
    await dbConnect();

    try {
        const newsList = await FoodItem.find({category:keyword});
        
        return NextResponse.json({ status: "ok", data: newsList }); // Remove [0] to return all items
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ status: "false", msg: error.message }, { status: 400 });
    }
}