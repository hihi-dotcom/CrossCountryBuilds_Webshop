import { Link, Form, useRouteLoaderData, useLocation } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Button, Badge } from "flowbite-react";
import { HiShoppingCart, HiLogin, HiUserAdd, HiLogout } from "react-icons/hi";
import { useCart } from "../../custom_hooks/CartContext";

export default function NavbarComponent() {
  const user = useRouteLoaderData("root") as { id: number; role: string; username?: string } | null;
  const { cartItems } = useCart();
  const location = useLocation();

  const isOrderFlow = ["/cart", "/orderdata"].includes(location.pathname.toLowerCase());
  const isOrderEnd = location.pathname.toLowerCase() === "/orderend";
  const isOnCart = location.pathname.toLowerCase() === "/cart";
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Navbar fluid className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
    {isOrderFlow ? (
      <div className="flex items-center">
        <NavbarBrand as="div">
            <span className="self-center whitespace-nowrap italic font-black uppercase text-xl md:text-2xl text-white">
              Cross<span className="text-blue-500">Country</span>
            </span>
        </NavbarBrand>
      </div>
    ) : (
      <Link to="/">
        <NavbarBrand as="div">
          <span className="self-center whitespace-nowrap italic font-black uppercase text-xl md:text-2xl text-white">
            Cross<span className="text-blue-500">Country</span>
          </span>
        </NavbarBrand>
      </Link>
    )}

      <div className="flex md:order-2 items-center gap-2">
        {!isOrderEnd && !isOnCart && (
          <Link to="/cart" className="relative p-2 text-white hover:text-blue-500 transition-colors mr-1">
            <HiShoppingCart size={28} />
            {totalItems > 0 && (
              <Badge color="failure" size="xs" className="absolute top-0 right-0 px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                {totalItems}
              </Badge>
            )}
          </Link>
        )}

        
        {!isOrderFlow && (
          user ? (
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline-flex text-sm font-medium text-white">{user.username}</span>
              <Form method="post" action="/logout">
                <Button color="failure" size="sm" type="submit" pill>
                  <HiLogout className="h-5 w-5 text-white " />
                </Button>
              </Form>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/login" className="hidden sm:block">
                <Button color="gray" size="xs" className="border-none" as="div">
                  <HiLogin className="sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Belépés</span>
                </Button>
              </Link>
              <Link to="/signup">
                <Button color="blue" size="xs" as="div">
                  <HiUserAdd className="sm:mr-2 h-5 w-5" /> <span className="hidden sm:inline">Regisztráció</span>
                </Button>
              </Link>
            </div>
          )
        )}
        <NavbarToggle className="ml-1" />
      </div>

     
    {!isOrderFlow  && !isOrderEnd  &&(
      <NavbarCollapse className="bg-white md:bg-transparent rounded-lg mt-2 md:mt-0 border md:border-none shadow-lg md:shadow-none p-4 md:p-0">
        <Link to="/" className="w-full md:w-auto">
          <NavbarLink active={location.pathname === "/"} as="div" className="text-gray-900 hover:text-blue-500 font-medium py-2 cursor-pointer">
            Főoldal
          </NavbarLink>
        </Link>
        
        {!isOrderEnd && !isOnCart && (
          <Link to="/appointment" className="w-full md:w-auto">
            <NavbarLink as="div" className="text-gray-900 hover:text-blue-500 font-medium py-2 cursor-pointer">
              Szerviz
            </NavbarLink>
          </Link>
        )}
        
        {user?.role === 'admin' && (
          <Link to="/admin" className="w-full md:w-auto">
            <NavbarLink className="text-red-500 font-bold py-2 border-t md:border-none mt-2 md:mt-0 cursor-pointer" as="div">
              ADMIN
            </NavbarLink>
          </Link>
        )}
      </NavbarCollapse>
    )}
    </Navbar>
  );
}