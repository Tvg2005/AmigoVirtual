import React, { useState } from "react";
import { Card, CardContent } from "../../../components/card";
export const CallToActionSection = (): JSX.Element => {
  const [email, setEmail] = useState("");
  
  // Data for the features text
  const features = ["Sem cartão de crédito", "7-dias de teste grátis"];

  const handleSubmit = () => {
    // Handle form submission here
    console.log("Email submitted:", email);
  };

  return (
    <section className="w-full py-8 flex justify-center">
      <Card className="w-full max-w-[1100px] bg-gradient-to-r from-[#B0DFF3] to-[#6388B1] border border-[#ffffff26] rounded-[10px] overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <h2 className="font-heading-2 text-[56px] font-medium text-white leading-[65px] tracking-[-0.84px] max-w-[554px] mb-16">
            Tire suas dúvidas com a gente
          </h2>

          <div className="flex items-center gap-0 mb-8">
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 w-80 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-l-md"
            />
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-400 hover:bg-blue-500 text-white transition-colors duration-200 font-medium rounded-r-md border border-blue-400"
            >
              Enviar
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            {features.map((feature, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <span className="font-body-m text-[16px] text-white tracking-[-0.001599999964237213px] leading-[26px]">
                    ·
                  </span>
                )}
                <span className="font-body-m text-[16px] text-white tracking-[-0.001599999964237213px] leading-[26px]">
                  {feature}
                </span>
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};