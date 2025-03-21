import dbConnect from "@/app/lib/db/db";
import { NewsList } from "@/app/lib/db/model/AllModel";
import { NextResponse } from "next/server";

 
export async function GET(req) {
    let {searchParams}= new URL(req.url)
    let id = searchParams.get('id')
    await dbConnect();

    try {
        const result= await NewsList.find({ _id: id })
        return NextResponse.json({ status: "ok", data: result }); // Remove [0] to return all items
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ status: "false", msg: error.message }, { status: 400 });
    }
}