import { Footer, FooterCopyright, FooterDivider, FooterLink, FooterLinkGroup, FooterBrand } from "flowbite-react";
import { HiHome, HiPhone, HiMail, HiCreditCard } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function FooterComponent() {
  return (
    <Footer container className="rounded-none border-t bg-white">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div className="mb-6 md:mb-0">
            <Link to="/">
              <FooterBrand
              src=""
                className="uppercase italic font-black text-xl md:text-2xl text-gray-900 cursor-pointer"
              >
                Cross<span className="text-blue-700">Country</span>
              </FooterBrand>
            </Link>
          </div>

        
          <div className="hidden sm:grid grid-cols-1 gap-6 sm:mt-4 sm:grid-cols-3 sm:gap-6  dark:text-white">
            <div className="flex items-center gap-3">
              <HiHome className="h-8 w-8 text-blue-700 hidden md:inline" />
              <span className="text-base">1025 Budapest, Huhu utca 28.</span>
            </div>
            
            <div className="flex items-center gap-3">
              <HiPhone className="h-8 w-8 text-blue-700 hidden md:inline" />
              <span className="text-base">06 1 334 5678</span>
            </div>

            <div className="flex items-center gap-3">
              <HiMail className="h-8 w-8 text-blue-700 hidden md:inline" />
              <span className="text-base">info@crosscountry.hu</span>
            </div>
          </div>
        </div>

     
        <div className="flex sm:hidden justify-center my-6">
          <Link to="/contacts" className="w-full">
            <button className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md active:scale-95 transition-transform">
              Kapcsolatfelvétel
            </button>
          </Link>
        </div>

        <FooterDivider />
        
            <div className="w-full sm:flex sm:items-center sm:justify-between">
              <FooterCopyright by="CrossCountry™" year={2026} />
              <div className="flex items-center gap-2 pr-6 md:flex">
              
                <a 
                  href="https://www.paypal.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
                    alt="PayPal" 
                    className="h-7 md:h-8 w-auto" 
                  />
                  <span className="sr-only">PayPal</span>
                </a>
              </div>
          
          <FooterLinkGroup className="mt-4 sm:mt-0">
            <Link to="/about">
              <FooterLink as="div" href="" className="cursor-pointer">Rólunk</FooterLink>
            </Link>
          </FooterLinkGroup>
        </div>
      </div>
    </Footer>
  );
}