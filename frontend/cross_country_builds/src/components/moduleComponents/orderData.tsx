import OrderSendButton from "../buttonComponents/orderFinishButton";
import SelectforOrder from "../htmlselectComponents/selectforOrderData";
import { FormField } from "../formFieldComponents/textField";
import { Form, useActionData, useNavigation} from "react-router-dom"
import { useRef } from "react";

export default function OrderDataModule(){
    const nevRef = useRef("");
    const orderEmailRef = useRef("");
    const orderDeliveryAddrRef = useRef("");
    const orderBillingAddrRef = useRef("");
    const payingMRef = useRef(null);
    const shippingMRef = useRef(null);

    const paying_options = [
        {
            value: "kartya-uzlet",
            name: "üzletben bankártyával"
        },
        {
            value: "penz-uzlet",
            name: "üzletben készpénzzel"
        },
        {
            value: "futar-penz",
            name: "futárunknak készpénzzel"
        },
    ];

    const shipping_methods = [
        {
            value: "futar",
            name: "házhoz szállítás"
        },
        {
            value: "uzlet",
            name: "személyes átvétel az üzletünkben"
        }
    ];
    return(
        <>
            <Form method="post">
                <div className="grid grid-cols-1 md:grid-cols-2 p-6 max-w-5xl gap-4 md:gap-8 mx-auto">
                    <FormField
                        input_name="nev"
                        input_id="nev"
                        type="text"
                        input_placeholder="a te neved"
                        ref={nevRef}

                    />
                    <FormField
                        input_name="order-email"
                        input_id="order-email"
                        type="email"
                        input_placeholder="a te e-mail címed"
                        ref={orderEmailRef}
                    />
                    <FormField
                        input_name="order-deliveryaddr"
                        input_id="order-deliveryaddr"
                        type="text"
                        input_placeholder="szállítási cím"
                        ref={orderDeliveryAddrRef}
                    />
                    <FormField
                        input_name="order-billingaddr"
                        input_id="order-billingaddr"
                        type="text"
                        input_placeholder="számlázási cím"
                        ref={orderBillingAddrRef}
                    />

                    <SelectforOrder
                        name="payingmethods"
                        id="payingmethods"
                        selectlabel="Fizetési módok: "
                        options={paying_options}
                        ref={payingMRef}
                    />

                    <SelectforOrder
                        name="shippingmethods"
                        id="shippingmethods"
                        selectlabel="Szállítási módok: "
                        options={shipping_methods}
                        ref={shippingMRef}

                    />
                    <div id="kivalasztott-termekek" className="h-fit">
                            <h3 className="text-3xl">Termékeid: </h3>
                    </div>
                    <div className="flex flex-row items-center w-full gap-0.5 sm:gap-2 md:gap-5">
                        <input id="default-checkbox" type="checkbox" value="" className="w-5 h-5  border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"/>
                        <p className="select-none ms-2 font-medium text-heading text-[21px] ">A szállítási és a számlázási cím megegyezik.</p>
                    </div>

                    <div className="flex justify-end">
                        <OrderSendButton />
                    </div>

                </div>
            </Form>
            
           
        </>
    );
}