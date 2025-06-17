import { Card, CardContent } from "../../../components/card";

export const ServicesSection = (): JSX.Element => {
  // Define service features data for easy mapping
  const serviceFeatures = [
    {
      icon: "/bell-ringing-1.svg",
      alt: "Bell ringing",
      title: "Lembretes de remédios",
      description: "Alertas programados com confirmação de uso.",
    },
    {
      icon: "/sparkle-1.svg",
      alt: "Sparkle",
      title: "Botão de emergência",
      description: "Contato rápido com familiares em casos urgentes.",
    },
    {
      icon: "/cursor-click-1.svg",
      alt: "Cursor click",
      title: "Assistente de conversas",
      description:
        "Diálogos naturais, com voz ou texto, para diminuir a solidão e estimular a mente.",
    },
    {
      icon: "/chart-line-1.svg",
      alt: "Chart line",
      title: "Jogos interativos",
      description:
        "Estimulam a memória, o raciocínio e garantem momentos de diversão.",
    },
    {
      icon: "/gauge-1.svg",
      alt: "Gauge",
      title: "Músicas favoritas",
      description:
        "Ouça músicas com controle total da reprodução e playlists personalizadas.",
    },
    {
      icon: "/target-1.svg",
      alt: "Target",
      title: "Painel intuitivo",
      description: "Interface simples, pensada especialmente para idosos.",
    },
    {
      icon: "/magic-wand-1.svg",
      alt: "Magic wand",
      title: "Login seguro com autenticação",
      description: "Garantia de proteção e privacidade para todos os usuários.",
    },
    {
      icon: "/list-checks-1.svg",
      alt: "List checks",
      title: "Configurações de acessibilidade",
      description: "Letras maiores, alto contraste e comandos por voz.",
    },
    {
      icon: "/files-1.svg",
      alt: "Files",
      title: "Relatórios visuais",
      description:
        "Facilita o acompanhamento da rotina, com total respeito à privacidade.",
    },
  ];

  return (
    <section className="w-full py-[76px] px-[50px] border border-solid border-[#ffffff26] bg-gradient-to-br from-[rgba(130,169,212,1)] to-[rgba(105,176,205,0.63)]">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-10">
        <h2 className="text-white font-heading-2 text-[length:var(--heading-2-font-size)] tracking-[var(--heading-2-letter-spacing)] leading-[var(--heading-2-line-height)] font-[number:var(--heading-2-font-weight)] [font-style:var(--heading-2-font-style)] max-w-[647px]">
          Conheça os recursos do nosso chatbot
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[60px]">
          {/* First column */}
          <div className="flex flex-col gap-10">
            {serviceFeatures.slice(0, 3).map((feature, index) => (
              <Card
                key={index}
                className="bg-transparent border-none shadow-none"
              >
                <CardContent className="p-0 flex flex-col gap-2.5">
                  <div className="flex items-center gap-[5px]">
                    <img
                      className="w-4 h-4"
                      alt={feature.alt}
                      src={feature.icon}
                    />
                    <h5 className="font-heading-5 font-[number:var(--heading-5-font-weight)] text-white text-[length:var(--heading-5-font-size)] tracking-[var(--heading-5-letter-spacing)] leading-[var(--heading-5-line-height)] whitespace-nowrap [font-style:var(--heading-5-font-style)]">
                      {feature.title}
                    </h5>
                  </div>
                  <p className="font-medium text-[#ffffffb2] text-base leading-[26px] font-['Inter',Helvetica] max-w-[322px]">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Second column */}
          <div className="flex flex-col gap-10">
            {serviceFeatures.slice(3, 6).map((feature, index) => (
              <Card
                key={index}
                className="bg-transparent border-none shadow-none"
              >
                <CardContent className="p-0 flex flex-col gap-2.5">
                  <div className="flex items-center gap-[5px]">
                    <img
                      className="w-4 h-4"
                      alt={feature.alt}
                      src={feature.icon}
                    />
                    <h5 className="font-heading-5 font-[number:var(--heading-5-font-weight)] text-white text-[length:var(--heading-5-font-size)] tracking-[var(--heading-5-letter-spacing)] leading-[var(--heading-5-line-height)] whitespace-nowrap [font-style:var(--heading-5-font-style)]">
                      {feature.title}
                    </h5>
                  </div>
                  <p className="font-medium text-[#ffffffb2] text-base leading-[26px] font-['Inter',Helvetica] max-w-[322px]">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Third column */}
          <div className="flex flex-col gap-10">
            {serviceFeatures.slice(6, 9).map((feature, index) => (
              <Card
                key={index}
                className="bg-transparent border-none shadow-none"
              >
                <CardContent className="p-0 flex flex-col gap-2.5">
                  <div className="flex items-center gap-[5px]">
                    <img
                      className="w-4 h-4"
                      alt={feature.alt}
                      src={feature.icon}
                    />
                    <h5 className="font-heading-5 font-[number:var(--heading-5-font-weight)] text-white text-[length:var(--heading-5-font-size)] tracking-[var(--heading-5-letter-spacing)] leading-[var(--heading-5-line-height)] whitespace-nowrap [font-style:var(--heading-5-font-style)]">
                      {feature.title}
                    </h5>
                  </div>
                  <p className="font-medium text-[#ffffffb2] text-base leading-[26px] font-['Inter',Helvetica] max-w-[322px]">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
