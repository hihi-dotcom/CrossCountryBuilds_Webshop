import OrderSendButton from "../buttonComponents/orderFinishButton";
import SelectforOrder from "../htmlselectComponents/selectforOrderData";
import { FormField } from "../formFieldComponents/textField";
import { useCart } from "../custom_hooks/CartContext";
import { Form, useActionData, useNavigation, useRouteLoaderData, useSubmit} from "react-router-dom"
import { useRef, useState } from "react";
import AddressFields from "../formFieldComponents/formFieldsforOrder";


export default function OrderDataModule(){
    const {totalPrice, cartItems} = useCart();
    const userData = useRouteLoaderData("root") as {id:number, role: string} | null;

    const actionData = useActionData() as {error?: string, ServerError?: string, errors?: Record<string, string[]>};
    const navigation = useNavigation();
    console.log(actionData)
    const submit = useSubmit();
    const isSubmitting = navigation.state === "submitting";
    const [sameAddress, setSameAddress] = useState(true);
    
    const handleSubmit = (event:any) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
       

        
        formData.set("sameAddress", sameAddress ? "on" : "off");
        if(userData?.id){
            formData.append("userId", userData.id.toString());
        };
        formData.append("cartProducts", JSON.stringify(cartItems));
        formData.append("totalAmount", totalPrice.toString());

        submit(formData, {method: "post"});
    };



    const nevRef = useRef("");
    const orderEmailRef = useRef("");
    const orderDeliveryAddrRef = useRef("");
    const orderBillingAddrRef = useRef("");
    const payingMRef = useRef(null);
    const shippingMRef = useRef(null);

    const paying_options = [
        {
            value: "kartya-uzlet",
            name: "kartya-uzlet" ,
            innerText: "üzletben bankártyával"
        },
        {
            value: "penz-uzlet",
            name: "penz-uzlet",
            innerText: "üzletben készpénzzel"
        },
        {
            value: "futar-penz",
            name: "futar-penz",
            innerText: "futárunknak készpénzzel"
        },
    ];

    const shipping_methods = [
        {
            value: "futar",
            name: "futar",
            innerText: "házhoz szállítás"
        },
        {
            value: "uzlet",
            name: "uzlet",
            innerText: "személyes átvétel az üzletünkben"
        }
    ];
    return(
        <>
            <Form method="post" className="py-2" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 p-6 max-w-5xl gap-4 md:gap-8 mx-auto">
                    <div>
                        <FormField
                            input_name="name"
                            input_id="nev"
                            type="text"
                            input_placeholder="a te neved"
                            ref={nevRef}

                        />
                        
                    </div>
                    <div>

                        <FormField
                            input_name="email"
                            input_id="order-email"
                            type="email"
                            input_placeholder="a te e-mail címed"
                            ref={orderEmailRef}
                        />
                        
                    </div>
                    <div>
                        <div className="flex-1">
                            <AddressFields prefix="shipping" label="Szállítási adatok" />
                        </div>
                    </div>
                    {!sameAddress && (<div className="flex-1">
                        <AddressFields prefix="billing" label="Számlázási adatok" />
                    </div>)}
                    <div>
                        <SelectforOrder
                            name="paymentMethod"
                            id="payingmethods"
                            selectlabel="Fizetési módok: "
                            options={paying_options}
                            ref={payingMRef}
                        />
                        
                    </div>
                    <div>
                        <SelectforOrder
                            name="shippingMethod"
                            id="shippingmethods"
                            selectlabel="Szállítási módok: "
                            options={shipping_methods}
                            ref={shippingMRef}

                        />
                        
                    </div>

                    <div>
                        <h2 className="text-4xl py-2">Fizetendő összesen: </h2>
                        <p className="text-4xl">{totalPrice.toLocaleString()} Ft</p>
                    </div>
                    
                    <div className="flex flex-row items-center w-full gap-0.5 sm:gap-2 md:gap-5">
                        <input id="default-checkbox" type="checkbox" value="" name="sameAddress" className="w-5 h-5   rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft" checked={sameAddress} onChange={(e) => setSameAddress(e.target.checked)}/>
                        <p className="select-none ms-2 font-medium text-heading text-[21px] ">A szállítási és a számlázási cím megegyezik.</p>
                    </div>
                    {actionData?.errors && (
                        <div className="md:col-span-2 p-4  border-red-500/50 text-red-500 rounded-xl">
                            <p className="font-bold mb-2">Javítsd az alábbi hibákat:</p>
                            <ul className="list-none list-inside text-base ">
                                {Object.values(actionData.errors).flat().map((err: any, index) => (
                                    <li key={index}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}                  
                    {actionData?.ServerError && (
                        <div className="md:col-span-2 p-4 bg-red-100 border border-red-400 text-red-700 font-bold rounded-xl text-center animate-pulse">
                            {actionData.ServerError}
                        </div>
                    )}
                    {actionData?.error && (
                        <div className="md:col-span-2 text-red-500 font-bold rounded text-center">
                            {actionData.error}
                        </div>
                    )}
                    <div className="flex justify-end md:col-span-2 mt-4">
                        <OrderSendButton disabled={isSubmitting}/>
                    </div>

                </div>
            </Form>
            
           
        </>
    );
};