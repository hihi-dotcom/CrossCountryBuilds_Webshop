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

    const shippingAddr = data.shippingAddr as string;
    const isSameAddress = data.sameAddress === "on" || data.sameAddress === "";
    const billingAddr = isSameAddress ? shippingAddr : (data.billingAddr as string);
    const cartProd = JSON.parse(data.cartProducts as string);
    const totalAmount = Number(data.totalAmount);
    const userId = Number(data.userId);
    const orderObj = {
        u_id: userId,
        Daddress: shippingAddr,
        Baddress: billingAddr,
        pMethod: data.paymentMethod,
        dMethod: data.shippingMethod,
        total_amount: totalAmount,
       products: cartProd.map((item: any) => ({
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
        return {serverError: error.message || "Váratlan hiba történt a rendelés leadásakor! "}
    }
   
}