import AllProduct from "./lib/component/utilityCom/AllProduct";
import MainNavbar from "./lib/component/utilityCom/MainNavbar";
import { cookies } from 'next/headers'
import Navbar from "./lib/component/utilityCom/Navbar";
 
const getData = async ()=>{
  try{
    const response= await fetch("http://localhost:3000/api/getData/product/getProduct",{cache:"force-cache"});
    const data = await response.json()
    return data.data

  }
  catch(e){
    return []

  }
}
export default async function Home({children}) {
  const cookieStore =await cookies();
  const myCookie = cookieStore.get('token');
  const data = await getData()
 
  

  return (
    <div> 
      {myCookie ?<Navbar/>:<MainNavbar/>}
      <AllProduct data={data}/>
    </div>
  );
}