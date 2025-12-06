import { Link } from "react-router-dom"


export function DateTimeSection(){
    return(
        <>
            <div className=" hidden sm:flex mx-auto items-center text-amber-50 bg-[#9c1f2a] w-max p-7 rounded-3xl">
                <p className="flex-col inline-flex px-5 text-lg">Baj van a bringáddal? Hozd el hozzánk és mi megjavítjuk! Foglalj időpontot, akár most!</p>
                <button type="button" className=" flex-col inline-flex bg-[#6b818c] text-amber-50 p-3.5 rounded-lg">Foglalok!</button>
            </div>
            <div className="flex sm:hidden sm:w-full justify-around mt-6 text-amber-50 bg-[#9c1f2a] p-8 rounded-2xl text-lg">
                <Link to={"/appointment"} className="flex-col inline-flex px-5">Szerviz időpontfoglalás</Link>
            </div>
        </>


      
    );
}