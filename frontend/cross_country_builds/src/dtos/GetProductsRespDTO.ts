import Product from "../models/product";

export interface GetProductsRespDTO{
    ok: boolean,
    products: Product[] | [],
    total:number,
    hasMore: boolean
}