import { Form, useActionData, useLoaderData } from "react-router-dom";
import SelectforDatetime from "../htmlselectComponents/selectforDateTime";
import BackToWebShopButton from "../buttonComponents/backtoWebshopButton";

export default function AppointmentModule() {
    const freedates = useLoaderData() as any[] || [];
    const actionData = useActionData();

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 min-h-screen font-sans text-slate-800">
            
            <div className="mb-10 text-center sm:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                    Szerviz Időpontfoglalás
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl">
                    Válaszd ki a számodra megfelelő időpontot, és írd meg röviden, miben segíthetünk. 
                    Profi csapatunk várja kerékpárodat!
                </p>
            </div>

            <Form method="post" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold">Mikor jönnél?</h2>
                            </div>

                            {freedates.length > 0 ? (
                                <div className="flex space-y-4 flex-col">
                                    <label className="text-sm font-medium text-slate-500 uppercase tracking-wider">Szabad időpontok</label>
                                    <SelectforDatetime datetimes={freedates} />
                                </div>
                            ) : (
                                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
                                    <p className="text-amber-800 font-medium">
                                        Jelenleg minden időpontunk foglalt. Kérjük, érdeklődj telefonon!
                                    </p>
                                </div>
                            )}

                            {actionData?.errors?.appointmentDate && (
                                <p className="mt-4 text-red-500 text-sm font-medium flex items-center gap-1">
                                    <span className="text-lg">⚠️</span> {actionData.errors.appointmentDate[0]}
                                </p>
                            )}
                        </div>

                      
                        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold">Hiba leírása</h2>
                            </div>
                            
                            <textarea 
                                id="message" 
                                name="message" 
                                rows={5} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none placeholder:text-slate-400" 
                                placeholder="Pl.: Defektet kaptam, vagy furcsa hangot ad a középcsapágy..."
                            ></textarea>
                            
{actionData?.errors?.message && actionData.errors.message[0] && (
                                <p className="mt-3 text-red-500 text-sm font-medium">{actionData.errors.message[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* Oldalsáv: Fontos infó és Beküldés */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-red-400">
                                    <span className="animate-pulse">●</span> Fontos!
                                </h2>
                                <p className="text-slate-300 leading-relaxed mb-6">
                                    A javítás várható befejezéséről és a kerékpár átvételének időpontjáról minden esetben <strong>e-mailben</strong> küldünk értesítést.
                                </p>
                                <div className="pt-4 border-t border-slate-700">
                                    <p className="text-sm text-slate-400 italic text-right">Üdvözlettel: A csapat</p>
                                </div>
                            </div>
                            {/* Dekoratív elem */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
                        </div>

                        <button 
                            type="submit" 
                            className={`w-full py-4 px-6 rounded-xl text-lg font-bold transition-all transform active:scale-95 shadow-lg
                                ${freedates.length === 0 
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/25"
                                }`}
                            disabled={freedates.length === 0}
                        >
                            Foglalás beküldése
                        </button>
                        
                        <div className="flex justify-center">
                            <BackToWebShopButton />
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
}