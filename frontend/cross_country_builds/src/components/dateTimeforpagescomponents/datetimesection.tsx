import { Link } from "react-router-dom"


export function DateTimeSection(){
    return(
        <>
            <div className="hidden container max-w-5xl sm:flex flex-wrap mx-auto items-center text-amber-50 bg-[#9c1f2a] w-full px-7 rounded-3xl my-20 py-5 ">
                <p className="flex-col inline-flex px-5 py-3 text-lg">Baj van a bringáddal? Hozd el hozzánk és mi megjavítjuk! Foglalj időpontot, akár most!</p>
                <button type="button" className=" flex flex-col  bg-[#6b818c] text-amber-50 p-3.5 rounded-lg whitespace-nowrap ml-auto">Foglalok!</button>
            </div>
            <div className="flex sm:hidden sm:w-full justify-around mt-6 text-amber-50 bg-[#9c1f2a] p-8 rounded-2xl text-lg">
                <Link to={"/date"} className="flex-col inline-flex px-5">Szerviz időpontfoglalás</Link>
            </div>
        </>


      
    );
}