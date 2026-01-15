import { Request, Response } from "express";
import config from "../config/config";
import mysql from "mysql2/promise";
import { Product, IProduct } from "./Product";

export const getAllProducts = async(req: Request, resp:Response) => {
    const connection = await mysql.createConnection(config.database);

    try{
        const [result]:any = await connection.query(`
            SELECT * FROM Products`);

        if(result.length === 0){
            return resp.status(404).send("A termékek nem léteznek!");
        }

        resp.status(200).send(result);
    }
    catch(error){
        console.log(error);
        return resp.status(500).send(`Hiba a termékek lekérése során: ${error}`);
    }
}



export const getProductbyId = async(req: any, resp: Response) => {
    let id: number = parseInt(req.params.id);
    if(isNaN(id)){
        return resp.status(400).send("Hibásan adtad meg a paramétert!");
    };

    const connection = await mysql.createConnection(config.database);

    try{
        const [results]:any = await connection.query(`
            SELECT FROM Products WHERE id = ?`, [id]);
        
        if(results.length === 0){
            return resp.status(404).send("A kért termék sajnos nem található");
        }

        resp.status(200).send(results);
    }
    catch(error){
        console.log(error);
        return resp.status(500).send(`Szerver hiba a termék megjelenítése közben: ${error}`);
        
    }
};


export const InsertaProduct = async(req: Request, resp: Response) => {
    if(!req.body){
        return resp.status(400).send("Nem adtál meg adatokat a termék beszúrásához!");
    }

    let product: Product = new Product(req.body as unknown as IProduct);

    if(!product.name || !product.category || !product.maker || !product.price || !product.stock_number || !product.picUrl || !product.description){
        return resp.status(400).send("Minden mező kitöltése kötelező!");
    };

    const connection = await mysql.createConnection(config.database);

    try{
        const [result]:any = await connection.query(`
            INSERT INTO Products(id,name, category, maker, price, stock_number, picUrl, description) VALUES (NULL, ?, ?, ?, ?, ?, NULL, ?)`, [product.name, product.category, product.maker, product.price, product.stock_number, product.picUrl, product.description]);

        if(result.affectedRows !== 0){
            return resp.status(404).send("A termék beszúrása sajnos nem sikerült.");
        }

        resp.status(200).send(result.insertId);
    }
    catch(err){
        console.log(err);
        return resp.status(500).send(`A termék beszúrása nem sikerült: ${err}`);
    }
}
