export default interface ProductProps {
    kep: string
    name: string;
    category: string;
    maker: string;
    price: number;
    OnCart: () => void;
}