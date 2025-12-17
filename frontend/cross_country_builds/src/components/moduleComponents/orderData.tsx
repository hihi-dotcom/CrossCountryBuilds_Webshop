import OrderSendButton from "../buttonComponents/orderFinishButton";

import SelectforOrder from "../htmlselectComponents/selectforOrderData";
import { FormField } from "../formFieldComponents/textField";

import { useRef } from "react";

export default function OrderDataModule(){
    const nevRef = useRef("");
    const orderEmailRef = useRef("");
    const orderDeliveryAddrRef = useRef("");
    const orderBillingAddrRef = useRef("");
    const payingMRef = useRef(null);

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
    ]
    return(
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 p-6 max-w-5xl gap-16 mx-auto">
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

                <div id="kivalasztott-termekek">

                </div>

                <SelectforOrder
                    name="payingmethods"
                    id="pyingmethods"
                    selectlabel="Fizetési módok: "
                    options={paying_options}
                    ref={payingMRef}
                />

                <OrderSendButton/>
            </div>
           
        </>
    );
}