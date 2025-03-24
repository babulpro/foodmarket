import AllProduct from "./lib/component/utilityCom/AllProduct";
import MainNavbar from "./lib/component/utilityCom/MainNavbar";
import { cookies } from 'next/headers'
import Navbar from "./lib/component/utilityCom/Navbar";
 

export default async function Home({children}) {
  const cookieStore =await cookies();
  const myCookie = cookieStore.get('token');
  
  

  return (
    <div> 
      {myCookie ?<Navbar/>:<MainNavbar/>}
      <AllProduct/>
    </div>
  );
}