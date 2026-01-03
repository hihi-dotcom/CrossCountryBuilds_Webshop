import { Link } from "react-router-dom";


export default function RendelesEndButton(){
    return(
        <button type="submit" className="flex items-center justify-center w-fit mx-auto sm:mx-0  text-white p-4 bg-[#cc2936] border-2 border-transparent hover:border-white hover:font-bold md:p-3 rounded-lg transition-all md:my-20 md:mx-15"><Link to={"/orderdata"}>Tovább az adatokhoz</Link></button>
    );
}