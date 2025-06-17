import React, { useState, useEffect, useRef } from "react";
import { X, Volume2, Bot, Mic, Pause, VolumeX } from "lucide-react";
import { 
  SpeechRecognition, 
  SpeechRecognitionEvent, 
  SpeechRecognitionErrorEvent 
} from "../../../backend/api/SpeechRecognition";

interface ChatbotProps {
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentInputBeforeSpeech = useRef<string>("");
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  // Carrega uma mensagem inicial
  useEffect(() => {
    setMessages([{ role: "bot", text: "Olá! 😊 Que bom ter você aqui. Estou aqui pra te fazer companhia e conversar sobre o que você quiser, sem pressa, estou aqui para você."}]);
  }, []);

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
  }, [input]);

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
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionConstructor();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true; // Obs: habilita resultados intermediários quando for true
      recognitionInstance.lang = 'pt-BR';
      
      // Rastrear o último índice processado
      let lastProcessedIndex = 0;
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
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
        setInput(currentInputBeforeSpeech.current + finalTranscript + interimTranscript);
        
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
      
      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
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
      currentInputBeforeSpeech.current = input;
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
  const sendMessage = async () => {
    if (isListening) toggleListening();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    currentInputBeforeSpeech.current = ""; // Resetar o texto base
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) throw new Error("Erro no servidor");
      const data = await response.json();
      const botReply = data.reply || "Não foi possível obter uma resposta.";
      
      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
      
      // Descomente a linha abaixo se quiser que o bot leia automaticamente as respostas
      // speakText(botReply);
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      setMessages((prev) => [...prev, { role: "bot", text: "Erro ao conectar com o servidor." }]);
    } finally {
      setLoading(false);
      //loop voltar a focar depois de enviar a mensagem
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  //!IMPORTANTE! PERMITE O ENVIO DA MENSAGEM PELA TECLA ENTER!!
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  //Frontend
  return (
    <div className="fixed bottom-20 right-6 w-96 bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot size={24} />
          <h3 className="font-semibold">Assistente virtual</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded" aria-label="Fechar chat">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="h-96 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`p-3 rounded-lg mb-4 max-w-[80%] ${msg.role === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200"}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">{msg.text}</div>
              {msg.role === "bot" && (
                <button 
                  className="ml-2 text-gray-600 p-1 hover:bg-gray-300 rounded-full flex-shrink-0" 
                  onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.text)}
                  aria-label={isSpeaking ? "Parar leitura" : "Ler mensagem"}>
                    
                  {isSpeaking ? <VolumeX size={20} color="blue" /> : <Volume2 size={20} color="black" />}
                
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="p-3 rounded-lg mb-4 max-w-[80%] bg-gray-200">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-400"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 flex">
        <textarea
          ref={textareaRef}
          className="flex-1 p-2 border border-gray-300 rounded-lg resize-none overflow-hidden min-h-[40px] max-h-32 placeholder:text-sm"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={1}
          style={{ height: 'auto' }}
          autoFocus
        />
        <button 
          onClick={toggleListening} 
          className={`ml-2 p-2.5 ${isListening ? 'bg-red-500' : 'bg-blue-600'} text-white rounded-lg self-end`}
          aria-label={isListening ? "Parar reconhecimento de voz" : "Iniciar reconhecimento de voz"}
        >
          {isListening ? <Pause size={20} /> : <Mic size={20} />}
        </button>
        <button 
          onClick={sendMessage} 
          className="ml-2 p-2 bg-blue-600 text-white rounded-lg self-end" 
          disabled={loading}
        >
          {loading ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;