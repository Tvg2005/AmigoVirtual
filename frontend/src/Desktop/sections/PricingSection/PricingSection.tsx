import React from "react";
import { Check } from "lucide-react";

// Define prop types for components
interface ComponentProps {
  children: React.ReactNode;
  className?: string;
}

interface ButtonProps extends ComponentProps {
  onClick?: () => void;
}

const Badge: React.FC<ComponentProps> = ({ children, className }) => (
  <div className={className}>
    {children}
  </div>
);

const Button: React.FC<ButtonProps> = ({ children, className, onClick }) => (
  <button className={className} onClick={onClick}>
    {children}
  </button>
);

const Card: React.FC<ComponentProps> = ({ children, className }) => (
  <div className={className}>
    {children}
  </div>
);

const CardHeader: React.FC<ComponentProps> = ({ children, className }) => (
  <div className={className}>
    {children}
  </div>
);

const CardContent: React.FC<ComponentProps> = ({ children, className }) => (
  <div className={className}>
    {children}
  </div>
);

// Define plan structure type
interface Plan {
  id: string;
  name: string;
  price: string;
  buttonText: string;
  buttonVariant: string;
  highlighted: boolean;
  badge?: string;
  features: string[];
}

// Define plan data for reusability and maintainability
const plans: Plan[] = [
  {
    id: "free",
    name: "Plano Gratuito",
    price: "$X",
    buttonText: "Teste gratuitamente",
    buttonVariant: "default",
    highlighted: false,
    features: [
      "Lorem ipsum dolor sit amet.",
      "Consectetur adipiscing elit",
      "Adipiscing elit",
      "Etiam euismod sem cursus",
      "Risus sollicitudin",
    ],
  },
  {
    id: "pro",
    name: "Plano Pro",
    price: "$Y",
    buttonText: "Garanta agora",
    buttonVariant: "secondary",
    highlighted: true,
    badge: "Em alta",
    features: [
      "Purus imperdiet lobortis",
      "Sed consectetur dolor ac nisl pretium",
      "Morbi augue lacus, dictum nec erat a",
      "Morbi tempor neque sapien",
      "Praesent in est lectus",
      "Etiam auctor odio sit amet",
      "Bibendum ultricies",
    ],
  },
  {
    id: "family",
    name: "Plano Família",
    price: "$W",
    buttonText: "Garanta agora",
    buttonVariant: "default",
    highlighted: false,
    features: [
      "Vivamus auctor justo ligula",
      "Turpis ac egestas scelerisque",
      "Nunc facilisis odio at",
      "Purus bibendum tincidunt",
      "Aenean vehicula pharetra sem",
      "Turpis ac egestas scelerisque",
      "Ea egestas scelerisque",
      "Aquasta egestas scelque",
      "Egestas scelacuelque",
      "Nunc facilisis odio at",
    ],
  },
];

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing-section" className="flex flex-col items-center py-16 relative bg-gradient-radial from-[rgba(130,169,212,0.6)] via-[rgba(255,255,255,0.8)] to-white">
      <div className="relative w-full max-w-7xl">
        {/* Background circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <div className="w-[1032px] h-[1032px] rounded-full bg-[#0084ba33] border border-solid border-black opacity-10" />
            <div className="w-[871px] h-[908px] absolute top-[62px] left-[81px] rounded-[435.5px/454px] bg-[#0084ba33] border border-solid border-black opacity-10" />
            <div className="w-[742px] h-[756px] absolute top-[138px] left-[145px] rounded-[371px/378px] bg-[#0084ba33] border border-solid border-black opacity-10" />
          </div>
        </div>
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-12">
          {/* Header */}
          <div className="flex flex-col items-center gap-6 text-center">
            <Badge className="border-2 border-[#69b0cd]/40 text-[#69b0cd] bg-white/80 px-4 py-2 rounded-full text-sm font-medium">
              tecnologia a favor do bem-estar
            </Badge>

            <h2 className="text-5xl md:text-6xl font-bold leading-tight text-center max-w-4xl"
                style={{
                  background: 'linear-gradient(to bottom, #69b0cd, #357088)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                } as React.CSSProperties}>
              Um jeito mais simples e seguro de cuidar de quem você ama
            </h2>

            <p className="max-w-lg text-xl text-[#13485d] text-center leading-relaxed">
              Transforme a rotina do idoso com um assistente virtual fácil de usar, que conversa, cuida e oferece companhia
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative w-full max-w-6xl items-end">
            {plans.map((plan: Plan, index: number) => {
              // Calculate height classes based on plan type for progressive sizing
              let heightClass: string = "";
              if (index === 0) {
                // Plano Gratuito - menor
                heightClass = "h-[500px]";
              } else if (index === 1) {
                // Plano Pro - médio (destacado)
                heightClass = "h-[580px]";
              } else {
                // Plano Família - maior
                heightClass = "h-[620px]";
              }

              // Calculate card styling based on highlighted status
              const cardClasses: string = plan.highlighted
                ? "bg-[#69b0cd] text-white shadow-2xl"
                : "bg-white text-[#69b0cd] shadow-lg";

              return (
                <div key={plan.id} className="flex flex-col">
                  <Card className={`${cardClasses} ${heightClass} rounded-3xl overflow-hidden border-0 relative flex flex-col`}>
                    {/* Badge for highlighted plan */}
                    {plan.badge && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-400/80 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {plan.badge}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pt-8 px-8 pb-6">
                      <h3 className={`text-lg font-semibold mb-4 ${plan.highlighted ? "text-white" : "text-[#82a9d4]"}`}>
                        {plan.name}
                      </h3>

                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold">
                          {plan.price}
                        </span>
                        <span className={`text-sm ${plan.highlighted ? "text-white/80" : "text-[#82a9d4]"}`}>
                          /por mês
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="px-8 pb-8 flex-1 flex flex-col">
                      <Button 
                        className={`w-full py-3 rounded-xl font-semibold mb-6 transition-colors ${
                          plan.highlighted 
                            ? "bg-white text-[#69b0cd] hover:bg-gray-100" 
                            : "bg-[#69b0cd] text-white hover:bg-[#5a9bb8]"
                        }`}>
                        {plan.buttonText}
                      </Button>

                      <div className="space-y-3 flex-1">
                        {plan.features.map((feature: string, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              plan.highlighted ? "text-white" : "text-[#69b0cd]"
                            }`} />
                            <span className={`text-sm leading-relaxed ${
                              plan.highlighted ? "text-white" : "text-gray-700"
                            }`}>
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};