import { Link, Form, useRouteLoaderData } from "react-router-dom";
import LogInIcon from "@mui/icons-material/Login";
import HowtoRegIcon from "@mui/icons-material/HowToReg";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartRounded";

import MyDataButton from "../../buttonComponents/myDataButton";

import LogOutButton from "../../buttonComponents/LogOutButton";

export default function Navbar() {
  const  user  = useRouteLoaderData("root") as {id:number, role:string} | null;
  return (
    <nav className="bg-[#08415c] max-w-6xl mx-auto text-white  shadow-lg overflow-hidden  rounded-b-2xl w-full">
     
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          
          <div className="shrink-0 flex items-center">

          </div>
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <MyDataButton />
                <Form method="post" action="/logout">
                  <LogOutButton />
                </Form>
                 <Link to={"/cart"}><ShoppingCartIcon sx={{fontSize: 40}}/></Link>
              </>
            ) : (
              <>
                <Link to="/login" className="px-6 py-2.5 rounded-lg bg-[#435159] hover:bg-opacity-80 transition duration-200 border-transparent border-2 hover:border-white hover:font-bold">Belépés</Link>
                <Link to="/signup" className="px-5 py-2.5 rounded-lg bg-[#a1202b] hover:bg-red-700 transition duration-200 border-transparent border-2 hover:border-white hover:font-bold">Regisztráció</Link>
              </>
            )}
           
          </div>

        
          <div className="flex md:hidden items-center space-x-8">
            {user ? (
              <Link to={"/cart"} className="hover:text-gray-300"><ShoppingCartIcon fontSize="large"/></Link>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-300">
                  <LogInIcon fontSize="large" />
                </Link>
                <Link to="/signup" className="hover:text-gray-300">
                  <HowtoRegIcon fontSize="large" />
                </Link>
              </>
              
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}