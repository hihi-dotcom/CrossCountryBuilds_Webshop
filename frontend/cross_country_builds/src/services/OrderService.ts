import type {OrderCreds, UpdateStatCreds}  from "../models/models_for_services/order_models"
import AuthService from "./AuthService";

class OrderService{
    async MakingOrder(order:any){
        const response = await AuthService._request(`order`, {
            method: "POST",
            body: JSON.stringify(order)
        });

        const respData = await response.json();

        return{
            ok: response.ok,
            message: respData.message,
            
        }
    };

    async UpdateOrderStat(id: number,data:UpdateStatCreds){
        const response = await AuthService._request(`order/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data)
        });

        const respData = await response.json();

        return{
            ok: response.ok,
            message: respData.message
        }
    }


    async deleteOrderbyId(id: number){

        const response = await AuthService._request(`order/${id}`, {
            method: "DELETE"
        });
      
        const respData = await response.json();

        return {
            ok: response.ok,
            message: respData.message
        };
    };

    async getOrdersforAdmin(){
        const response = await AuthService._request(`admin/orders`, {
            method: "GET"
        });
        const responseData = await response.json()
        if(!response.ok){
            
            throw new Error(responseData.message || "Hiba a megrendelések lekérésekor! ");
        }
        return await responseData;
    }
};

export default new OrderService();