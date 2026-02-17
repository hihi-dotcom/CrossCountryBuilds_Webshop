import orderDataScheme from "../components/validationSchemes/orderDataScheme";
import OrderService from "../services/OrderService";
import { redirect } from "react-router-dom";

export async function MakeOrder({ request }: {request: Request}){
    const formD = await request.formData();
    const data = Object.fromEntries(formD);

    const result = orderDataScheme.safeParse(data);
    if(!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        };
    };


    const isSameAddress = data.sameAddress === "on";
  
const orderObj = {
        u_id: Number(data.userId),
        deliveryAddr: {
            zipCode: data.shippingzipCode,
            cityName: data.shippingcityName,
            streetName: data.shippingstreetName,
            houseNumber: data.shippinghouseNumber
        },
        billingAddr: isSameAddress ? {
            zipCode: data.shippingzipCode,
            cityName: data.shippingcityName,
            streetName: data.shippingstreetName,
            houseNumber: data.shippinghouseNumber
        } : {
            zipCode: data.billingzipCode,
            cityName: data.billingcityName,
            streetName: data.billingstreetName,
            houseNumber: data.billinghouseNumber
        },
        pMethod: data.paymentMethod,
        dMethod: data.shippingMethod,
        total_amount: Number(data.totalAmount),
        products: JSON.parse(data.cartProducts as string).map((item: any) => ({
            id: item.id,
            price: item.price,
            amount: item.quantity 
        }))
    };
    try{
        const orderResult = await OrderService.MakingOrder(orderObj);

        if(!orderResult.ok){
            return{
                ServerError: orderResult.message || "Váratlan hiba történt a rendelés leadásakor!"
            }
        }
        localStorage.removeItem('bike-cart');
        return redirect("/orderend");
    }
    catch(error:any){
        return {ServerError: error.message || "Váratlan hiba történt a rendelés leadásakor! "}
    }
   
}