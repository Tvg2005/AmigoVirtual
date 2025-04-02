from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import ollama
from fastapi.middleware.cors import CORSMiddleware

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
        #!IMPORTANTE! instalar modelo: ollama pull gemma3:1b
        response = ollama.chat(model="gemma3:1b", messages=[{"role": "user", "content": msg.text}])
        #captura da mensagem
        reply = response.get("message", {}).get("content", "Erro ao processar a resposta.")
        return {"reply": reply}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")
