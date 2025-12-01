import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, Paperclip, Mic, Pause, Volume2, VolumeX, Bot } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatAreaProps {
  activeSection?: string;
  isDark?: boolean;
}

export const ChatArea = ({ activeSection = 'chat', isDark = false }: ChatAreaProps): JSX.Element => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Olá! 😊 Que bom ter você aqui. Estou aqui pra te fazer companhia e conversar sobre o que você quiser, sem pressa, estou aqui para você.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentInputBeforeSpeech = useRef<string>("");
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  //!IMPORTANTE! FUNÇÃO QUE AJUSTA AUTOMATICAMENTE A ALTURA DO CAMPO DE INPUT CONFORME O TEXTO É INSERIDO!!
  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  //!IMPORTANTE! COMPONENTE REACT QUE ADICIONA O TEXTO TRANSCRITO NO INPUT!!
  useEffect(() => {
    autoResizeTextarea();
  }, [inputText]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Carregar vozes disponíveis
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Tentar encontrar uma voz em português
      const ptVoice = voices.find(voice => voice.lang.includes('pt'));
      if (ptVoice) {
        setSelectedVoice(ptVoice);
      } else if (voices.length > 0) {
        setSelectedVoice(voices[0]); // Usar a primeira voz disponível se não encontrar português
      }
    };

    // Tentar carregar vozes imediatamente
    loadVoices();
    
    // Configurar evento para quando as vozes forem carregadas (necessário em alguns navegadores)
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      window.speechSynthesis.cancel(); // Parar qualquer fala ao desmontar
    };
  }, []);

  //!IMPORTANTE! COMPONENTE REACT QUE UTILIZA A API DE RECONHECIMENTO DE FALA!!
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionConstructor();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true; // Obs: habilita resultados intermediários quando for true
      recognitionInstance.lang = 'pt-BR';
      
      // Rastrear o último índice processado
      let lastProcessedIndex = 0;
      
      recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        // processamento dos últimos dados a partir dos resultados
        for (let i = lastProcessedIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          
          //evita reprocessar os resultados 
          if (result.isFinal) {
            finalTranscript += transcript;
            lastProcessedIndex = i + 1;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Atualiza o input apenas com o novo texto reconhecido
        setInputText(currentInputBeforeSpeech.current + finalTranscript + interimTranscript);
        
        // Adiciona apenas o texto final confirmado à base
        if (finalTranscript) {
          currentInputBeforeSpeech.current += finalTranscript;
        }
        
        //definir para que o cursor acompanhe o texto
        if (textareaRef.current) {
          textareaRef.current.focus();
          // cursor move depois do settimout()
          setTimeout(() => {
            if (textareaRef.current) {
              const length = textareaRef.current.value.length;
              textareaRef.current.setSelectionRange(length, length);
            }
          }, 0);
        }
      };
      
      // Resetar o índice quando a sessão de reconhecimento terminar
      recognitionInstance.onend = () => {
        setIsListening(false);
        lastProcessedIndex = 0;
        
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        setIsListening(false);
        lastProcessedIndex = 0;
        
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);
  
  const toggleListening = () => {
    if (!recognition) {
      alert('Reconhecimento de voz não suportado neste navegador.');
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      // Obs: ele vai atualizar a referência ao texto atual antes de iniciar
      currentInputBeforeSpeech.current = inputText;
      setIsListening(true);
      recognition.start();
    
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  // !!! Ler o texto em voz alta
  const speakText = (text: string) => {
    stopSpeaking();
    
    const utterance = new SpeechSynthesisUtterance(text);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    currentUtterance.current = utterance;
    window.speechSynthesis.speak(utterance);
  };
  
  // Função para parar a fala
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  //!IMPORTANTE! TRATAMENTO DE ENVIO E RESPOSTA COM A IA!!
  const handleSendMessage = async () => {
    if (isListening) toggleListening();
    if (!inputText.trim() || loading) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMessage]);
    setInputText('');
    currentInputBeforeSpeech.current = ""; // Resetar o texto base
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) throw new Error("Erro no servidor");
      const data = await response.json();
      const botReply = data.reply || "Não foi possível obter uma resposta.";
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: botReply,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Descomente a linha abaixo se quiser que o bot leia automaticamente as respostas
      // speakText(botReply);
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Erro ao conectar com o servidor.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      //loop voltar a focar depois de enviar a mensagem
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  //!IMPORTANTE! PERMITE O ENVIO DA MENSAGEM PELA TECLA ENTER!!
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSectionContent = () => {
    switch (activeSection) {
      case 'games':
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <h2 className="text-3xl font-bold text-slate-700 mb-8">Jogos</h2>
            <div className="grid grid-cols-2 gap-6 max-w-md">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">❌</span>
                </div>
                <h3 className="font-semibold text-slate-700">Jogo da Velha</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-700">Caça Palavras</h3>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            {/* Messages Area */}
            <div className={`flex-1 p-6 pb-48 space-y-6 overflow-y-auto ${isDark ? 'bg-gray-900' : 'bg-slate-50'}`}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start space-x-3 max-w-2xl">
                    {message.sender === 'bot' && (
                      <div className="w-11 h-11 bg-[#548AC5] rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div
                      className={`px-6 py-4 rounded-2xl ${
                        message.sender === 'user'
                          ? isDark 
                            ? 'bg-[#548AC5] text-white' 
                            : 'bg-[#548AC5] text-white'
                          : isDark
                            ? 'bg-gray-800 text-gray-100 border border-gray-700'
                            : 'bg-white text-slate-700 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="leading-relaxed flex-1">{message.text}</p>
                        {message.sender === 'bot' && (
                          <button 
                            className={`ml-3 p-1 rounded-full flex-shrink-0 transition-colors ${
                              isDark 
                                ? 'hover:bg-gray-700' 
                                : 'hover:bg-gray-200'
                            }`}
                            onClick={() => isSpeaking ? stopSpeaking() : speakText(message.text)}
                            aria-label={isSpeaking ? "Parar leitura" : "Ler mensagem"}
                          >
                            {isSpeaking ? (
                              <VolumeX size={18} className="text-blue-500" />
                            ) : (
                              <Volume2 size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-2xl">
                    <div className="w-11 h-11 bg-[#548AC5] rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className={`px-6 py-4 rounded-2xl ${
                      isDark
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-white shadow-sm'
                    }`}>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-400"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className={`fixed bottom-0 left-0 right-0 p-6 border-t transition-colors duration-200 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="max-w-6xl mx-auto">
                <div className={`rounded-2xl border transition-colors duration-200 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="p-4">
                    <div className="flex items-end space-x-4">
                      <div className="flex-1">
                        <textarea
                          ref={textareaRef}
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Digite algo..."
                          className={`w-full resize-none border-0 focus:ring-0 focus:outline-none bg-transparent overflow-hidden ${
                            isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                          }`}
                          rows={1}
                          style={{ minHeight: '24px', maxHeight: '120px' }}
                          autoFocus
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className={`p-2 rounded-lg transition-colors ${
                          isDark 
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-600' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}>
                          <Paperclip className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={toggleListening}
                          className={`p-2 rounded-lg transition-colors ${
                            isListening
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : isDark 
                                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-600' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                          aria-label={isListening ? "Parar reconhecimento de voz" : "Iniciar reconhecimento de voz"}
                        >
                          {isListening ? <Pause className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={handleSendMessage}
                          disabled={!inputText.trim() || loading}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            inputText.trim() && !loading
                              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
                              : isDark
                                ? 'bg-gray-600 text-gray-500'
                                : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`px-4 pt-3 flex items-center justify-between text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <div className="flex items-center space-x-4">

                  </div>
                  <span>{inputText.length} / 3,000</span>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-screen transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-slate-50'}`}>
      {getSectionContent()}
    </div>
  );
};

// Exemplo de uso do componente
export default function App() {
  return (
    <div className="h-screen flex bg-slate-50 dark:bg-gray-900">
      <ChatArea />
    </div>
  );
}