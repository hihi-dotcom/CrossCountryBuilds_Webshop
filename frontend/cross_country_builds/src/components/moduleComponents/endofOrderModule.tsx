import { Card, Button } from "flowbite-react";
import { HiCheckCircle, HiArrowRight, HiMail, HiTruck } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function EndofOrderModule() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 bg-gray-50/50">
      <div className="max-w-3xl w-full text-center">
        
      
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 animate-pulse"></div>
            <HiCheckCircle className="relative text-green-500 h-32 w-32 md:h-40 md:w-40" />
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
            Köszönjük a <span className="text-blue-600">megrendelésedet!</span>
          </h2>
        </div>

    
        <Card className="border-none shadow-xl bg-[#1e293b] rounded-[2.5rem] p-4 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            
            <div className="flex items-start gap-4">
              <div className="bg-blue-600/20 p-3 rounded-2xl text-blue-500">
                <HiMail size={32} />
              </div>
              <div>
                <h4 className="text-white font-black uppercase italic text-sm mb-1 tracking-widest">Visszaigazolás</h4>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                  A megrendelésed összesítőjét azonnal elküldtük az e-mail címedre.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-600/20 p-3 rounded-2xl text-blue-500">
                <HiTruck size={32} />
              </div>
              <div>
                <h4 className="text-white font-black uppercase italic text-sm mb-1 tracking-widest">Szállítás</h4>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                  A csomagod érkezéséről és aktuális állapotáról folyamatosan értesítünk.
                </p>
              </div>
            </div>

          </div>
        </Card>

    
        <div className="flex flex-col items-center gap-6">
          <Link to="/" className="group w-full md:w-auto">
            <Button 
              size="xl" 
              className="w-full md:w-auto px-10 h-16 bg-blue-600 enabled:hover:bg-blue-700 rounded-2xl font-black uppercase italic tracking-widest shadow-[0_15px_30px_rgba(37,99,235,0.3)] border-none transition-all active:scale-95"
            >
              Vásárlás folytatása
              <HiArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}