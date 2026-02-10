import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useCart } from "../custom_hooks/CartContext";

export default function EndofOrderModule(){
    return(
        <>
            <section className="text-center my-12">
                <div>
                    <TaskAltIcon sx={{fontSize: 150}}/>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl"> Köszönjük a megrendelésedet!</h2>
                </div>
                <div className="my-6 text-2xl max-w-xl mx-auto ">
                    <p className="text-center">A megrendelésed összesítőjét e-mailben elküldtük. A csomagod érkezéséről és állapotáról is e-mailben küldünk üzenetet.</p>
                </div>                
            </section>
        </>
    );
}