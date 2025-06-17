import { ChevronDownIcon } from "lucide-react";
import { Button } from "../../../components/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../../components/navigation-menu";
import { Link } from "react-router-dom";

export const NavigationSection = (): JSX.Element => {
  // Navigation menu items data
  const navItems = [
    { name: "Recursos", hasDropdown: false },
    { name: "Compania", hasDropdown: false },
    { name: "Blog", hasDropdown: false },
    { name: "Contato", hasDropdown: false },
    { name: "FAQ", hasDropdown: false },
  ];

  return (
    <header className="flex items-center justify-center gap-[74px] py-[13px] border-b border-[#ffffff26] w-full">
      {/* Logo */}
      <div className="relative w-[38px] h-[38px] bg-[url(/logo.png)] bg-cover bg-[50%_50%]" />

      {/* Navigation Menu */}
      <NavigationMenu className="px-10 py-2 rounded-[60px] border border-solid border-[#ffffff26]">
        <NavigationMenuList className="flex items-center gap-[30px]">
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
                <span className="font-medium text-[#13475c] [font-family:'Inter',Helvetica] text-[13px] leading-[26px] cursor-pointer">
                  {item.name}
                </span>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Registration Button */}
      <div className="p-1.5 rounded-xl border border-solid border-[#ffffff26]">
        <Button className="w-[109px] h-[30px] px-[15px] py-0.5 bg-[#69b0cd] rounded-lg border border-solid border-[#ffffff26] shadow-[inset_0px_0px_6px_3px_#ffffff40] backdrop-blur-[7px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(7px)_brightness(100%)]">
          <Link to="/register" className="block w-full h-full">
            <span className="[font-family:'Inter',Helvetica] font-medium text-white text-sm text-center leading-[26px] whitespace-nowrap">
              Registre-se
            </span>
          </Link>
        </Button>
      </div>
    </header>
  );
};
