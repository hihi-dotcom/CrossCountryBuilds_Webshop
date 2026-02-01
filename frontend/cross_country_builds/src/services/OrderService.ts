import type {OrderCreds, UpdateStatCreds}  from "../models/models_for_services/order_models"
import AuthService from "./AuthService";

class OrderService{
    async MakingOrder(order: OrderCreds){
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
        const response = await AuthService._request(`orders`, {
            method: "GET"
        });

        return await response.json();
    }
};

export default new OrderService();