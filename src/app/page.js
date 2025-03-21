 
import MainNavbar from "@/lib/component/MainNavbar";
import PlainNavbar from "@/lib/component/PlainNavbar";
import { cookies } from "next/headers";
import Image from "next/image";

export default async function Home() {
     const cookieStore = await cookies()
      const token = cookieStore.get('token')
  return (
    <div>
             <MainNavbar/>
                    
          
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
     
       Hello babul you are going to build an e-connerce prject.thank you so much.
    </div>
    </div>
  );
}
