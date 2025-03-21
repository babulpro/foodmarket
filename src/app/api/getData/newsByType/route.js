import { NextResponse } from "next/server";
import { NewsList } from "@/app/lib/db/model/AllModel";
import dbConnect from "@/app/lib/db/db";
 

export async function GET(req) {
    let { searchParams } = new URL(req.url);
    let query = searchParams.get("type"); // Get the search string

    await dbConnect();

    try {
        
        
        if (query) {
            // Search by title (case-insensitive)
           const result = await NewsList.find({ type:query });
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
