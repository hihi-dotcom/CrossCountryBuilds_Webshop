import type Product from "../product";

export default interface ProductProps {
    product: Product
    OnCart: () => void;
}