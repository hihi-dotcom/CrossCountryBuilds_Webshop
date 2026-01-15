import { Link, useRouteLoaderData, useNavigate } from "react-router-dom";
import IfUserFalseNotDateTime from "../modalComponents/ifUserFalseTryingtogoDateTime";
import { useState, useEffect } from "react";

export function DateTimeSection(){
    const  user  = useRouteLoaderData("root") as {id:number, role:string} | null;

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() =>{
              const timer = setTimeout(() => {setModalIsOpen(false)}, 1250);
      
              return () => clearTimeout(timer);
    }, [modalIsOpen]);


    function handleNavigateButtonClick(e: React.MouseEvent){
        if(!user){
            e.preventDefault();
            setModalIsOpen(true);
        }
        else{
            navigate("/appointment");
        }
    }

    return(
        <>
            {modalIsOpen && (
                            <IfUserFalseNotDateTime onClose={() => setModalIsOpen(false)}>
                               
                                <p>A szerviz szolgáltatásunkhoz előbb be kell jelentkezz!</p>
                            </IfUserFalseNotDateTime>
            )}
            <div className="hidden container max-w-5xl sm:flex flex-wrap mx-auto items-center text-amber-50 bg-[#9c1f2a] w-full px-7 rounded-3xl my-20 py-5 ">
                <p className="flex-col inline-flex px-5 py-3 text-lg">Baj van a bringáddal? Hozd el hozzánk és mi megjavítjuk! Foglalj időpontot, akár most!</p>
                <button type="button" className=" flex flex-col  bg-[#6b818c] text-amber-50 p-3.5 rounded-lg whitespace-nowrap ml-auto" onClick={handleNavigateButtonClick}>Foglalok!</button>
            </div>
            <div className="flex sm:hidden sm:w-full justify-around mt-6 text-amber-50 bg-[#9c1f2a] p-8 rounded-2xl text-lg">
                <button type="button" className="flex-col inline-flex px-5 text-2xl" onClick={handleNavigateButtonClick}>Szerviz időpontfoglalás</button>
            </div>
        </>


      
    );
}