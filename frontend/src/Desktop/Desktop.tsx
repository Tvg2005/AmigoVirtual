import { CallToActionSection } from "./sections/CallToActionSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { FooterSection } from "./sections/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { NavigationSection } from "./sections/NavigationSection";
import { PricingSection } from "./sections/PricingSection/PricingSection";
import { ServicesSection } from "./sections/ServicesSection/ServicesSection";

const Desktop = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full bg-white">
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
