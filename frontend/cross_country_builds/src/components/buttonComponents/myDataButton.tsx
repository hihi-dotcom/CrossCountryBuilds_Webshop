import { Link } from "react-router-dom";

export default function MyDataButton(){
    return(
        <>
            <Link to={"/mydata"} className="px-6 py-2.5 rounded-lg bg-[#435159] hover:bg-opacity-80 transition duration-200 border-transparent border-2 hover:border-white hover:font-bold">Saját adataim</Link>
        </>
    );
}