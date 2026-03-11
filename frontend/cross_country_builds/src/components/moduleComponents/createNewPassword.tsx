import { Label, TextInput, Button, Card } from "flowbite-react";
import { HiLockClosed, HiCheckCircle,HiCheck, HiExclamationCircle } from "react-icons/hi";
import { Form, useActionData, useNavigation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function CreateNewPasswordModule() {
  const actionData = useActionData() as any;
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
    useEffect(() => {
      if (actionData?.message) {
        setTimeout(() => {
          navigate(actionData?.redirect);
        }, 5000); 
      }
    }, [actionData]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-2 sm:px-2 py-5 md:py-8">
      
      
      <Card className="w-full max-w-5xl border-none shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-[#1e293b] rounded-[2rem] md:rounded-[3rem] overflow-hidden p-0">
        <div className="flex flex-col lg:flex-row items-stretch max-h-[600px]">
          
         
          <div className="lg:w-2/5 p-2 md:p-12  flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-700/50 bg-[#1e293b]">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-[0.85]">
              Új jelszó<br/>
              <span className="text-blue-500 text-3xl">létrehozása</span>
            </h2>
            <p className="text-gray-400 mt-6 md:mt-10 font-bold uppercase italic tracking-[0.15em] text-[10px] md:text-xs leading-relaxed">
              Kérjük, adjon meg egy erős, <br className="hidden md:block"/> új jelszót a fiókjához!
            </p>
          </div>

         
          <div className="lg:w-3/5 p-3 sm:p-8 md:p-12 flex flex-col justify-center bg-[#1e293b]">
            <Form method="post" className="flex flex-col gap-5 w-full">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-x-8 md:gap-y-6">
                
           
                <div className="space-y-2">
                  <Label className="text-[10px] md:text-[11px] font-black uppercase text-gray-500 tracking-widest ml-1">
                    Új jelszó
                  </Label>
                  <TextInput
                    id="newjelszo"
                    name="newjelszo"
                    type="password"
                    icon={HiLockClosed}
                    placeholder="az új jelszavad"
                    className="[&_input]:bg-gray-800/40 [&_input]:border-gray-700 [&_input]:text-white [&_input]:py-3 md:[&_input]:py-4 [&_input]:rounded-xl focus:[&_input]:ring-blue-500"
                    color={actionData?.errors?.newjelszo ? "failure" : "gray"}
                  />
                  {actionData?.errors?.newjelszo && (
                    <p className="text-red-500 text-[10px] font-black uppercase italic ml-1 tracking-tighter">
                      {actionData.errors.newjelszo}
                    </p>
                  )}
                </div>

               
                <div className="space-y-2">
                  <Label className="text-[10px] md:text-[11px] font-black uppercase text-gray-500 tracking-widest ml-1">
                    Jelszó megerősítése
                  </Label>
                  <TextInput
                    id="newjelszo2"
                    name="newjelszo2"
                    type="password"
                    icon={HiCheckCircle}
                    placeholder="új jelszó mégegyszer"
                    className="[&_input]:bg-gray-800/40 [&_input]:border-gray-700 [&_input]:text-white [&_input]:py-3 md:[&_input]:py-4 [&_input]:rounded-xl focus:[&_input]:ring-blue-500"
                    color={actionData?.errors?.newjelszo2 ? "failure" : "gray"}
                  />
                  {actionData?.errors?.newjelszo2 && (
                    <p className="text-red-500 text-[10px] font-black uppercase italic ml-1 tracking-tighter">
                      {actionData.errors.newjelszo2}
                    </p>
                  )}
                </div>
              </div>

          
              {actionData?.serverError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase italic">
                  <HiExclamationCircle className="h-5 w-5" />
                  {actionData.serverError}
                </div>
              )}

         
              <div className="flex justify-center md:justify-end pt-2">
                {actionData?.message && (
                              <p className="text-green-500 text-sm font-black uppercase italic ml-1 tracking-tighter flex justify-center gap-1">
                                <HiCheck className="h-4 w-4" /> {actionData.message}
                              </p>
                )}
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-12 h-14 bg-blue-600 enabled:hover:bg-blue-700 rounded-xl md:rounded-2xl font-black uppercase italic tracking-widest shadow-[0_15px_30px_rgba(37,99,235,0.3)] transition-all active:scale-95 border-none"
                >
                  {isSubmitting ? "Mentés..." : "Új jelszó mentése"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
}