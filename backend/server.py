from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Configuração do CORS (comunicação com o front)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    text: str

@app.post("/chat")
async def chat(msg: Message):
    try:
        # Chave de API do OpenRouter
        API_KEY = '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'
        API_URL = 'https://openrouter.ai/api/v1/chat/completions'

        # Cabeçalhos para a requisição da API
        headers = {
            'Authorization': f'Bearer {API_KEY}',
            'Content-Type': 'application/json'
        }

        # Requisição
        data = {
            "model": "deepseek/deepseek-chat:free",
            "messages": [{"role": "user", "content": msg.text}]
        }

        # Requisição POST para a API DeepSeek
        response = requests.post(API_URL, json=data, headers=headers)

        # Verifique se a requisição foi bem-sucedida
        if response.status_code == 200:
            reply = response.json().get("choices", [{}])[0].get("message", {}).get("content", "Erro ao processar a resposta.")
            return {"reply": reply}
        else:
            raise HTTPException(status_code=response.status_code, detail="Falha ao buscar dados da API.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")