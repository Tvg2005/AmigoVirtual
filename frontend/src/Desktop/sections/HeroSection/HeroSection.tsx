import React, { useState, useEffect } from "react";
import { Check, Sparkles, Heart, Shield } from "lucide-react";

export const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 font-sans bg-gradient-radial from-[rgba(130,169,212,0.6)] via-[rgba(255,255,255,0.8)] to-white overflow-hidden">
      {/* Background concentric circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          <div className="w-[1032px] h-[1032px] rounded-full bg-[#0084ba33] border border-solid border-black opacity-10" />
          <div className="w-[871px] h-[908px] absolute top-[62px] left-[81px] rounded-[435.5px/454px] bg-[#0084ba33] border border-solid border-black opacity-10" />
          <div className="w-[742px] h-[756px] absolute top-[138px] left-[145px] rounded-[371px/378px] bg-[#0084ba33] border border-solid border-black opacity-10" />
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#69B0CD]/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-lg rounded-full border border-white/20 shadow-xl mb-8 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-center w-10 h-5 bg-gradient-to-r from-[#69b0cd] to-[#357088] rounded-full">
            <span className=" font-bold text-white text-xs">NEW</span>
          </div>
          <span className="text-[#357088] font-medium">
            Conheça o seu novo companheiro virtual
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium mb-6 md:mb-8 leading-tight font-inter">
          <span className="bg-gradient-to-r from-[#69b0cd] to-[#357088] bg-clip-text text-transparent">
            Ganhe companhia
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#357088] to-[#69b0cd] bg-clip-text text-transparent">
            e segurança
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#69b0cd] to-[#357088] bg-clip-text text-transparent">
            com um toque
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-[#13485d] font-normal mb-10 max-w-3xl mx-auto leading-relaxed font-inter">
          Pensado para idosos. Conectado com a família.
          <span className="text-[#69b0cd] font-semibold font-inter"> Apoiado pela inteligência artificial.</span>
        </p>

        {/* CTA Button */}
        <button 
          onClick={scrollToPricing}
          className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[#69b0cd] to-[#357088] hover:from-[#5a9bb8] hover:to-[#2c5c77] text-white font-semibold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 mb-12 cursor-pointer"
        >
          Experimente grátis
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Phone Mockup */}
        <div className="relative max-w-md mx-auto">
          <div
            className="relative mx-auto w-64 sm:w-72 h-[500px] sm:h-[600px] bg-gradient-to-br from-[#13485d] to-[#357088] rounded-[3rem] p-3 shadow-2xl transform transition-all duration-700"
            style={{
              transform: `perspective(1000px) rotateY(${scrollY * 0.02}deg) rotateX(${scrollY * 0.01}deg)`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-[#69b0cd] to-[#357088] rounded-[2.5rem] relative overflow-hidden">
              {/* Screen glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#69b0cd]/30 to-[#357088]/30" />

              {/* Interface */}
              <div className="relative z-10 p-6 h-full flex flex-col">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">Olá, Maria!</h3>
                  <p className="text-white/80 text-sm">Como está se sentindo hoje?</p>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { icon: <Shield />, label: "Emergência" },
                    { icon: <Heart />, label: "Saúde" },
                    { icon: <Sparkles />, label: "Conversar" },
                    { icon: <Check />, label: "Lembretes" },
                  ].map(({ icon, label }, i) => (
                    <div
                      key={i}
                      className="bg-white/20 backdrop-blur rounded-xl p-4 flex flex-col items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      {React.cloneElement(icon, { className: "w-7 h-7 mb-2" })}
                      <span className="text-xs text-center">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;