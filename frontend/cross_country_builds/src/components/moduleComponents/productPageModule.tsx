import { useCart } from "../custom_hooks/CartContext";
import { useState, useEffect } from "react";
import { useLoaderData, useParams, Link } from "react-router-dom";
import { Badge, Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { 
  HiShoppingCart, 
  HiArrowLeft, 
  HiCheckCircle, 
  HiExclamationCircle, 
  HiTag, 
  HiOfficeBuilding 
} from "react-icons/hi";
import QuantitySelector from "../quantity_components/Quantity_Selector";

export default function ProductModule() {
  const { id } = useParams();
  const [menny, setMenny] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  const product = useLoaderData() as any;
  const isOutOfStock = product?.stock_number <= 0;

  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => { setIsModalOpen(false) }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  if (!id || !product) return null;

  return (
    <section className="container mx-auto px-4 py-8 md:py-16 min-h-screen">
      
      <Modal show={isModalOpen} size="md" onClose={() => setIsModalOpen(false)} popup>
        <ModalHeader />
        <ModalBody className="bg-white rounded-lg">
          <div className="text-center">
            <HiCheckCircle className="mx-auto mb-4 h-14 w-14 text-green-500" />
            <h3 className="mb-5 text-lg font-bold uppercase italic text-gray-800">
              Bekerült a kosárba!
            </h3>
          </div>
        </ModalBody>
      </Modal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <div className="relative">
          <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border-none">
            <img 
              src={`http://localhost:3000/product_images/${product.picUrl}`} 
              alt={product.name} 
              className="w-full h-auto object-contain aspect-square p-8"
            />
          </div>
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center rounded-[2.5rem]">
              <Badge color="failure" size="xl" className="px-8 py-4 text-2xl font-black uppercase italic shadow-2xl">
                Elfogyott
              </Badge>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-700 px-3 py-1 font-black uppercase border-none tracking-tighter italic">
                {product.category}
              </Badge>
              <Badge className="bg-gray-100 text-gray-500 px-3 py-1 font-black uppercase border-none tracking-tighter italic">
                {product.maker}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase italic leading-[0.9] tracking-tighter">
              {product.name}
            </h1>
          </div>

          <div className="py-2">
            {isOutOfStock ? (
              <p className="text-red-600 font-bold italic uppercase tracking-tighter"> Jelenleg nem elérhető</p>
            ) : product.stock_number <= 5 ? (
              <p className="text-orange-500 font-bold italic uppercase tracking-tighter"> Csak {product.stock_number} maradt készleten!</p>
            ) : (
              <p className="text-green-600 font-bold italic uppercase tracking-tighter">✓ Raktáron</p>
            )}
          </div>

          <div className="border-t border-gray-100 pt-6">
            <p className="text-gray-500 leading-relaxed text-lg italic font-medium">
              {product.description || "Nincs leírás."}
            </p>
          </div>

          <div className={`mt-4 space-y-8 ${isOutOfStock ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-gray-900 tracking-tighter italic">
                {(product.price * menny).toLocaleString()}
              </span>
              <span className="text-2xl font-bold text-gray-400 italic">Ft</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <QuantitySelector quantity={menny} setQuantity={setMenny} min={1} />
              </div>
              <Button 
                onClick={() => { addToCart(product, menny); setIsModalOpen(true); }}
                className="w-full sm:flex-1 h-16 rounded-2xl bg-[#2563eb] enabled:hover:bg-[#1d4ed8] shadow-xl shadow-blue-200 uppercase font-black italic tracking-widest text-lg border-none"
              >
                <HiShoppingCart className="mr-3 h-6 w-6" />
                Kosárba teszem
              </Button>
            </div>
          </div>

          <div className="mt-4 w-fit bg-gray-500  px-2 py-1 rounded-full">
            <Link to="/" className="inline-flex justify-center text-white transition-colors uppercase font-black italic text-sm tracking-widest">
              <HiArrowLeft className="mr-2 h-4 w-4" />
              Vissza a webshopba
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}