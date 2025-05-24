import dbConnect from "@/app/lib/db/db";
import { FoodItem } from "@/app/lib/db/model/AllModel";
import { NextResponse } from "next/server";

 
export async function POST(req) {
  await dbConnect(); // Ensure DB connection

  try {
    const body = await req.json();
   
    const { name, description, price,image,category,stock}= body;

    if (!category) {
      return NextResponse.json({ status: "failed", msg: "Category ID is required" }, { status: 400 });
    }

    const product = {
      name,
      description,
      price,
      image,
      category,
      stock
    };
    const findItem = await FoodItem.findOne({name:name,category:category})
    
    if(findItem){
      return NextResponse.json({status:"fail",message:"already have the product"})
    }
     

    const result = await  FoodItem.create({...product});

    return NextResponse.json({ status: "success", data: result });
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json({ status: "error", msg: "Internal server error", details: error.message }, { status: 500 });
  }
}


export async function GET(req) {
    await dbConnect();

    try {
        const newsList = await Product.find({});
        return NextResponse.json({ status: "ok", data: newsList }); // Remove [0] to return all items
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ status: "false", msg: error.message }, { status: 400 });
    }
}
