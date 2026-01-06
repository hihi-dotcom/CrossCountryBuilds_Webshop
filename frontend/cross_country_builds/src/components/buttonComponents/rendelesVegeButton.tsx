import { Link } from "react-router-dom";


export default function RendelesEndButton(){
    return(
        <button type="submit" className="flex items-center justify-center w-fit mx-auto sm:mx-0  text-white text-lg px-4 py-3 md:px-6 md:py-5 bg-[#cc2936] border-2 border-transparent hover:border-white hover:font-bold rounded-lg transition-all my-10 md:mx-15"><Link to={"/orderdata"}>Tovább az adatokhoz</Link></button>
    );
}