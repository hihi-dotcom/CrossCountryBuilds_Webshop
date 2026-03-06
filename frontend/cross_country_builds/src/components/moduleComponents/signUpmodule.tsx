import { Label, TextInput, Button, Card } from "flowbite-react";
import { HiUser, HiMail, HiLockClosed, HiArrowRight, HiExclamationCircle, HiCheckCircle } from "react-icons/hi";
import { Link, Form, useActionData, useNavigation } from "react-router-dom";
import BackToWebShopButton from "../buttonComponents/backtoWebshopButton";
import { act } from "react";

export default function SignUpModule() {
  const actionData = useActionData() as any;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 sm:px-4 py-6 md:py-10">
      
      <Card className="w-full max-w-5xl border-none shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-[#1e293b] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden p-0">
        <div className="flex flex-col lg:flex-row items-stretch">

          <div className="lg:w-1/3 p-6 md:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-700/50 bg-[#1e293b]">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-[0.85]">
              Regiszt
              <span className="text-blue-500 text-4xl leading-[0.85]">ráció</span>
            </h2>
            <p className="text-gray-400 mt-2 md:mt-6 font-bold uppercase italic tracking-widest text-[10px] md:text-xs">
              Csatlakozz a közösséghez!
            </p>
          </div>


          <div className="lg:w-2/3 p-4 sm:p-8 md:p-12 flex flex-col justify-center bg-[#1e293b]">
            <Form method="post" className="flex flex-col gap-4 md:gap-6 w-full">
              
    
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6 md:gap-y-4">
                
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">
                    Felhasználónév
                  </Label>
                  <TextInput
                    name="username"
                    icon={HiUser}
                    placeholder="név"
                    sizing="md"
                    className="[&_input]:bg-gray-800/40 [&_input]:border-gray-700 [&_input]:text-white [&_input]:py-2.5 md:[&_input]:py-3 [&_input]:rounded-xl focus:[&_input]:ring-blue-500"
                    color={actionData?.errors?.username ? "failure" : "gray"}
                  />
                  {actionData?.errors?.username && (
                    <p className="text-red-500 text-[9px] font-black uppercase italic ml-1">{actionData.errors.username}</p>
                  )}
                </div>


                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">
                    Email cím
                  </Label>
                  <TextInput
                    name="email"
                    type="email"
                    icon={HiMail}
                    placeholder="e-mail"
                    sizing="md"
                    className="[&_input]:bg-gray-800/40 [&_input]:border-gray-700 [&_input]:text-white [&_input]:py-2.5 md:[&_input]:py-3 [&_input]:rounded-xl focus:[&_input]:ring-blue-500"
                    color={actionData?.errors?.email ? "failure" : "gray"}
                  />
                  {actionData?.errors?.email && (
                    <p className="text-red-500 text-[9px] font-black uppercase italic ml-1">{actionData.errors.email}</p>
                  )}
                </div>


                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">
                    Jelszó
                  </Label>
                  <TextInput
                    name="password"
                    type="password"
                    icon={HiLockClosed}
                    placeholder="jelszó"
                    sizing="md"
                    className="[&_input]:bg-gray-800/40 [&_input]:border-gray-700 [&_input]:text-white [&_input]:py-2.5 md:[&_input]:py-3 [&_input]:rounded-xl focus:[&_input]:ring-blue-500"
                    color={actionData?.errors?.password ? "failure" : "gray"}
                  />
                  {actionData?.errors?.password && (
                    <p className="text-red-500 text-[9px] font-black uppercase italic ml-1">{actionData.errors.password}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">
                    Jelszó újra
                  </Label>
                  <TextInput
                    name="confirmPassword"
                    type="password"
                    icon={HiCheckCircle}
                    placeholder="jelszó újra"
                    sizing="md"
                    className="[&_input]:bg-gray-800/40 [&_input]:border-gray-700 [&_input]:text-white [&_input]:py-2.5 md:[&_input]:py-3 [&_input]:rounded-xl focus:[&_input]:ring-blue-500"
                    color={actionData?.errors?.confirmPassword ? "failure" : "gray"}
                  />
                  {actionData?.errors?.confirmPassword && (
                    <p className="text-red-500 text-[9px] font-black uppercase italic ml-1">{actionData.errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className=" flex sm:flex-row items-center justify-between gap-4 pt-2">
                {actionData?.serverError && (
                    <div className="mt-2 text-red-500 flex items-center gap-2 text-xs font-bold uppercase italic">
                      <HiExclamationCircle /> {actionData.serverError}
                    </div>
                  )}
                <div className="hidden items-center gap-5 justify-center sm:flex sm:flex-row sm:items-start order-2 sm:order-1">
                  <span className="text-gray-300 text-sm font-black uppercase tracking-widest italic">Van már fiókod?</span>
                  <Link to="/login" className="text-sm text-gray-200 rounded-full bg-gray-600 px-2 py-1 font-bold uppercase italic hover:text-white flex items-center">
                    Lépj be itt <HiArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 h-12 bg-blue-600 enabled:hover:bg-blue-700 rounded-xl font-black uppercase italic tracking-widest shadow-lg transition-all active:scale-95 border-none order-1 sm:order-2"
                >
                  {isSubmitting ? "..." : "Regisztrálok!"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
}