import jwt from "jsonwebtoken";
import config from "../config/config";
import {Response, NextFunction} from "express";

const verifyToken = (req: any, resp: Response, next: NextFunction ) => {
    const token = req.cookies?.token;

    if(!token){
        return resp.status(403).send("Token kell a hozzáféréshez");
    }

    try{
        if(!config.jwtSecret){
            return resp.status(401).send("Hiba a secret keynél!");
        }

        const decodedToken = jwt.verify(token, config.jwtSecret);

        req.user = decodedToken;

        return next();
    }
    catch(error){
        resp.clearCookie("token");
        return resp.status(401).send("Hibás vagy lejárt token!");
    }
};
export const isAdmin = (req: any, resp: Response, next: NextFunction) => {

    if (req.user && req.user.role === 'admin') {
        return next(); 
    }
    
    return resp.status(403).send("Ehhez admin jogosultság szükséges!");
};

export default verifyToken;