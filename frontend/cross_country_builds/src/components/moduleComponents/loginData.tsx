import { Label, TextInput, Button, Card } from "flowbite-react";
import { HiUser, HiLockClosed, HiArrowRight, HiExclamationCircle } from "react-icons/hi";
import { Link, Form, useActionData, useNavigate, useNavigation } from "react-router-dom";
import { useEffect } from "react";


export default function LoginModule() {
  const actionData = useActionData() as any;
  const navigation = useNavigate();

  const navigating = useNavigation();
  const isSubmitting = navigating.state === "submitting";

  useEffect(() => {
    if(actionData){
      if(actionData.success){
        const targetPage = actionData.userData?.role === 'admin' ? "/admin" : "/";

        navigation(targetPage, {
          state: {
            toastMsg: actionData.message,
            toastStatus: actionData.status
          }
        })
      }
    }
    
    
  }, [actionData,navigation])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-2 sm:px-4 py-8 md:py-12">
      
      <Card className="w-full max-w-5xl border-none shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-[#1e293b] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden p-0">
        <div className="flex flex-col lg:flex-row items-stretch">
          

          <div className="lg:w-2/5 p-8 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-700/50 bg-[#1e293b]">
            <h2 className="text-4xl  font-black text-white uppercase italic tracking-tighter leading-[0.85] flex flex-row">
              Bejelent
              <span className="text-blue-500 text-4xl  leading-[0.85]">kezés</span>
            </h2>
            <p className="text-gray-400 mt-6 md:mt-8 font-bold uppercase italic tracking-widest text-xs md:text-sm">
              Üdvözöljük újra a Cross Country webshopban!
            </p>
          </div>

          
          <div className="lg:w-3/5 p-5 sm:p-8 md:p-10 flex flex-col justify-center bg-[#1e293b]">
            <Form method="post" className="flex flex-col gap-8 w-full">
              
             
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">

                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Felhasználónév
                  </Label>
                  <TextInput
                    id="username"
                    name="username"
                    icon={HiUser}
                    placeholder="felhasználónév"
                    
                    className="w-full [&_input]:bg-gray-800/40 [&_input]:border-gray-700 [&_input]:text-white [&_input]:py-3 md:[&_input]:py-4 [&_input]:rounded-2xl focus:[&_input]:ring-blue-500"
                    color={actionData?.errors?.username ? "failure" : "gray"}
                  />
                  {actionData?.errors?.username && (
                    <span className="text-red-500 text-[10px] font-bold italic ml-1 uppercase">{actionData.errors.username[0]}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Jelszó
                  </Label>
                  <TextInput
                    id="password"
                    name="password"
                    type="password"
                    icon={HiLockClosed}
                    placeholder="••••••••"
                    className="w-full [&_input]:bg-gray-800/40 [&_input]:border-gray-700 [&_input]:text-white [&_input]:py-3 md:[&_input]:py-4 [&_input]:rounded-2xl focus:[&_input]:ring-blue-500"
                    color={actionData?.errors?.password ? "failure" : "gray"}
                  />
                  {actionData?.errors?.password && (
                    <span className="text-red-500 text-[10px] font-bold italic ml-1 uppercase">{actionData.errors.password[0]}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col items-center md:items-start order-2 md:order-1">
                  <Link to="/getnewpass" className="text-sm text-blue-400 font-bold uppercase italic hover:text-blue-300">
                    Elfelejtettem a jelszavam
                  </Link>
                  {actionData?.serverError && (
                    <div className="mt-2 text-red-500 flex items-center gap-2 text-xs font-bold uppercase italic">
                      <HiExclamationCircle /> {actionData.serverError}
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-10 md:px-12 h-12 md:h-14 bg-blue-600 enabled:hover:bg-blue-700 rounded-xl md:rounded-2xl font-black uppercase italic tracking-widest shadow-lg shadow-blue-900/40 order-1 md:order-2 border-none"
                >
                  {isSubmitting ? "Belépés..." : "Bejelentkezés"}
                </Button>
              </div>
            </Form>

            <div className="mt-3 md:mt-6 pt-8 border-t border-gray-700/50 flex flex-col md:flex-row items-center justify-between gap-2">
              <span className="text-gray-500 text-sm font-black uppercase tracking-widest italic text-center">Nincs még fiókod?</span>
              <Link to="/signup" className="w-full md:w-auto">
                <Button color="gray" outline pill className="w-full md:w-auto border-2 border-gray-700 text-white font-black text-sm uppercase tracking-widest group hover:bg-white hover:text-[#1e293b]">
                  Regisztrálok
                  <HiArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}