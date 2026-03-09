import { Label, Checkbox, Card, Badge, Alert } from "flowbite-react";
import { HiTruck, HiCreditCard, HiUser, HiMail, HiExclamationCircle, HiCheckCircle } from "react-icons/hi";
import { useCart } from "../custom_hooks/CartContext";
import { Form, useActionData, useNavigation, useRouteLoaderData, useSubmit } from "react-router-dom";
import { useRef, useState } from "react";
import AddressFields from "../formFieldComponents/formFieldsforOrder";
import OrderSendButton from "../buttonComponents/orderFinishButton";
import SelectforOrder from "../htmlselectComponents/selectforOrderData";
import { FormField } from "../formFieldComponents/textField";

export default function OrderDataModule() {
  const { totalPrice, cartItems } = useCart();
  const [selectedShipping, setSelectedShipping] = useState<string | null>("");
  const userData = useRouteLoaderData("root") as { id: number; role: string } | null;
  const actionData = useActionData() as { error?: string, ServerError?: string, errors?: Record<string, string[]> };
  console.log(actionData);
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = navigation.state === "submitting";
  const [sameAddress, setSameAddress] = useState(true);
  
  const passwordref = useRef<HTMLInputElement | null>(null);
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("sameAddress", sameAddress ? "on" : "off");
    if (userData?.id) formData.append("userId", userData.id.toString());
    formData.append("cartProducts", JSON.stringify(cartItems));
    formData.append("totalAmount", totalPrice.toString());
    submit(formData, { method: "post" });
  };
  const hasBicycle = cartItems?.some(item => item.category === "kerékpárok") ?? false;

const shipping_methods = [
    {
        value: "futar",
        name: "futar",
        innerText: "házhoz szállítás",
        disabled: hasBicycle 
    },
    {
        value: "uzlet",
        name: "uzlet",
        innerText: "személyes átvétel az üzletünkben",
        disabled: false
    }
].filter(method => (hasBicycle ? method.value === "uzlet" : true));;

const paying_options = [
    {
        value: "kartya",
        name: "kartya-uzlet" ,
        innerText: "üzletben Paypal segítségével",
        disabled: false
    },
    {
        value: "penz-uzlet",
        name: "penz-uzlet",
        innerText: "üzletben készpénzzel",
        disabled: false
    },
    {
        value: "futar-penz",
        name: "futar-penz",
        innerText: "futárunknak készpénzzel",
        disabled: hasBicycle 
    },
    {
        value: "kartya",
        name: "futar-kartya",
        innerText: "futárunknak Paypal segítségével",
        disabled: hasBicycle
    }
]

    

    const filtered_paying_options = paying_options.filter(option => {
      if(hasBicycle && option.value === "futar-penz"){
          return false;
      }

      if(selectedShipping === "uzlet"){
        return option.value.includes("uzlet") || option.name.includes("uzlet")
      }
      if (selectedShipping === "futar") {
        
        return option.value.includes("futar") || option.name.includes("futar");
      }
      return true;
    })

  return (
    <section className="bg-gray-50/50 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter">
            Rendelés <span className="text-blue-600 font-black">Véglegesítése</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium italic">Kérjük, ellenőrizze az adatait a rendelés elküldése előtt.</p>
        </div>

        <Form method="post" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
       
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
                <HiUser className="text-blue-600 h-10 w-10" />
                <h3 className="text-xl font-bold uppercase italic text-gray-800">Személyes adatok</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField input_name="name" input_id="nev" type="text" input_placeholder="Teljes név" ref={passwordref} />
                <p className="text-white">*A regisztrációkor megadott e-mail címre küldjük rendelésed összesítőjét.</p>
              </div>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <HiTruck className="text-blue-600 h-10 w-10" />
                  
                </div>
              </div>
              <AddressFields prefix="shipping" label="Szállítási cím"/>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-2xl flex items-center  gap-3 border border-gray-100">
                    <Checkbox 
                    id="sameAddress" 
                    checked={sameAddress} 
                    onChange={(e) => setSameAddress(e.target.checked)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="font-bold text-black italic cursor-pointer select-none">
                    A számlázási címem megegyezik a szállítással
                    </span>
              </div>

              {!sameAddress && (
                <div className="mt-8 pt-8 border-t border-gray-100 animate-fadeIn">
                    
                  <AddressFields prefix="billing" label="Számlázási adatok"/>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-xl bg-[#1e293b] text-white rounded-[2.5rem] sticky top-24">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight mb-6 border-b border-gray-700 pb-4">
                    Összesítés
                  </h3>
                  
                  <div className="space-y-4">
                    <SelectforOrder
                      name="shippingMethod"
                      id="shippingmethods"
                      selectlabel="Szállítási mód"
                      onChange={(e: any) => setSelectedShipping(e.target.value)} 
                      options={shipping_methods}

                    />
                    <div className="w-full flex flex-col gap-3 md:gap-5">
                        <label htmlFor={"payingmethods"} className="text-3xl">{"Fizetési mód"}</label>
                        <select  name={"paymentMethod"} id={"payingmethods"} className=" md:text-black border-2 md:border-transparent rounded-lg text-lg bg-transparent sm:rounded-lg px-3 py-2 md:bg-amber-50 dark-select">
                            {filtered_paying_options.map((option:{value: string, name: string, innerText:string, disabled:boolean}) => <option className="text-black text-lg" value={option.value} disabled={option.disabled}>{option.innerText}</option>)}
                        </select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 mt-8">
                  <p className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-1">Végösszeg</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-blue-500 italic tracking-tighter">
                      {totalPrice.toLocaleString()}
                    </span>
                    <span className="text-xl font-bold text-white italic">Ft</span>
                  </div>
                </div>

            
                {(actionData?.errors || actionData?.ServerError || actionData?.error) && (
                  <Alert color="failure" icon={HiExclamationCircle} className="rounded-2xl font-bold italic">
                    {actionData.ServerError || actionData.error || "Kérjük, ellenőrizze a megadott adatokat!"}
                  </Alert>
                )}

                <div className="pt-4">
                  <OrderSendButton disabled={isSubmitting} />
                </div>
                
                <p className="text-[10px] text-gray-500 text-center font-medium leading-relaxed italic px-4">
                  A "Rendelés befejezése" gombra kattintva elküldi a rendelést számunkra.
                </p>
              </div>
            </Card>
          </div>
        </Form>
      </div>
    </section>
  );
}