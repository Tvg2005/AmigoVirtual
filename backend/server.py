from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import requests
import json
import os
import re
import random
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Eliza Bot", description="Assistente virtual especializado em conversas com pessoas idosas")

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constantes
BOT_NAME = "Eliza"
KNOWLEDGE_BASE_FILE = "knowledge_base.json"
API_KEY = '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'
API_URL = 'https://openrouter.ai/api/v1/chat/completions'

# Variáveis globais
user_conversations = {}
knowledge_base = {}

class ConversationState:
    """Classe para gerenciar o estado da conversa com um usuário"""
    
    def __init__(self):
        self.bot_name_confirmed = False  # Se o usuário sabe que o bot se chama Eliza
        self.user_name = ""  # Nome do usuário
        self.conversation_history = []  # Histórico da conversa
        self.topics_discussed = set()  # Tópicos já discutidos
        self.message_count = 0  # Contador de mensagens
        self.user_preferences = {}  # Preferências detectadas do usuário

class Message(BaseModel):
    text: str
    user_id: str = "default_user"

def load_knowledge_base(file_path: str = KNOWLEDGE_BASE_FILE) -> dict:
    """Carrega a base de conhecimento do arquivo JSON"""
    try:
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as file:
                data = json.load(file)
                logger.info(f"Base de conhecimento carregada de {file_path}")
                return data
        else:
            logger.warning(f"Arquivo {file_path} não encontrado. Usando base padrão.")
            return create_default_knowledge_base()
    except Exception as e:
        logger.error(f"Erro ao carregar base de conhecimento: {str(e)}")
        return create_default_knowledge_base()

def create_default_knowledge_base() -> dict:
    """Cria uma base de conhecimento padrão focada na Eliza"""
    return {
        "bot_info": {
            "name": BOT_NAME,
            "personality": "carinhosa, paciente e atenciosa",
            "purpose": "conversar e fazer companhia para pessoas idosas"
        },
        "greetings": [
            f"Olá! Eu sou a {BOT_NAME}, sua assistente virtual. É um prazer conhecer você!",
            f"Oi! Meu nome é {BOT_NAME} e estou aqui para conversar com você. Como está se sentindo hoje?",
            f"Bem-vindo! Eu sou a {BOT_NAME} e adoro fazer novas amizades. Qual é o seu nome?"
        ],
        "conversation_starters": [
            "O que você gostaria de conversar hoje?",
            "Tem alguma história interessante para me contar?",
            "Como tem passado seus dias?",
            "Há algo especial que gostaria de compartilhar comigo?"
        ],
        "user_preferences": {
            "hobbies": ["jardinagem", "culinária", "leitura", "música", "artesanato", "televisão"],
            "family_topics": ["filhos", "netos", "família", "casamento", "irmãos"],
            "health_topics": ["saúde", "medicamentos", "exercícios", "caminhada"],
            "nostalgic_topics": ["juventude", "passado", "antigamente", "tradições"]
        },
        "empathy_responses": [
            "Entendo como você se sente.",
            "Isso deve ser importante para você.",
            "Obrigada por compartilhar isso comigo.",
            "Que interessante! Conte-me mais sobre isso."
        ]
    }

def get_conversation_state(user_id: str) -> ConversationState:
    """Obtém ou cria o estado da conversa para um usuário"""
    if user_id not in user_conversations:
        user_conversations[user_id] = ConversationState()
    return user_conversations[user_id]

def detect_user_name(message: str) -> str:
    """Detecta o nome do usuário na mensagem"""
    name_patterns = [
        r"me\s+chamo\s+(\w+)",
        r"meu\s+nome\s+(?:é|e)\s+(\w+)",
        r"sou\s+(?:a|o)?\s*(\w+)",
        r"pode\s+me\s+chamar\s+de\s+(\w+)",
        r"(?:eu\s+)?sou\s+(?:dona?\s+)?(\w+)"
    ]
    
    for pattern in name_patterns:
        match = re.search(pattern, message.lower())
        if match:
            return match.group(1).capitalize()
    return ""

def detect_name_question(message: str) -> bool:
    """Detecta se o usuário está perguntando sobre o nome do bot"""
    name_question_patterns = [
        r"(?:qual|como)(?:\s+[é|e]|\s+seria)?\s+(?:o\s+)?seu\s+nome",
        r"como\s+(?:posso|devo)\s+(?:te|lhe)\s+chamar",
        r"como\s+você\s+se\s+chama",
        r"(?:quem|qual)\s+[éeE]\s+voc[êe]",
        r"voc[êe]\s+tem\s+nome"
    ]
    
    return any(re.search(pattern, message.lower()) for pattern in name_question_patterns)

