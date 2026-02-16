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

  const isOrderFlow = ["/cart", "/orderdata"].includes(location.pathname.toLowerCase());
  const isOrderEnd = location.pathname.toLowerCase() === "/orderend";
  const isOnCart = location.pathname.toLowerCase() === "/cart";

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  
  const CartIconButton = ({ size }: { size: number }) => (
    (!isOrderEnd && !isOnCart) ? (
      <Link to="/cart" className="relative p-2 transition-transform hover:scale-110 flex items-center">
        <ShoppingCartIcon sx={{ fontSize: size }} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full drop-shadow-md">
            {totalItems}
          </span>
        )}
      </Link>
    ) : null
  );

  return (
    <nav className="bg-[#08415c] max-w-6xl mx-auto text-white shadow-lg overflow-hidden rounded-b-2xl w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          
          <div className="shrink-0 flex items-center">
            <Link to="/" className="flex items-center group no-underline">
               <div className="flex items-center italic font-black uppercase text-lg md:text-2xl">
                <span className=" text-white">Cross</span>
                <span className="text-[#a1202b] ml-1">Country</span>
                <span className="hidden md:flex ml-2 text-sm not-italic lowercase tracking-widest text-white self-end mb-1 font-bold">builds</span>
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <MyDataButton />
                <Form method="post" action="/logout">
                  <LogOutButton />
                </Form>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="px-6 py-2.5 rounded-lg bg-[#435159] hover:bg-opacity-80 border-2 border-transparent hover:border-white hover:font-bold transition font-normal">Belépés</Link>
                <Link to="/signup" className="px-5 py-2.5 rounded-lg bg-[#a1202b] hover:bg-red-700 border-2 border-transparent hover:border-white hover:font-bold transition font-normal">Regisztráció</Link>
              </div>
            )}
            <CartIconButton size={40} />
          </div>

          
          <div className="flex md:hidden items-center space-x-4 ml-auto">
            <CartIconButton size={35} />

            {user ? (
              <Form method="post" action="/logout">
                <button type="submit" className="bg-[#cc2936] py-2 rounded-xl px-2 text-white">
                  <LogOutIcon sx={{ fontSize: 30 }} />
                </button>
              </Form>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login"><LogInIcon fontSize="large" /></Link>
                <Link to="/signup"><HowtoRegIcon fontSize="large" /></Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}