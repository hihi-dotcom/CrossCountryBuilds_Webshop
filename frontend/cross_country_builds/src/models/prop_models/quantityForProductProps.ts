
export default interface QuantityProps {
    quantity: number,
    setQuantity:  (value: number | ((prev: number) => number)) => void,
    min: number
   
}