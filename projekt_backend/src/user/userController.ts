import {Request, Response} from "express";
import mysql from "mysql2/promise";
import config from "../config/config";
import jwt from "jsonwebtoken";


export const loginUser = async(req: Request, resp: Response) => {
    const {username, password} = req.body;

    if(!(username && password)){
        return resp.status(400).send({error: "Hiányzó bejelentkezési adatok!"});
    }

    const connection = await mysql.createConnection(config.database);

    try{
        const [results]:any = await connection.query(`SELECT userlogin (?, ?) as id`, [username, password]);
     

        if(!results[0].id){
            return resp.status(401).send({error: "Hibás felhasználónév vagy jelszó!"});
        };

        if(!config.jwtSecret){
            return resp.status(500).send("Szerver hiba: nincs JWT kulcs beállítva!");
        }

        const [roles]:any = await connection.query(`SELECT role FROM Users WHERE id = ? `, [results[0].id]);
        await connection.end();

        const token = jwt.sign({id: results[0].id, role: roles[0].role }, config.jwtSecret, {expiresIn: "2h"});

        resp.cookie("token", token, {
            httpOnly: true,
            secure:false,
            sameSite:"lax",
            maxAge: 7200000
        });

        return resp.status(200).send({message: "Sikeres bejelentkezés!", role: roles[0].role});
    }
    catch(error){
        console.log(error);
        return resp.status(500).send(`Szerver hiba: ${error}`);
    }
};

export const logOutUser = async(req: Request, resp: Response) => {
    resp.clearCookie("token",{
        httpOnly: true,
        secure: false, // Ha a létrehozásnál false volt
        sameSite: "lax",
        path: "/"
    });
    return resp.status(200).send({message: "Sikeres kijelentkezés!"});
};


export const signUp = async(req:Request, resp: Response) => {
    const {username, email, password, confirmPassword} = req.body;

    if(!username || !email || !password || !confirmPassword){
        return resp.status(400).send({error: "Minden mező kitöltése kötelező! "});
    };

    const emailRegex = /\S+@\S+\.\S+/;
    if(!emailRegex.test(email)){
        return resp.status(400).send({error: "Rossz email formátum!"});
    };

    if(password !== confirmPassword){
        return resp.status(400).send({error: "A két jelszó nem egyezik meg!"});
    };

    if(password.length < 6){
        return resp.status(400).send({error: "A jelszónak legalább 6 karakterből kell állnia! "});
    };

    const connection = await mysql.createConnection(config.database);

    try{
        const [vane]:any = await connection.query(`
            SELECT id FROM Users WHERE email = ?`,[email]);
        
        if(vane.length > 0){
            await connection.end();
            return resp.status(400).send({error: "Ez az email cím már foglalt!"});
        }

        const [result]: any = await connection.query(`INSERT INTO Users(username, email, password) VALUES (?, ?, ?)`, [username, email, password]);
        await connection.end();

        if(result.affectedRows !== 0){
            return resp.status(201).send({message: "Sikeres regisztráció! "});
        }
    }
    catch(error){
        await connection.end();
        console.log(error);

        return resp.status(500).send({error: "Hiba történt a mentés során!"});
    }
};

export const getCurrentUser = async(req: Request, resp: Response) => {
    const token = req.cookies?.token;
    if(!token){
        return resp.json(null);
    }
    try{
        const decoded = jwt.verify(token, config.jwtSecret) as any;

        return resp.json({id: decoded.id, role: decoded.role});
    }
    catch(error){
        return resp.json(null);
    }
};


export const deleteUserByEmail = async(req: Request, resp: Response) => {
    let email:string | undefined = req.query?.email as string | undefined;

    if(!email){
        return resp.status(400).send("Nem adtál meg megfelelő paramétert!");
    }

    const connection = await mysql.createConnection(config.database);
    try{
        const [results]: any = await connection.query(`DELETE FROM Users WHERE email = ?`, [email]);

        if(results.affectedRows !== 0){
            return resp.status(200).send("A felhasználó törlése sikeres volt!");
        }
        else if(results.affectedRows === 0){
            return resp.status(404).send("A felhasználó törlése sajnos nem sikerült!");
        }
    }
    catch(error){
        return resp.status(500).send(`Váratlan szerver hiba a felhasználó törlése során! ${error}`);
    }

}