import { useCart } from "../components/custom_hooks/CartContext";
import BacktoTheWebShopSection from "../components/moduleComponents/backToTheWebshop";
import { HiShoppingCart, HiInformationCircle } from "react-icons/hi";
import CartProducts from "../components/termekcomponents/cartProductSor";
import RendelesEndButton from "../components/buttonComponents/rendelesVegeButton";
import {Link} from "react-router-dom";
import { Alert } from "flowbite-react";
export default function CartPage() {
  const { cartItems, isCartValidated } = useCart();
  const hasItems = cartItems && cartItems.length > 0;
  const problematicProducts = cartItems.filter(item => item.quantity > item.stock_number);
  const problematicProductNames = problematicProducts.map(p => p.name).join(", ");
  const moreThanInventory = cartItems.some(item => Number(item.quantity) > item.stock_number)

  return (
    <section className="min-h-screen py-12 px-4 md:px-12 bg-[#f9fafb]">
      <div className="max-w-5xl mx-auto">
         {hasItems && moreThanInventory && (
          <>
            <Alert color="failure" icon={HiInformationCircle}>
              <p className="mt-1 text-sm text-red-600">
                 A következő termékekből nincs ennyi raktáron: <span className="font-medium underline">{problematicProductNames}</span>
              </p>
              <p className="mt-1 text-sm text-red-600">
                  Kérjük, csökkentsd a mennyiséget, a továbblépéshez!
              </p>
            </Alert>
          </>
        )}
        <BacktoTheWebShopSection>
          <span className="text-white italic font-medium">Elfelejtettél valamit? Itt még visszatérhetsz.</span>
        </BacktoTheWebShopSection>
       
        <div className="flex items-center gap-4 mt-10 mb-8">
          <HiShoppingCart className="text-blue-600 text-4xl" />
          <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">
            A kosarad <span className="text-blue-600">tartalma</span>
          </h2>
        </div>

        <div className="flex flex-col gap-y-4">
          <CartProducts />
        </div>

        {!hasItems && (
          <div className="py-20 text-center bg-white rounded-[2.5rem] mt-10 shadow-sm border border-gray-100">
            <HiShoppingCart className="mx-auto text-gray-200 text-7xl mb-4" />
            <h1 className="text-3xl font-black text-gray-900 uppercase italic">Üres a kosarad</h1>
            <Link to="/" className="mt-4 text-blue-600 font-bold hover:underline inline-block">Vissza a válogatáshoz</Link>
          </div>
        )}
        
        {hasItems && (
          <div className="flex justify-end mt-12 pt-8 border-t border-gray-200">
            <div className={moreThanInventory ? "opacity-50 cursor-not-allowed" : ""}>
                  <RendelesEndButton disabled={moreThanInventory} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}