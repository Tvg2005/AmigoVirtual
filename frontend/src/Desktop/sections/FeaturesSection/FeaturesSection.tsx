import { Card, CardContent } from "../../../components/card";

// Feature data for mapping
const features = [
  {
    id: 1,
    title: "Lembretes inteligentes",
    description:
      "Ajuda o idoso a lembrar da hora do remédio, compromissos e outras tarefas importantes com total autonomia.",
    image: "/visual.png",
    imageAlt: "Visual",
    variant: "light",
    size: "small",
  },
  {
    id: 2,
    title: "Fácil de usar, fácil de confiar",
    description:
      "Um painel simples e intuitivo para acessar jogos, músicas e conversar com o assistente virtual.",
    backgroundImage: "/visual-1.png",
    variant: "dark",
    size: "large",
  },
  {
    id: 3,
    title: "Acompanhe tudo com clareza",
    description:
      "Relatórios fáceis de entender sobre o uso do app ajudam a monitorar o bem-estar do idoso com respeito e privacidade.",
    backgroundImage: "/visual-2.png",
    variant: "dark",
    size: "large",
  },
  {
    id: 4,
    title: "Companhia e acolhimento em qualquer hora",
    description:
      "Nosso assistente conversa de forma natural, oferecendo apoio emocional, atividades e até leitura em voz alta.",
    image: "/visual-3.png",
    imageAlt: "Visual",
    variant: "light",
    size: "small",
  },
];

export const FeaturesSection = (): JSX.Element => {
  return (
    <section className="flex flex-col items-center gap-8 px-12 py-20">
      <h2 className="max-w-[674px] text-2xl md:text-3xl lg:text-4xl font-bold text-[#13485d] text-center leading-tight">
        A inteligência artificial a favor do bem-estar e da autonomia dos
        idosos.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 w-full">
        {/* First row */}
        <div className="md:col-span-4">
          <FeatureCard feature={features[0]} />
        </div>
        <div className="md:col-span-8">
          <FeatureCard feature={features[1]} />
        </div>

        {/* Second row */}
        <div className="md:col-span-8">
          <FeatureCard feature={features[2]} />
        </div>
        <div className="md:col-span-4">
          <FeatureCard feature={features[3]} />
        </div>
      </div>
    </section>
  );
};

// Feature card component to handle different variants
const FeatureCard = ({
  feature,
}: {
  feature: (typeof features)[0];
}): JSX.Element | null => {
  if (feature.variant === "light") {
    return (
      <Card className="h-[400px] bg-[#82a9d40f] rounded-[10px] border border-solid border-[#ffffff26]">
        <CardContent className="p-10 flex flex-col h-full text-wrap-normal">
          {feature.image && (
            <div className="mb-auto">
              <img
                className="w-full h-auto object-contain max-h-[160px]"
                alt={feature.imageAlt}
                src={feature.image}
              />
            </div>
          )}
          <div className="mt-auto">
            <h3 className="text-xl font-semibold text-[#13485d] leading-tight mb-2">
              {feature.title}
            </h3>
            <p className="text-base font-medium text-[#13485db2] leading-relaxed">
              {feature.description}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (feature.variant === "dark") {
    return (
      <Card
        className="h-[400px] rounded-[10px] relative overflow-hidden"
        style={{
          backgroundImage: `url(${feature.backgroundImage})`,
          backgroundSize: "100% 100%",
        }}
      >
        <CardContent className="p-0 h-full">
          <div className="absolute bottom-0 left-0 p-10">
            <h3 className="font-bold text-white text-xl leading-[31px] mb-0">
              {feature.title}
            </h3>
            <p className="font-semibold text-[#ffffffb2] text-base leading-[26px] mt-0">
              {feature.description}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};