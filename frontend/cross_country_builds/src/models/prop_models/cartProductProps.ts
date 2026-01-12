export default interface CartProductProps {
    cartproduct: {
        name: string,
        pic: string
        price: number
    },
    OnClear: () => void
}