import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { useLocation, Link, Form } from "react-router-dom";

export default function AdminNavbar() {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();
  const isProductEditing = currentPath.startsWith("/admin/products/") && currentPath !== "/admin/products";
  const isAppointmentFinalizing = currentPath.startsWith("/admin/appointments/") && currentPath !== "/admin/dates";
  const allLinks = [
    { href: "/admin", label: "Felhasználók" },
    { href: "/admin/orders", label: "Megrendelések" },
    { href: "/admin/dates", label: "Szerviz" },
    { href: "/admin/products", label: "Termékek" },
    
  ];

  return (
    <Navbar fluid rounded>
      <NavbarBrand as={Link} href="/admin">
        <span className="self-center whitespace-nowrap text-2xl uppercase md:text-4xl font-bold italic dark:text-white">Cross</span>
        <span className="self-center whitespace-nowrap text-2xl uppercase md:text-4xl text-blue-600 font-bold italic">Country</span>
      </NavbarBrand>

      <div className="flex md:order-2">
        {!isProductEditing && !isAppointmentFinalizing && (
          <>
              <Form method="POST" action="/logout">
                <button className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition-colors mx-1 md:mx-3">
                  Kilépés
                </button>
              </Form>
          </>
        )}
        
        <NavbarToggle />
      </div>

      <NavbarCollapse>
        {!isProductEditing && !isAppointmentFinalizing && allLinks
          .filter(link => link.href !== currentPath)
          .map((link) => (
            <NavbarLink 
              key={link.href} 
              href={link.href}
            >
              {link.label}
            </NavbarLink>
          ))}
      </NavbarCollapse>
    </Navbar>
  );
}