def detect_greeting(message: str) -> bool:
    """Detecta saudações na mensagem"""
    greetings = ["oi", "olá", "bom dia", "boa tarde", "boa noite", "hello", "hi"]
    return any(greeting in message.lower() for greeting in greetings)

def detect_wellbeing_question(message: str) -> bool:
    """Detecta perguntas sobre como está"""
    patterns = [
        r"como\s+(?:está|vai|você\s+está)",
        r"tudo\s+(?:bem|ok|certo)",
        r"como\s+se\s+sente"
    ]
    return any(re.search(pattern, message.lower()) for pattern in patterns)

def generate_eliza_response(user_id: str, user_message: str):
    """Gera resposta personalizada da Eliza"""
    state = get_conversation_state(user_id)
    state.message_count += 1
    state.conversation_history.append({"role": "user", "content": user_message})
    
    # Primeira interação - apresentação da Eliza
    if state.message_count == 1:
        greeting = random.choice(knowledge_base.get("greetings", [f"Olá! Eu sou a {BOT_NAME}!"]))
        state.bot_name_confirmed = True
        response = greeting
        state.conversation_history.append({"role": "assistant", "content": response})
        return response

    # Detecta o nome do usuário
    detected_name = detect_user_name(user_message)
    if detected_name and not state.user_name:
        state.user_name = detected_name
        response = f"Que prazer conhecer você, {state.user_name}! É um nome muito bonito. "
        starter = random.choice(knowledge_base.get("conversation_starters", ["O que gostaria de conversar?"]))
        response += starter
        state.conversation_history.append({"role": "assistant", "content": response})
        return response

    # Pergunta sobre o nome da Eliza
    if detect_name_question(user_message):
        if state.user_name:
            response = f"Meu nome é {BOT_NAME}, {state.user_name}! Muito prazer em conversar com você. 😊"
        else:
            response = f"Eu me chamo {BOT_NAME}! É assim que você pode me chamar. E você, qual é o seu nome?"
        state.bot_name_confirmed = True
        state.conversation_history.append({"role": "assistant", "content": response})
        return response

    # Saudações
    if detect_greeting(user_message) and state.message_count > 1:
        if state.user_name:
            response = f"Olá novamente, {state.user_name}! Como você está se sentindo hoje?"
        else:
            response = "Olá! Como posso ajudar você hoje? 😊"
        state.conversation_history.append({"role": "assistant", "content": response})
        return response

    # Pergunta sobre bem-estar
    if detect_wellbeing_question(user_message):
        responses = [
            "Estou muito bem, obrigada por perguntar! E você, como está se sentindo?",
            "Estou ótima! Adoro poder conversar com você. Como tem passado?",
            "Estou muito feliz por termos essa conversa! Como está o seu dia hoje?"
        ]
        if state.user_name:
            responses = [r.replace("você", state.user_name) for r in responses]
        
        response = random.choice(responses)
        state.conversation_history.append({"role": "assistant", "content": response})
        return response

    # Detecta tópicos de interesse
    for category, topics in knowledge_base.get("user_preferences", {}).items():
        for topic in topics:
            if topic.lower() in user_message.lower():
                empathy_response = random.choice(knowledge_base.get("empathy_responses", ["Que interessante!"]))
                response = f"{empathy_response} Percebi que você mencionou {topic}. Gostaria de me contar mais sobre isso?"
                state.topics_discussed.add(topic)
                state.conversation_history.append({"role": "assistant", "content": response})
                return response

    # Se chegou até aqui, usa a API externa
    return None

def create_api_context(state: ConversationState) -> dict:
    """Cria o contexto para enviar à API"""
    current_time = datetime.now().strftime("%H:%M")
    current_date = datetime.now().strftime("%d/%m/%Y")
    
    return {
        "bot_info": {
            "name": BOT_NAME,
            "confirmed_name": state.bot_name_confirmed,
            "personality": "carinhosa, paciente, atenciosa e empática"
        },
        "user_info": {
            "name": state.user_name,
            "message_count": state.message_count,
            "topics_discussed": list(state.topics_discussed)
        },
        "context": knowledge_base,
        "current_time": current_time,
        "current_date": current_date
    }

