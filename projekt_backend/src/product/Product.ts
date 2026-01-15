export interface IProduct{
    id: number | null,
    name: string,
    category: string,
    maker: string,
    price: number,
    stock_number: number
    picUrl: string
    description: string
}

export class Product implements IProduct{
    id: number | null  = null
    name: string = ""
    category: string = ""
    maker: string = ""
    price: number = 0
    stock_number: number = 0
    picUrl: string = ""
    description: string = ""
    constructor(init: IProduct){
        Object.assign(this, init as Partial<Product>)
    }


};