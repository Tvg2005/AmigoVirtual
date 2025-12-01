import { CallToActionSection } from "./sections/CallToActionSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { FooterSection } from "./sections/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { NavigationSection } from "./sections/NavigationSection";
import { PricingSection } from "./sections/PricingSection/PricingSection";
import { ServicesSection } from "./sections/ServicesSection/ServicesSection";
import AccessibilityMenu from "./components/AccessibilityMenu";

const Desktop = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full bg-white relative">
      {/* Botão de Acessibilidade */}
      <div className="fixed top-4 right-4 z-50">
        <AccessibilityMenu />
      </div>

      <NavigationSection />
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <PricingSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  );
};

export default Desktop;
