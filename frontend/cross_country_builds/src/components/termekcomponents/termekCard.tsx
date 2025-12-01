import BikeImg from "../../assets/letöltés.jpg"

export function ProductCard(){
    return(
        <div className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs">
            <img src={BikeImg} className="h-auto" alt="elado kerekpar" />
            <h2 className="termekneve">XDDD</h2>
            <h4 className="termekkategoria"></h4>
            <h4 className="termekgyarto"></h4>
            <h3 className="termekara"></h3>
        </div>

    );
}