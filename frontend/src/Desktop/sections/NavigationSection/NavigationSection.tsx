import { ChevronDownIcon, Menu, X } from "lucide-react";
import { Button } from "../../components/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../components/navigation-menu";
import { Link } from "react-router-dom";
import { useState } from "react";

export const NavigationSection = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation menu items data
  const navItems = [
    { name: "Recursos", hasDropdown: false },
    { name: "Compania", hasDropdown: false },
    { name: "Blog", hasDropdown: false },
    { name: "Contato", hasDropdown: false },
    { name: "FAQ", hasDropdown: false },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="flex items-center justify-between lg:justify-center px-4 sm:px-6 lg:px-8 py-3 lg:py-[13px] border-b border-[#ffffff26] w-full relative">
        {/* Logo */}
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 lg:w-[38px] lg:h-[38px] bg-[url(/logo.png)] bg-cover bg-[50%_50%] flex-shrink-0" />

        {/* Desktop Navigation - Hidden on mobile/tablet */}
        <div className="hidden lg:flex items-center gap-[74px]">
          {/* Navigation Menu */}
          <NavigationMenu className="px-6 xl:px-10 py-2 rounded-[60px] border border-solid border-[#ffffff26]">
            <NavigationMenuList className="flex items-center gap-6 xl:gap-[30px]">
              {navItems.map((item, index) => (
                <NavigationMenuItem key={index}>
                  {item.hasDropdown ? (
                    <NavigationMenuTrigger className="flex items-center gap-[3px] bg-transparent hover:bg-transparent focus:bg-transparent">
                      <span className="font-medium text-[#13475c] [font-family:'Inter',Helvetica] text-[13px] leading-[26px]">
                        {item.name}
                      </span>
                      <ChevronDownIcon className="w-3.5 h-3.5 text-[#13475c]" />
                    </NavigationMenuTrigger>
                  ) : (
                    <span className="font-medium text-[#13475c] [font-family:'Inter',Helvetica] text-[13px] leading-[26px] cursor-pointer hover:text-[#69b0cd] transition-colors">
                      {item.name}
                    </span>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Login and Registration Buttons */}
          <div className="flex items-center gap-4">
            <div className="p-1.5 rounded-xl border border-solid border-[#ffffff26]">
              <Button className="w-[109px] h-[30px] px-[15px] py-0.5 bg-transparent border border-[#69b0cd] text-[#69b0cd] rounded-lg hover:bg-[#69b0cd] hover:text-white transition-colors shadow-[inset_0px_0px_6px_3px_#ffffff40] backdrop-blur-[7px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(7px)_brightness(100%)]">
                <Link to="/login" className="block w-full h-full">
                  <span className="[font-family:'Inter',Helvetica] font-medium text-sm text-center leading-[26px] whitespace-nowrap">
                    Login
                  </span>
                </Link>
              </Button>
            </div>
            
            <div className="p-1.5 rounded-xl border border-solid border-[#ffffff26]">
              <Button className="w-[109px] h-[30px] px-[15px] py-0.5 bg-[#69b0cd] rounded-lg border border-solid border-[#ffffff26] shadow-[inset_0px_0px_6px_3px_#ffffff40] backdrop-blur-[7px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(7px)_brightness(100%)]">
                <Link to="/register" className="block w-full h-full">
                  <span className="[font-family:'Inter',Helvetica] font-medium text-white text-sm text-center leading-[26px] whitespace-nowrap">
                    Registre-se
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-lg border border-[#ffffff26] bg-white/80 backdrop-blur-sm"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-[#13475c]" />
          ) : (
            <Menu className="w-5 h-5 text-[#13475c]" />
          )}
        </button>
      </header>

      {/* Mobile/Tablet Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-[#ffffff26] shadow-xl">
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#ffffff26]">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 bg-[url(/logo.png)] bg-cover bg-[50%_50%]" />
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg border border-[#ffffff26] bg-white/80"
              >
                <X className="w-5 h-5 text-[#13475c]" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="px-4 sm:px-6 py-6">
              {/* Navigation Items */}
              <nav className="space-y-4 mb-8">
                {navItems.map((item, index) => (
                  <div key={index} className="block">
                    {item.hasDropdown ? (
                      <button className="flex items-center justify-between w-full py-3 px-4 bg-[#f8fafc] rounded-lg border border-[#ffffff26] hover:bg-[#f1f5f9] transition-colors">
                        <span className="font-medium text-[#13475c] [font-family:'Inter',Helvetica] text-base">
                          {item.name}
                        </span>
                        <ChevronDownIcon className="w-4 h-4 text-[#13475c]" />
                      </button>
                    ) : (
                      <button 
                        className="block w-full py-3 px-4 bg-[#f8fafc] rounded-lg border border-[#ffffff26] hover:bg-[#f1f5f9] transition-colors text-left"
                        onClick={toggleMobileMenu}
                      >
                        <span className="font-medium text-[#13475c] [font-family:'Inter',Helvetica] text-base">
                          {item.name}
                        </span>
                      </button>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile Login and Registration Buttons */}
              <div className="space-y-3">
                <div className="p-1.5 rounded-xl border border-solid border-[#ffffff26] bg-white/50">
                  <Button 
                    className="w-full h-12 px-4 py-2 bg-transparent border border-[#69b0cd] text-[#69b0cd] rounded-lg hover:bg-[#69b0cd] hover:text-white transition-colors shadow-[inset_0px_0px_6px_3px_#ffffff40] backdrop-blur-[7px]"
                    onClick={toggleMobileMenu}
                  >
                    <Link to="/login" className="block w-full h-full flex items-center justify-center">
                      <span className="[font-family:'Inter',Helvetica] font-medium text-base">
                        Login
                      </span>
                    </Link>
                  </Button>
                </div>
                
                <div className="p-1.5 rounded-xl border border-solid border-[#ffffff26] bg-white/50">
                  <Button 
                    className="w-full h-12 px-4 py-2 bg-[#69b0cd] rounded-lg border border-solid border-[#ffffff26] shadow-[inset_0px_0px_6px_3px_#ffffff40] backdrop-blur-[7px] hover:bg-[#5a9bb8] transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    <Link to="/register" className="block w-full h-full flex items-center justify-center">
                      <span className="[font-family:'Inter',Helvetica] font-medium text-white text-base">
                        Registre-se
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};