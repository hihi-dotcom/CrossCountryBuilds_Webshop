import OrderSendButton from "../buttonComponents/orderFinishButton";
import SelectforOrder from "../htmlselectComponents/selectforOrderData";
import { FormField } from "../formFieldComponents/textField";
import { useCart } from "../custom_hooks/CartContext";
import { Form, useActionData, useNavigation} from "react-router-dom"
import { useRef } from "react";

export default function OrderDataModule(){
    const {totalPrice, cartItems} = useCart();
    const actionData = useActionData() as {error?: string};
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";



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
            <Form method="post" className="py-2">
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
                        <FormField
                            input_name="shippingAddr"
                            input_id="order-deliveryaddr"
                            type="text"
                            input_placeholder="szállítási cím"
                            ref={orderDeliveryAddrRef}
                        />
                        
                    </div>
                    <div>
                        <FormField
                            input_name="billingAddr"
                            input_id="order-billingaddr"
                            type="text"
                            input_placeholder="számlázási cím"
                            ref={orderBillingAddrRef}
                        />
                    
                    </div>
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
                        <input id="default-checkbox" type="checkbox" value="" name="sameAddress" className="w-5 h-5   rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"/>
                        <p className="select-none ms-2 font-medium text-heading text-[21px] ">A szállítási és a számlázási cím megegyezik.</p>
                    </div>
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
}