//import './footer.css'
import HomeIcon from "@mui/icons-material/Home"
import MailIcon from "@mui/icons-material/Mail"
import CallIcon from "@mui/icons-material/Call"


export function Footer() {
  return (
        <footer className="bg-transparent sm:bg-[#6B818C] rounded-base shadow-xs text-lg ">
        <div className="hidden sm:flex w-full mx-auto max-w-screen-xl p-6  sm:items-center sm:justify-between justify-items-center ">
          <div className="cim-section flex items-center gap-3">
            <p><HomeIcon className='hidden md:inline' sx={{ fontSize: 30 }}/>:1025 Budapest Huhu utca 28.</p>
          </div>
          <div className="telefon-section flex items-center gap-3">
            <p><CallIcon className='hidden md:inline' sx={{ fontSize: 30 }}/>: 06 1 334 5678</p>
          </div>
          <div className="email-section flex items-center gap-3">
            <p> <MailIcon className='hidden md:inline' sx={{ fontSize: 30 }}/>: info@menokerekparbolt.hu</p>
          </div>
        </div>

        <div className="flex sm:hidden justify-around text-center">
          <button className=' bg-[#08415C] text-white px-4 py-2 rounded-xl'>Kapcsolatok</button>
        </div>
    </footer>
  );
}