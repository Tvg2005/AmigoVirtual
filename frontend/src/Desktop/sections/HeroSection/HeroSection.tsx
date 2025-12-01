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
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 font-sans bg-gradient-radial from-[rgba(130,169,212,0.6)] via-[rgba(255,255,255,0.8)] to-white overflow-hidden">
      {/* Background concentric circles - Responsivo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          {/* Círculos ajustados para diferentes telas */}
          <div className="w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] lg:w-[900px] lg:h-[900px] xl:w-[1032px] xl:h-[1032px] rounded-full bg-[#0084ba33] border border-solid border-black opacity-10" />
          <div className="w-[250px] h-[260px] absolute top-[25px] left-[25px] sm:w-[500px] sm:h-[520px] sm:top-[40px] sm:left-[50px] lg:w-[750px] lg:h-[780px] lg:top-[60px] lg:left-[75px] xl:w-[871px] xl:h-[908px] xl:top-[62px] xl:left-[81px] rounded-[50%] bg-[#0084ba33] border border-solid border-black opacity-10" />
          <div className="w-[200px] h-[210px] absolute top-[45px] left-[50px] sm:w-[400px] sm:h-[420px] sm:top-[90px] sm:left-[100px] lg:w-[600px] lg:h-[630px] lg:top-[135px] lg:left-[150px] xl:w-[742px] xl:h-[756px] xl:top-[138px] xl:left-[145px] rounded-[50%] bg-[#0084ba33] border border-solid border-black opacity-10" />
        </div>
      </div>

      {/* Floating particles - Ajustado para mobile */}
      <div className="absolute inset-0">
        {[...Array(window.innerWidth < 768 ? 10 : 20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#69B0CD]/30 rounded-full animate-pulse"
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
      <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge - Responsivo */}
        <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-lg rounded-full border border-white/20 shadow-xl mb-6 sm:mb-8 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-center w-8 h-4 sm:w-10 sm:h-5 bg-gradient-to-r from-[#69b0cd] to-[#357088] rounded-full">
            <span className="font-bold text-white text-xs">NEW</span>
          </div>
          <span className="text-[#357088] font-medium text-sm sm:text-base">
            <span className="hidden sm:inline">Conheça o seu novo companheiro virtual</span>
            <span className="sm:hidden">Seu novo companheiro virtual</span>
          </span>
        </div>

        {/* Heading - Melhorado para mobile */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium mb-4 sm:mb-6 md:mb-8 leading-tight font-inter">
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

        {/* Subtitle - Responsivo */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#13485d] font-normal mb-8 sm:mb-10 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-inter px-2 sm:px-0">
          Pensado para idosos. Conectado com a família.
          <span className="text-[#69b0cd] font-semibold font-inter block sm:inline"> Apoiado pela inteligência artificial.</span>
        </p>

        {/* CTA Button - Responsivo */}
        <button 
          onClick={scrollToPricing}
          className="group relative inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#69b0cd] to-[#357088] hover:from-[#5a9bb8] hover:to-[#2c5c77] text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 mb-8 sm:mb-12 cursor-pointer text-sm sm:text-base"
        >
          Experimente grátis
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Phone Mockup - Totalmente responsivo */}
        <div className="relative max-w-xs sm:max-w-sm md:max-w-md mx-auto">
          <div
            className="relative mx-auto w-56 sm:w-64 md:w-72 lg:w-80 h-[420px] sm:h-[500px] md:h-[600px] lg:h-[640px] bg-gradient-to-br from-[#13485d] to-[#357088] rounded-[2.5rem] sm:rounded-[3rem] p-2 sm:p-3 shadow-2xl transform transition-all duration-700"
            style={{
              transform: window.innerWidth >= 768 
                ? `perspective(1000px) rotateY(${scrollY * 0.02}deg) rotateX(${scrollY * 0.01}deg)`
                : 'none',
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-[#69b0cd] to-[#357088] rounded-[2rem] sm:rounded-[2.5rem] relative overflow-hidden">
              {/* Screen glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#69b0cd]/30 to-[#357088]/30" />

              {/* Interface - Responsivo */}
              <div className="relative z-10 p-4 sm:p-5 lg:p-6 h-full flex flex-col">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-base sm:text-lg">Olá, Maria!</h3>
                  <p className="text-white/80 text-xs sm:text-sm">Como está se sentindo hoje?</p>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                  {[
                    { icon: <Shield />, label: "Emergência" },
                    { icon: <Heart />, label: "Saúde" },
                    { icon: <Sparkles />, label: "Conversar" },
                    { icon: <Check />, label: "Lembretes" },
                  ].map(({ icon, label }, i) => (
                    <div
                      key={i}
                      className="bg-white/20 backdrop-blur rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      {React.cloneElement(icon, { className: "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mb-1 sm:mb-2" })}
                      <span className="text-xs text-center leading-tight">{label}</span>
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