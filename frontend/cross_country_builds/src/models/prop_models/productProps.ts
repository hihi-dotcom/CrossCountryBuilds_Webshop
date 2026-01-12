export default interface ProductProps {
    product: {
       id: any;
       
       // pic: string
       name: string,
       category: string,
       maker: string,
       price:number
    }
    OnCart: () => void;
}