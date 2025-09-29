//Evento de reconhecimento de fala contendo os resultados da transcrição
export interface SpeechRecognitionEvent extends Event {
  
  results: SpeechRecognitionResultList;
}

//Geração de lista de resultados do reconhecimento de fala
export interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

//Representação de um único resultado
export interface SpeechRecognitionResult {
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
  isFinal?: boolean;
}

//Tratamento da transcrição de fala para texto
//Um número entre 0 e 1 que indica a confiança do reconhecimento 
// (quanto maior, mais confiável)
export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

//Evento de erro
export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

// Interface que é feito o controle do reconhecimento de fala
export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  //abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

//Construtor webKitSpeechRecognition e SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}