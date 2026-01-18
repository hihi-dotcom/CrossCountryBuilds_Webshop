import { Link, Form, useRouteLoaderData, useLocation } from "react-router-dom";
import LogInIcon from "@mui/icons-material/Login";
import LogOutIcon from "@mui/icons-material/Logout";
import HowtoRegIcon from "@mui/icons-material/HowToReg";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartRounded";
import MyDataButton from "../../buttonComponents/myDataButton";
import LogOutButton from "../../buttonComponents/LogOutButton";
import { useCart } from "../../custom_hooks/CartContext";

export default function Navbar() {
  const user = useRouteLoaderData("root") as { id: number; role: string } | null;
  const { cartItems } = useCart();
  const location = useLocation();

  
  const isOrderFlow = ["/cart", "/orderdata"].includes(location.pathname);
  const isOrderEnd = location.pathname === "/orderend";
  const isOnCart = location.pathname === "/cart" || location.pathname === "/appointment";
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-[#08415c] max-w-6xl mx-auto text-white shadow-lg overflow-hidden rounded-b-2xl w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

 
          <div className="shrink-0 flex items-center">
            

          </div>
    
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>

                {!isOrderFlow  && (
                  <div className="flex items-center space-x-4">
                    <MyDataButton />
                    <Form method="post" action="/logout">
                      <LogOutButton />
                    </Form>
                  </div>
                )}


                {!isOrderEnd && !isOnCart &&  (
                  <Link to="/cart" className="relative p-2 transition-transform hover:scale-110">
                    <ShoppingCartIcon sx={{ fontSize: 40 }} />
                    {totalItems > 0 && (
                      <span className="absolute top-0 right-0 text-white text-base font-bold drop-shadow-md">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="px-6 py-2.5 rounded-lg bg-[#435159] hover:bg-opacity-80 transition duration-200 border-transparent border-2 hover:border-white hover:font-bold">
                  Belépés
                </Link>
                <Link to="/signup" className="px-5 py-2.5 rounded-lg bg-[#a1202b] hover:bg-red-700 transition duration-200 border-transparent border-2 hover:border-white hover:font-bold">
                  Regisztráció
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center space-x-6">
            {user ? (
              <>
                {!isOrderEnd && !isOnCart && (
                <Link to="/cart" className=" p-1 relative">
                  <ShoppingCartIcon fontSize="large" />
                  {totalItems > 0 && (
                    <span className="absolute top-0 text-white text-base font-bold drop-shadow-md">
                      {totalItems}
                    </span>
                  )}
                </Link>)}
                {!isOrderFlow && (
                  <Form method="post" action="/logout">
                    <LogOutIcon/>
                  </Form>
                )}
              </>
              

              
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/login" className="hover:text-gray-300">
                  <LogInIcon fontSize="large" />
                </Link>
                <Link to="/signup" className="hover:text-gray-300">
                  <HowtoRegIcon fontSize="large" />
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}