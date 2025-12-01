import React, { useState, useEffect } from "react";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PillIcon,
} from "lucide-react";

import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import { Input } from "../components/input";
import { supabase } from '../../../lib/supabase.ts';
import { fetchNews } from "../../News/services/newsApi.ts";
import { useNavigate } from "react-router-dom";

interface Medication {
  id: string;
  name: string;
  frequency: string;
  time: string;
  days: string[];
  user_id: string;
  created_at: string;
}

interface MedicationLog {
  id: string;
  medication_id: string;
  taken_at: string;
  created_at: string;
}

interface NewsItem {
  title: string;
  url: string;
  source?: {
    name: string;
  };
}

const FULL_DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export const DashboardMainSection = (): JSX.Element => {
  const navigate = useNavigate();
  const [chatMessage, setChatMessage] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentGameSlide, setCurrentGameSlide] = useState(0);
  const [todayMedications, setTodayMedications] = useState<Medication[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  // Jogos disponíveis
  const games = [
    { id: 1, name: "Quebra-cabeças", icon: "🧩", color: "bg-blue-100" },
    { id: 2, name: "Palavras Cruzadas", icon: "📝", color: "bg-yellow-100" },
    { id: 3, name: "Memória", icon: "🧠", color: "bg-purple-100" },
    { id: 4, name: "Sudoku", icon: "🔢", color: "bg-green-100" },
    { id: 5, name: "Jogo da Velha", icon: "❌", color: "bg-red-100" },
    { id: 6, name: "Caça Palavras", icon: "🔍", color: "bg-pink-100" },
  ];

  useEffect(() => {
    fetchTodayMedications();
    fetchMedicationLogs();
    checkDarkMode();
    loadNews();
  }, []);

  // Verificar modo dark
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const checkDarkMode = () => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  };

  const loadNews = async () => {
    try {
      setLoadingNews(true);
      const newsData = await fetchNews();
      console.log('News data received:', newsData); // Debug

      // Verificar se newsData é um array ou tem uma propriedade articles
      let articles = [];
      if (Array.isArray(newsData)) {
        articles = newsData;
      } else if (newsData?.articles && Array.isArray(newsData.articles)) {
        articles = newsData.articles;
      }

      setNews(articles.slice(0, 2)); // Limitar a 2 notícias
    } catch (error) {
      console.error('Error loading news:', error);
      setNews([]);
    } finally {
      setLoadingNews(false);
    }
  };

  const fetchTodayMedications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date();
      const currentDay = FULL_DAYS[today.getDay()];

      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const todayMeds = (data || []).filter(med =>
        med.days.includes(currentDay)
      );

      setTodayMedications(todayMeds);
    } catch (error) {
      console.error('Error fetching today medications:', error);
    }
  };

  const fetchMedicationLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const { data, error } = await supabase
        .from('medication_logs')
        .select(`
          *,
          medications!inner(user_id)
        `)
        .gte('taken_at', startOfDay.toISOString())
        .lt('taken_at', endOfDay.toISOString())
        .eq('medications.user_id', user.id);

      if (error) throw error;
      setMedicationLogs(data || []);
    } catch (error) {
      console.error('Error fetching medication logs:', error);
    }
  };

  const isMedicationTaken = (medicationId: string, medicationTime: string) => {
    const today = new Date();
    const [hours, minutes] = medicationTime.split(':');
    const medicationDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes));

    return medicationLogs.some(log => {
      const logDate = new Date(log.taken_at);
      const logMedicationTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), logDate.getHours(), logDate.getMinutes());

      return log.medication_id === medicationId &&
        Math.abs(logMedicationTime.getTime() - medicationDateTime.getTime()) < 30 * 60 * 1000;
    });
  };

  const toggleMedication = async (medicationId: string, medicationTime: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const isTaken = isMedicationTaken(medicationId, medicationTime);

      if (isTaken) {
        const today = new Date();
        const [hours, minutes] = medicationTime.split(':');
        const medicationDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes));

        const logToRemove = medicationLogs.find(log => {
          const logDate = new Date(log.taken_at);
          const logMedicationTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), logDate.getHours(), logDate.getMinutes());

          return log.medication_id === medicationId &&
            Math.abs(logMedicationTime.getTime() - medicationDateTime.getTime()) < 30 * 60 * 1000;
        });

        if (logToRemove) {
          const { error } = await supabase
            .from('medication_logs')
            .delete()
            .eq('id', logToRemove.id);

          if (error) throw error;
        }
      } else {
        const today = new Date();
        const [hours, minutes] = medicationTime.split(':');
        const takenAt = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes));

        const { error } = await supabase
          .from('medication_logs')
          .insert([{
            medication_id: medicationId,
            taken_at: takenAt.toISOString()
          }]);

        if (error) throw error;
      }

      fetchMedicationLogs();
    } catch (error) {
      console.error('Error toggling medication:', error);
    }
  };

  const getMedicationsByTimeRange = (startHour: number, endHour: number) => {
    return todayMedications.filter(med => {
      const [hours] = med.time.split(':');
      const medicationHour = parseInt(hours);
      return medicationHour >= startHour && medicationHour < endHour;
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      console.log("Enviando mensagem:", chatMessage);
      setChatMessage("");
    }
  };

  const handleDateNavigation = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleGameSlide = (direction: "prev" | "next") => {
    if (direction === "next") {
      setCurrentGameSlide(prev => (prev + 1) % Math.ceil(games.length / 4));
    } else {
      setCurrentGameSlide(prev => (prev - 1 + Math.ceil(games.length / 4)) % Math.ceil(games.length / 4));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const morningMeds = getMedicationsByTimeRange(7, 12);
  const afternoonMeds = getMedicationsByTimeRange(12, 18);
  const gamesPerSlide = 4;
  const currentGames = games.slice(currentGameSlide * gamesPerSlide, (currentGameSlide + 1) * gamesPerSlide);

  return (
    <main
      className={`fixed top-20 left-80 right-0 bottom-0 p-4 overflow-auto transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-[#E8F0F8]'
        }`}
      data-high-contrast-target="true"
    >
      <div className="grid grid-cols-2 gap-4 h-full">

        {/* Chat Interface - Top Left */}
        <Card
          className={`rounded-[20px] shadow-lg border-0 relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-[#B9D0E9]'
            }`}
          style={{ padding: '50px' }}
        >
          <CardContent className="p-0 relative h-full flex flex-col">
            {/* Background Effects */}
            <div className="absolute w-32 h-32 top-4 left-4 rounded-full blur-lg opacity-30" style={{ background: 'radial-gradient(circle, rgba(173, 216, 255, 0.3) 0%, transparent 70%)' }} />
            <div className="absolute w-40 h-40 bottom-4 right-4 rounded-full blur-lg opacity-30" style={{ background: 'radial-gradient(circle, rgba(173, 216, 255, 0.3) 0%, transparent 70%)' }} />

            {/* Robot Image */}
            <div className="absolute top-14 w-56 h-56 z-30 transform -translate-y-1/2 rotate-6" style={{ right: "-60px" }}>
              <img
                className="w-full h-full object-contain"
                alt="Robot"
                src="/robot-official.png"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center pr-36 z-20">
              <h1 className={`text-3xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-blue-300' : 'text-[#2D5B7A]'
                }`}>
                Olá, Maria!
              </h1>
              <p className={`mt-5 text-sm mb-12 font-semibold max-w-xs transition-colors duration-300 ${isDarkMode ? 'text-blue-200' : 'text-[#2D5B7A]'
                }`}>
                Sobre o que gostaria de conversar hoje?
              </p>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="mt-auto z-20">
              <div className={`backdrop-blur-sm rounded-full flex items-center p-1 shadow-md max-w-max transition-colors duration-300 ${isDarkMode ? 'bg-gray-700/80' : 'bg-white/80'
                }`}>
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Digite algo..."
                  className={`flex-1 ml-4 bg-transparent border-none text-sm font-medium focus-visible:ring-0 focus-visible:outline-none transition-colors duration-300 ${isDarkMode
                      ? 'text-gray-100 placeholder:text-gray-400'
                      : 'text-gray-800 placeholder:text-gray-600'
                    }`}
                />
                <Button
                  type="submit"
                  size="icon"
                  className={`w-8 h-8 rounded-full mr-1 flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-50'
                    }`}
                >
                  <img
                    src="/Sent.png"
                    alt="Enviar"
                    className="w-4 h-4"
                  />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Calendar/Medication Schedule - Top Right */}
        <Card
          className={`rounded-[20px] p-2 shadow-lg border-0 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-[#B9D0E9]'
            }`}
        >
          <CardContent className="p-0 relative h-full">
            {/* Date Header */}
            <div className="flex items-center justify-between p-4 pb-2">
              <h2 className={`text-xl font-semibold transition-colors duration-300 ${isDarkMode ? 'text-blue-300' : 'text-[#2D5B7A]'
                }`}>
                {formatDate(currentDate)}
              </h2>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  onClick={() => handleDateNavigation("prev")}
                  className="w-8 h-8 rounded-full mr-4 flex-shrink-0 transition-colors duration-300"
                  style={{ backgroundColor: isDarkMode ? 'rgba(75, 85, 99, 0.7)' : 'rgba(45, 91, 122, 0.7)' }}
                >
                  <ChevronLeftIcon className="w-4 h-4 text-white" />
                </Button>
                <Button
                  size="icon"
                  onClick={() => handleDateNavigation("next")}
                  className="w-8 h-8 rounded-full mr-4 flex-shrink-0 transition-colors duration-300"
                  style={{ backgroundColor: isDarkMode ? 'rgba(75, 85, 99, 0.7)' : 'rgba(45, 91, 122, 0.7)' }}
                >
                  <ChevronRightIcon className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>

            {/* Medication Schedule */}
            <div className={`mx-4 mb-4 backdrop-blur-md rounded-2xl border-0 shadow-sm p-5 transition-colors duration-300 ${isDarkMode ? 'bg-gray-700/70' : 'bg-white/70'
              }`}>
              {/* Morning Schedule */}
              {morningMeds.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-blue-300' : 'text-[#2D5B7A]'
                      }`}>07:00-12:00</span>
                    <div className={`flex-1 h-px transition-colors duration-300 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`} />
                  </div>
                  <div className="space-y-2">
                    {morningMeds.map((med) => {
                      const isTaken = isMedicationTaken(med.id, med.time);
                      return (
                        <div key={med.id} className="flex items-center gap-3 text-sm">
                          <button
                            onClick={() => toggleMedication(med.id, med.time)}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isTaken
                                ? 'bg-green-500 border-green-500 animate-pulse'
                                : isDarkMode
                                  ? 'bg-gray-800 border-blue-500 hover:border-blue-400'
                                  : 'bg-white border-blue-400 hover:border-blue-600'
                              }`}
                          >
                            {isTaken && (
                              <CheckIcon className="w-3 h-3 text-white animate-bounce" />
                            )}
                          </button>
                          <span className={`font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                            }`}>{med.time}</span>
                          <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'
                            }`}>|</span>
                          <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                            }`}>{med.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Afternoon Schedule */}
              {afternoonMeds.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-blue-300' : 'text-[#2D5B7A]'
                      }`}>12:00-18:00</span>
                    <div className={`flex-1 h-px transition-colors duration-300 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`} />
                  </div>
                  <div className="space-y-2">
                    {afternoonMeds.map((med) => {
                      const isTaken = isMedicationTaken(med.id, med.time);
                      return (
                        <div key={med.id} className="flex items-center gap-3 text-sm">
                          <button
                            onClick={() => toggleMedication(med.id, med.time)}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isTaken
                                ? 'bg-green-500 border-green-500 animate-pulse'
                                : isDarkMode
                                  ? 'bg-gray-800 border-blue-500 hover:border-blue-400'
                                  : 'bg-white border-blue-400 hover:border-blue-600'
                              }`}
                          >
                            {isTaken && (
                              <CheckIcon className="w-3 h-3 text-white animate-bounce" />
                            )}
                          </button>
                          <span className={`font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                            }`}>{med.time}</span>
                          <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'
                            }`}>|</span>
                          <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                            }`}>{med.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No medications message */}
              {morningMeds.length === 0 && afternoonMeds.length === 0 && (
                <div className={`text-center py-8 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  <PillIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum medicamento agendado para hoje</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Games Section - Bottom Left */}
        <Card
          className={`rounded-[20px] border-0 shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-[#B9D0E9]'
            }`}
        >
          <CardContent className="p-0 relative h-full flex flex-col">
            <h2 className={`text-3xl font-semibold text-center py-6 transition-colors duration-300 ${isDarkMode ? 'text-blue-300' : 'text-[#2D5B7A]'
              }`}>
              Jogos
            </h2>

            {/* Games Slider */}
            <div className="flex-1 flex items-center justify-center px-4">
              <Button
                size="icon"
                onClick={() => handleGameSlide("prev")}
                className="w-8 h-8 rounded-full mr-4 flex-shrink-0 transition-colors duration-300"
                style={{ backgroundColor: isDarkMode ? 'rgba(75, 85, 99, 0.7)' : 'rgba(45, 91, 122, 0.7)' }}
                disabled={currentGameSlide === 0}
              >
                <ChevronLeftIcon className="w-4 h-4 text-white" />
              </Button>

              <div className="grid grid-cols-4 gap-3 flex-1 max-w-xs">
                {currentGames.map((game) => (
                  <div
                    key={game.id}
                    className={`rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-200 shadow-sm ${isDarkMode ? 'bg-gray-700/60 hover:bg-gray-600/60' : 'bg-white/60 hover:bg-white/80'
                      }`}
                  >
                    <span className="text-2xl mb-1">{game.icon}</span>
                    <span className={`text-xs text-center leading-tight transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                      {game.name}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                size="icon"
                onClick={() => handleGameSlide("next")}
                className="w-8 h-8 rounded-full ml-4 flex-shrink-0 transition-colors duration-300"
                style={{ backgroundColor: isDarkMode ? 'rgba(75, 85, 99, 0.7)' : 'rgba(45, 91, 122, 0.7)' }}
                disabled={currentGameSlide >= Math.ceil(games.length / 4) - 1}
              >
                <ChevronRightIcon className="w-4 h-4 text-white" />
              </Button>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-1 pb-4">
              {Array.from({ length: Math.ceil(games.length / 4) }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === currentGameSlide
                      ? isDarkMode ? 'bg-blue-400' : 'bg-[#548bc5]'
                      : isDarkMode ? 'bg-gray-600' : 'bg-blue-300'
                    }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* News/Additional Content - Bottom Right */}
        <Card
          className={`rounded-[20px] border-0 shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-[#B9D0E9]'
            }`}
        >
          <CardContent className="p-0 relative h-full flex flex-col overflow-hidden">
            {/* Cabeçalho */}
            <h2 className={`text-3xl font-semibold text-center py-6 transition-colors duration-300 ${isDarkMode ? 'text-blue-300' : 'text-[#2D5B7A]'
              }`}>
              Notícias
            </h2>

            {/* Conteúdo das Notícias */}
            <div className="flex-1 px-4 pb-2 overflow-hidden">
              <div className={`backdrop-blur-md rounded-2xl border-0 shadow-sm p-1 h-full flex flex-col transition-colors duration-300`}>
                <div className="space-y-3 flex-1 overflow-hidden">
                  {loadingNews ? (
                    <p className={`text-center text-sm py-4 transition-colors duration-300 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}>
                      Carregando notícias...
                    </p>
                  ) : news.length === 0 ? (
                    <p className={`text-center text-sm py-4 transition-colors duration-300 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}>
                      Nenhuma notícia encontrada.
                    </p>
                  ) : (
                    news.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => window.open(item.url, "_blank")}
                        className={`rounded-xl p-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${isDarkMode
                            ? "bg-gray-600/40 hover:bg-gray-600/60"
                            : "bg-white/60 hover:bg-white/80"
                          }`}
                      >
                        <p className={`text-sm font-semibold mb-1 line-clamp-2 transition-colors duration-300 ${isDarkMode ? "text-gray-100" : "text-gray-800"
                          }`}>
                          {item.title}
                        </p>
                        <p className={`text-xs transition-colors duration-300 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}>
                          {item.source?.name || "Fonte desconhecida"}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Botão para ver mais */}
                <Button
                  onClick={() => navigate("/noticias")}
                  className="w-full mt-3 py-2 rounded-xl text-white font-medium transition-colors duration-300 flex-shrink-0"
                  style={{ backgroundColor: 'rgba(45, 91, 122, 0.7)' }}
                >
                  Ver todas as notícias
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};