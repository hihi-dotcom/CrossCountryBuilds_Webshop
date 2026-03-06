import { Link, Form, useRouteLoaderData, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Button, Badge, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiShoppingCart, HiLogin, HiUserAdd, HiLogout, HiExclamationCircle } from "react-icons/hi";
import { useCart } from "../../custom_hooks/CartContext";

export default function NavbarComponent() {
  const user = useRouteLoaderData("root") as { id: number; role: string; username?: string } | null;
  const { cartItems } = useCart();
  const location = useLocation();


   const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    if (modalIsOpen) {
      const timer = setTimeout(() => { setModalIsOpen(false) }, 2500);
      return () => clearTimeout(timer);
    }
  }, [modalIsOpen]);

  function handleNavigateButtonClick() {
    if (!user) {
      setModalIsOpen(true);
    } else {
      navigate("/appointment");
    }
  }

  const isOrderFlow = ["/cart", "/orderdata"].includes(location.pathname.toLowerCase());
  const isOrderEnd = location.pathname.toLowerCase() === "/orderend";
  const isOnCart = location.pathname.toLowerCase() === "/cart";
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
           <Modal show={modalIsOpen} size="md" onClose={() => setModalIsOpen(false)} popup>
              <ModalHeader />
              <ModalBody>
                <div className="text-center">
                  <HiExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    A szerviz szolgáltatásunkhoz előbb be kell jelentkezned!
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="blue" onClick={() => navigate("/login")}>
                      Bejelentkezés
                    </Button>
                    <Button color="gray" onClick={() => setModalIsOpen(false)}>
                      Mégse
                    </Button>
                  </div>
                </div>
              </ModalBody>
            </Modal>

          <Navbar fluid className="sticky top-0 z-50 border-b border-gray-700 dark:bg-[#1a222f] bg-white shadow-md">
        
          <div className="container mx-auto flex flex-wrap items-center justify-between w-full">
        
            <Link to={isOrderFlow ? "#" : "/"} className="flex items-center">
              <NavbarBrand as="div">
                <span className="self-center whitespace-nowrap italic font-black uppercase text-xl md:text-2xl dark:text-white">
                  Cross<span className="text-blue-500">Country</span>
                </span>
              </NavbarBrand>
            </Link>

          
            <div className="flex items-center gap-1 md:gap-3 md:order-2">
              
            
              {!isOrderEnd && !isOnCart && (
                <Link to="/cart" className="relative p-2 text-white hover:text-blue-400 transition-colors">
                  <HiShoppingCart size={28} className="dark:text-white text-black" />
                  {totalItems > 0 && (
                    <Badge 
                      color="failure" 
                      className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
                    >
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
                      <Button color="failure" size="xs" type="submit" pill className="p-1 dark:text-white">
                        <HiLogout className="h-8 w-8" />
                      </Button>
                    </Form>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Link to="/login">
                      <Button color="gray" size="md" className="border-none bg-gray-700 text-white hover:bg-gray-600 focus:ring-0 px-2">
                        <HiLogin className="h-7 w-7 md:mr-2" />
                        <span className="hidden md:inline">Belépés</span>
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button color="blue" size="md" className="px-2">
                        <HiUserAdd className="h-7 w-7 md:mr-2" />
                        <span className="hidden md:inline">Regisztráció</span>
                      </Button>
                    </Link>
                  </div>
                )
              )}


              {!isOrderFlow && <NavbarToggle className="text-gray-400 hover:bg-gray-700 focus:bg-gray-700" />}
            </div>

          
            {!isOrderFlow && !isOrderEnd && (
              <NavbarCollapse className="w-full md:w-auto md:order-1">
                <div className="flex flex-col md:flex-row md:gap-8 mt-4 md:mt-0 bg-[#1a222f] md:bg-transparent p-4 md:p-0  border-gray-700 md:border-none rounded-lg shadow-xl md:shadow-none">
                    <Link to="/" className="w-full md:w-auto border-gray-700 md:border-none py-2 md:py-0">
                      <NavbarLink 
                        as="div" 
                        className="cursor-pointer text-gray-400  font-medium">
                        Főoldal
                      </NavbarLink>
                    </Link>
                      <NavbarLink 
                        active={location.pathname === "/appointment"} 
                        as="div" 
                        className="cursor-pointer text-gray-400  font-medium w-full md:w-auto  border-gray-700 md:border-none py-2 md:py-0"
                        onClick={handleNavigateButtonClick}
                      >
                        Szerviz
                      </NavbarLink>
                    
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="w-full md:w-auto py-2 md:py-0">
                        <NavbarLink 
                          as="div" 
                          className="cursor-pointer font-bold text-red-500 hover:text-red-400"
                        >
                          ADMIN
                        </NavbarLink>
                      </Link>
                    )}
                </div>
              </NavbarCollapse>
            )}
          </div>
        </Navbar>
    </>
  
  );
}