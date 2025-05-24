 
import { cookies } from 'next/headers';
 
import { NextResponse } from "next/server";
import  bcrypt  from 'bcrypt';
import { CreateJwtToken } from "@/app/lib/component/authFunction/JwtHelper";
import { User } from '@/app/lib/db/model/AllModel';
import dbConnect from '@/app/lib/db/db';

export async function POST(req, res) {
    const data = await req.json();    
    const email = data.email;
    await dbConnect(); 

    try {
        if (!email) {
            return NextResponse.json({ msg: "Invalid email" }, { status: 400 });
        } 
        const user = await User.findOne({ email });
        

        if (!user) {
            return NextResponse.json({ msg: "Invalid email or password", status: "false" }, { status: 404 });
        }

        const match = await bcrypt.compare(data.password, user.password);

        if (!match) {
            return NextResponse.json({ msg: "Invalid email or password", status: "false" }, { status: 404 });
        }
        
        const token = await CreateJwtToken(user.email,user._id.toString());
        const response = NextResponse.json({ msg: "Login successful",data:user.data, status: "ok" });
        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,   
            secure: true,  
            sameSite: 'strict', 
            path: '/',  
            maxAge: 60 * 60 * 24 * 7 
        });

        return response;

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



export async function DELETE(req) {
    cookies().delete('token')
    return NextResponse.json({
        msg:"request Completed",status:"ok"
    })   
      
}

//  export async function GET() {
//   try {
//     await dbConnect();

//     const cookieStore = cookies();
//     const token = cookieStore.get("token");

//     if (!token) {
//       return NextResponse.json(
//         { status: "fail", message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const decoded = await DecodedJwtToken(token.value);
//     const { id: userId } = decoded;

//     // ✅ Populate name, price, imageUrl for each foodItem in the order
//     const user = await user.find({ user: userId })
     

//     return NextResponse.json({
//       status: "success", 
//       data: user,
//     });
//   } catch (error) {
//     console.error("Order Fetch Error:", error);
//     return NextResponse.json(
//       {
//         status: "error",
//         message: error.message,
//         ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
//       },
//       { status: 500 }
//     );
//   }
// }
