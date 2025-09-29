import { InstagramIcon, TwitterIcon, YoutubeIcon } from "lucide-react";


// Define footer navigation data for better maintainability
const footerData = {
  product: {
    title: "Produto",
    links: ["Recursos", "Integrações", "Updates", "FAQ", "Preços"],
  },
  company: {
    title: "Compania",
    links: ["Sobre nós", "Blog", "Manifesto"],
  },
  resources: {
    title: "Recursos",
    links: ["Docs"],
  },
  legal: {
    title: "",
    links: ["Termos de Privacidade", "Política de privacidade"],
  },
};

export const FooterSection = (): JSX.Element => {
  return (
    <footer className="flex flex-wrap w-full items-start justify-between px-[45px] py-[41px] relative flex-[0_0_auto] bg-transparent [background:linear-gradient(180deg,rgba(105,176,205,0.36)_0%,rgba(130,169,212,1)_100%)]">
      <div className="flex w-full justify-between">
        {/* Logo */}
        <img
          className="relative w-[99px] h-[73px]"
          alt="Logokit"
          src="/logokit-1.png"
        />

        {/* Navigation Links */}
        <div className="flex items-start justify-center gap-[60px] relative">
          <div className="flex items-start justify-center gap-[60px] relative">
            {/* Product Column */}
            <div className="flex flex-col items-start gap-5 relative">
              <div className="relative w-fit mt-[-1.00px] font-heading-6 font-[number:var(--heading-6-font-weight)] text-white text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] whitespace-nowrap [font-style:var(--heading-6-font-style)]">
                {footerData.product.title}
              </div>

              {footerData.product.links.map((link, index) => (
                <div
                  key={`product-${index}`}
                  className="relative w-fit font-body-XS font-[number:var(--body-XS-font-weight)] text-white text-[length:var(--body-XS-font-size)] tracking-[var(--body-XS-letter-spacing)] leading-[var(--body-XS-line-height)] whitespace-nowrap [font-style:var(--body-XS-font-style)]"
                >
                  {link}
                </div>
              ))}
            </div>

            {/* Company Column */}
            <div className="flex flex-col items-start gap-5 relative">
              <div className="text-white relative w-fit mt-[-1.00px] font-heading-6 font-[number:var(--heading-6-font-weight)] text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] whitespace-nowrap [font-style:var(--heading-6-font-style)]">
                {footerData.company.title}
              </div>

              {footerData.company.links.map((link, index) => (
                <div
                  key={`company-${index}`}
                  className="relative w-fit font-body-XS font-[number:var(--body-XS-font-weight)] text-white text-[length:var(--body-XS-font-size)] tracking-[var(--body-XS-letter-spacing)] leading-[var(--body-XS-line-height)] whitespace-nowrap [font-style:var(--body-XS-font-style)]"
                >
                  {link}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start justify-center gap-[60px] relative">
            {/* Resources Column */}
            <div className="flex flex-col items-start gap-5 relative">
              <div className="mt-[-1.00px] font-[number:var(--heading-6-font-weight)] text-white relative w-fit font-heading-6 text-[length:var(--heading-6-font-size)] tracking-[var(--heading-6-letter-spacing)] leading-[var(--heading-6-line-height)] whitespace-nowrap [font-style:var(--heading-6-font-style)]">
                {footerData.resources.title}
              </div>

              {footerData.resources.links.map((link, index) => (
                <div
                  key={`resources-${index}`}
                  className="relative w-fit font-body-XS font-[number:var(--body-XS-font-weight)] text-white text-[length:var(--body-XS-font-size)] tracking-[var(--body-XS-letter-spacing)] leading-[var(--body-XS-line-height)] whitespace-nowrap [font-style:var(--body-XS-font-style)]"
                >
                  {link}
                </div>
              ))}
            </div>

            {/* Legal Column */}
            <div className="flex flex-col items-start gap-5 relative">
              {footerData.legal.links.map((link, index) => (
                <div
                  key={`legal-${index}`}
                  className="relative w-fit font-body-XS font-[number:var(--body-XS-font-weight)] text-white text-[length:var(--body-XS-font-size)] tracking-[var(--body-XS-letter-spacing)] leading-[var(--body-XS-line-height)] whitespace-nowrap [font-style:var(--body-XS-font-style)]"
                >
                  {link}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="flex items-start gap-[30px] mt-6 ml-auto">
        <TwitterIcon className="w-6 h-6 text-white" />
        <InstagramIcon className="w-6 h-6 text-white" />
        <YoutubeIcon className="w-6 h-6 text-white" />
      </div>
    </footer>
  );
};
