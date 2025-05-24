import AllProduct from "./lib/component/utilityCom/AllProduct";
import MainNavbar from "./lib/component/utilityCom/MainNavbar";
import { cookies } from 'next/headers'
import Navbar from "./lib/component/utilityCom/Navbar";
import Carousel from "./lib/component/Carousel";
 
export default async function Home({children}) {
  const cookieStore =await cookies();
  const myCookie = cookieStore.get('token');
  const images=['../images/succulentGrilledPrawns.jpg','./images/muttoncury.jpg','./images/beefSteak.jpg','./images/chickenTikka.jpg','./images/grilledSalmon.jpg','./images/muttonBiryani.jpeg','./images/friedChicken.jpeg','./images/smokyBeef.jpg','./images/freshgrilled.jpg'

  ]
  
 
  

  return (
    <div> 
      {myCookie ?<Navbar/>:<MainNavbar/>}
      <Carousel images={images}/> 
    </div>
  );
}