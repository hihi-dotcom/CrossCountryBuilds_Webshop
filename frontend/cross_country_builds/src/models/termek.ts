export default class Product{
    product_id: number;
    name: string;
    category: string;
    maker: string;
    description: string;
    pic: string;
    price: number

    public constructor(product_id: number, name: string, category: string, maker: string, description: string, pic: string, price: number){
        this.product_id = product_id;
        this.name = name;
        this.category = category;
        this.maker = maker;
        this.description = description;
        this.pic = pic;
        this.price = price

    }

}