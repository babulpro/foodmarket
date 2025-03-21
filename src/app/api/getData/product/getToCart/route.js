 
import { DecodedJwtToken } from "@/app/lib/component/authFunction/JwtHelper"
import dbConnect from "@/app/lib/db/db"
import { Cart, CartItem } from "@/app/lib/db/model/AllModel"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(req,res){
    try{
        await dbConnect()
        const cookieStore = await cookies()
        const token = cookieStore.get('token')
        const decoded = await DecodedJwtToken(token.value)
        const {id} =decoded;         
        const cart = await Cart.findOne({user:id})

        if(!cart){
            const cart = await Cart.create({user:id})

        }        

         const cartItems = await CartItem.find({cart:cart._id}).populate('product')

        return NextResponse.json({status:"ok",data:cartItems})


    }
    catch(e){
        return NextResponse.json({status:"fail",msg:e.message},{status:400})
    }
}