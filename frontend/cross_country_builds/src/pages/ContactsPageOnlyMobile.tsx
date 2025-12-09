import BackToWebShopButton from "../components/buttonComponents/backtoWebshopButton";
import HomeIcon from "@mui/icons-material/Home"
import MailIcon from "@mui/icons-material/Mail"
import CallIcon from "@mui/icons-material/Call"

export default function Contacts(){
    return(
        <main className="flex flex-col gap-10  my-3 sm:hidden">
            <h2 className="text-4xl text-center ">Elérhetőségeink</h2>
            <div id="cim" className="flex inline-flex text-2xl">
                <HomeIcon sx={{fontSize: 35}}/> <p> 1025 Budapest Huhu u. 28.</p>
            </div>
            <div id="phone-number" className="flex inline-flex text-2xl">
                <CallIcon sx={{fontSize: 35}}/><p> 06 1 334 5678</p>
            </div>
            <div id="email" className="flex inline-flex text-2xl">
                <MailIcon sx={{fontSize: 35}}/><p> info@menokerekparbolt.hu</p>
            </div>
            <div className="mx-auto">
                <BackToWebShopButton/>
            </div>
        </main>
    );
}