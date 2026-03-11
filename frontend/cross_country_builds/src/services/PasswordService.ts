import type { ForgotDTO,NewPassDTO } from "../dtos/models_for_services/password_models";
import type { GetNewPasswordRespDTO } from "../dtos/GetNewPasswordRespDTO";
import { CreateNewPasswordRespDTO } from "../dtos/CreatePasswordRespDTO";

class PasswordService{

    async forgotPass(data:ForgotDTO):Promise<GetNewPasswordRespDTO>{
        const response = await fetch("http://localhost:3000/api/getnewpass", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const respData = await response.json();

        return {
            ok: response.ok,
            message: respData.message
        };
    };

    async createNewPass(token:string, data:NewPassDTO):Promise<CreateNewPasswordRespDTO>{
         const response = await fetch("http://localhost:3000/api/createnewpass", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({token,...data })
        });

        const respData = await response.json();

        return {
            ok: response.ok,
            message: respData.message
        };
        
    }
};

export default new PasswordService();