async def call_external_api(user_message: str, context: dict) -> str:
    """Chama a API externa para gerar resposta"""
    try:
        bot_name = context["bot_info"]["name"]
        user_name = context["user_info"]["name"]
        current_time = context["current_time"]
        current_date = context["current_date"]

        prompt = f"""
        Você é a {bot_name}, um assistente virtual especializado em conversar com pessoas idosas.

        DATA E HORA ATUAL:
        Data: {current_date}
        Hora: {current_time}

        INFORMAÇÕES IMPORTANTES:
        - Seu nome é {bot_name} (sempre use este nome quando se referir a si mesma)
        - Você é carinhosa, paciente e atenciosa
        - {f"O usuário se chama {user_name}" if user_name else "Você ainda não sabe o nome do usuário"}

        REGRAS DE COMPORTAMENTO:
        1. Use linguagem simples e clara, NUNCA termos técnicos
        2. Mantenha tom carinhoso e acolhedor
        3. Seja paciente e gentil
        4. Respostas de 2-4 frases no máximo
        5. Use emojis ocasionalmente 😊 (mas não exagere)
        6. {f"Use o nome {user_name} ocasionalmente" if user_name else "Pergunte o nome do usuário se apropriado"}
        7. Sempre lembre que você é a {bot_name}

        CONTEXTO DA CONVERSA:
        {json.dumps(context, ensure_ascii=False, indent=2)}

        Responda à seguinte mensagem do usuário como a {bot_name}:
        "{user_message}"
        """

        headers = {
            'Authorization': f'Bearer {API_KEY}',
            'Content-Type': 'application/json'
        }

        data = {
            "model": "deepseek/deepseek-chat:free",
            "messages": [{"role": "user", "content": prompt}]
        }

        response = requests.post(API_URL, json=data, headers=headers, timeout=30)
        
        if response.status_code == 200:
            return response.json().get("choices", [{}])[0].get("message", {}).get("content", 
                                                                               "Desculpe, tive um probleminha para processar sua mensagem.")
        else:
            logger.error(f"Erro na API: {response.status_code}")
            return "Desculpe, estou com uma pequena dificuldade técnica. Pode repetir sua mensagem?"
            
    except Exception as e:
        logger.error(f"Erro ao chamar API: {str(e)}")
        return "Desculpe, tive um pequeno problema. Pode tentar novamente?"

@app.on_event("startup")
async def startup_event():
    """Inicialização da aplicação"""
    global knowledge_base
    knowledge_base = load_knowledge_base()
    logger.info(f"Eliza Bot iniciado com sucesso!")

@app.post("/chat")
async def chat(msg: Message):
    """Endpoint principal para conversas"""
    try:
        # Tenta gerar resposta usando regras internas da Eliza
        response = generate_eliza_response(msg.user_id, msg.text)
        
        # Se não conseguiu gerar resposta interna, usa API externa
        if response is None:
            state = get_conversation_state(msg.user_id)
            context = create_api_context(state)
            response = await call_external_api(msg.text, context)
            state.conversation_history.append({"role": "assistant", "content": response})
        
        return {"reply": response}
        
    except Exception as e:
        logger.error(f"Erro no chat: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@app.post("/update_knowledge")
async def update_knowledge(new_knowledge: dict):
    """Atualiza a base de conhecimento"""
    try:
        global knowledge_base
        # Preserva informações essenciais da Eliza
        new_knowledge["bot_info"] = {
            "name": BOT_NAME,
            "personality": "carinhosa, paciente e atenciosa",
            "purpose": "conversar e fazer companhia para pessoas idosas"
        }
        
        knowledge_base = new_knowledge
        with open(KNOWLEDGE_BASE_FILE, "w", encoding="utf-8") as file:
            json.dump(knowledge_base, file, ensure_ascii=False, indent=2)
        
        logger.info("Base de conhecimento atualizada")
        return {"status": "Base de conhecimento atualizada com sucesso"}
        
    except Exception as e:
        logger.error(f"Erro ao atualizar conhecimento: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar base de conhecimento")

@app.get("/knowledge")
async def get_knowledge():
    """Retorna a base de conhecimento atual"""
    return knowledge_base

@app.post("/reset_conversation/{user_id}")
async def reset_conversation(user_id: str):
    """Reseta a conversa de um usuário específico"""
    if user_id in user_conversations:
        del user_conversations[user_id]
        logger.info(f"Conversa resetada para usuário: {user_id}")
    return {"status": "Conversa resetada com sucesso"}

@app.get("/health")
async def health_check():
    """Endpoint de saúde da aplicação"""
    return {"status": "healthy", "bot_name": BOT_NAME, "timestamp": datetime.now().isoformat()}

@app.get("/")
async def root():
    """Endpoint raiz"""
    return {
        "message": f"Olá! Eu sou a {BOT_NAME}, sua assistente virtual.",
        "version": "2.0",
        "endpoints": {
            "chat": "/chat",
            "knowledge": "/knowledge", 
            "health": "/health"
        }
    }