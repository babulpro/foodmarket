 
import { DecodedJwtToken } from "@/app/lib/component/authFunction/JwtHelper"
import dbConnect from "@/app/lib/db/db"
import { Cart, CartItem } from "@/app/lib/db/model/AllModel"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req,res){
    try{
        await dbConnect()
        const cookieStore = await cookies()
        const token = cookieStore.get('token')
        const decoded = await DecodedJwtToken(token.value)
        const {id} =decoded;        
        const data =await req.json()
        const cart = await Cart.findOne({user:id,items:[]})

        if(!cart){
            const cart = await Cart.create({user:id})

        }

        let cartItems = await CartItem.findOne({product:data.product,cart:cart._id})
        if(cartItems){
            cartItems.quantity=data.quantity
            await cartItems.save()
        }

         else{
             cartItems = await CartItem.create({cart:cart._id,...data})}

        return NextResponse.json({status:"success",data:cartItems})


    }
    catch(e){
        return NextResponse.json({status:"fail",msg:e.message},{status:400})
    }
}