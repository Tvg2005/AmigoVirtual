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
        # Substitua pela sua chave de API do OpenRouter
        API_KEY = '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'
        API_URL = 'https://openrouter.ai/api/v1/chat/completions'

        # Defina os cabeçalhos para a requisição da API
        headers = {
            'Authorization': f'Bearer {API_KEY}',
            'Content-Type': 'application/json'
        }

        # Defina o payload da requisição (dados)
        data = {
            "model": "google/gemma-3-27b-it:free",
            "messages": [{"role": "user", "content": msg.text}]
        }

        # Envie a requisição POST para a API DeepSeek
        response = requests.post(API_URL, json=data, headers=headers)

        # Verifique se a requisição foi bem-sucedida
        if response.status_code == 200:
            reply = response.json().get("choices", [{}])[0].get("message", {}).get("content", "Erro ao processar a resposta.")
            return {"reply": reply}
        else:
            raise HTTPException(status_code=response.status_code, detail="Falha ao buscar dados da API.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")