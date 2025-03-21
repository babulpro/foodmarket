 
import { NextResponse } from "next/server";
import { CheckCookies } from "./app/Library/Auth/authFunction/CheckMiddleware";
 


export   function middleware(req,res,next){
  if(req.nextUrl.pathname.startsWith("/dashboard")){
      return CheckCookies(req)
     
   }
   return NextResponse.next()
      
}
 


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};