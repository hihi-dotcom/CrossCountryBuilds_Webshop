import { Link } from "react-router-dom";

export default function RendelesEndButton(){
    return(
        <Link to="/orderData" className="text-white bg-[#cc2936] border-2 border-transparent hover:border-black p-1 md:p-3 rounded-lg">Tovább az adatokhoz</Link>
    );
}