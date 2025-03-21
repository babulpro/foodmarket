import { NextResponse } from "next/server";
import { NewsList } from "@/app/lib/db/model/AllModel";
import dbConnect from "@/app/lib/db/db";
 

export async function GET(req) {
    let { searchParams } = new URL(req.url);
    let query = searchParams.get("query"); // Get the search string

    await dbConnect();

    try {
        let result;
        
        if (query) {
            // Search by title (case-insensitive)
            result = await NewsList.find({ title: { $regex: query, $options: "i" } });
            return NextResponse.json({ status: "ok", data: result });
        } else {
            // Fetch all news if no filter is applied
            result = await NewsList.find({});
            return NextResponse.json({ status: "ok", data: result });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ status: "false", msg: error.message }, { status: 400 });
    }
}
