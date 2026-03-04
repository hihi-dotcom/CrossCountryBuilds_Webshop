import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { Button, Card, Badge } from "flowbite-react";
import { HiArrowLeft, HiHome, HiTerminal } from "react-icons/hi";

export default function AdminErrorPage() {
  const err = useRouteError();
  const navi = useNavigate();

  let errMessage: string = "Váratlan hiba történt az adminisztrációs rendszerben!";
  let errCode: number | string = "Hiba";
  let errDetails: string | undefined = "Nincs további technikai részlet.";

  console.error("Admin Loader hiba:", err);

  if (isRouteErrorResponse(err)) {
    errCode = err.status;
    errMessage = err.statusText || "Ismeretlen hiba történt.";
    errDetails = err.data?.message || "Hálózati hiba vagy érvénytelen válasz a művelet során.";
    
    if (err.status === 404) {
      errMessage = "A keresett adminisztrációs felület nem található.";
    } 
    if (err.status === 503) {
      errMessage = "Az adatbázis vagy a szerver jelenleg nem elérhető.";
    }
  } else if (err instanceof Error) {
    errMessage = err.message;
    errDetails = err.stack; 
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0b0f19] p-4">
      <Card className="max-w-2xl w-full border-gray-700 bg-[#111827] shadow-2xl">
        <div className="text-center">
    
          <div className="flex justify-center mb-4">
            <Badge color="failure" size="xl" className="px-4 py-1 font-mono text-2xl uppercase">
              {errCode}
            </Badge>
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-2 uppercase italic tracking-tight">
            Admin <span className="text-red-500">Rendszerhiba</span>
          </h1>
          
          <p className="text-gray-400 text-lg mb-8">
            {errMessage}
          </p>

          <div className="bg-black/40 rounded-lg p-4 mb-8 text-left border border-gray-800">
            <div className="flex items-center gap-2 mb-2 text-gray-500 uppercase text-xs font-bold tracking-widest">
              <HiTerminal />
              <span>Technikai részletek:</span>
            </div>
            <code className="text-red-400 text-sm break-all">
              {errDetails}
            </code>
          </div>

          
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button 
              color="gray" 
              onClick={() => navi(-1)} 
              className="flex items-center justify-center"
            >
              <HiArrowLeft className="mr-2 h-5 w-5" />
              Vissza az előző oldalra
            </Button>
            
            <Button 
              color="blue" 
              onClick={() => navi("/")}
              className="flex items-center justify-center italic font-bold"
            >
              <HiHome className="mr-2 h-5 w-5" />
              Webshop Főoldal
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}