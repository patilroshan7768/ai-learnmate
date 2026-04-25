"""
AI LearnMate – FastAPI AI Service (Final Clean Version)
"""

import os
import warnings
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from google import genai
import httpx
import asyncio
import math
from pydantic import BaseModel
from fastapi import Body, HTTPException


def split_text(text, max_length=2000):
    chunks = []
    while len(text) > max_length:
        chunks.append(text[:max_length])
        text = text[max_length:]
    chunks.append(text)
    return chunks

warnings.filterwarnings("ignore")
load_dotenv()

# ===========================================================
# API CLIENTS
# ===========================================================

groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
    http_client=httpx.Client(timeout=300.0)
)

gemini_client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# ===========================================================
# FASTAPI APP
# ===========================================================

app = FastAPI(title="AI LearnMate Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===========================================================
# 🎤 TRANSCRIBE
# ===========================================================

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    try:
        audio_bytes = await file.read()

        if not audio_bytes:
            raise HTTPException(status_code=400, detail="Empty file")

        response = groq_client.audio.transcriptions.create(
            file=(file.filename, audio_bytes),
            model="whisper-large-v3"
        )

        return {
            "success": True,
            "transcript": response.text
        }

    except Exception as e:
        print("🔥 TRANSCRIBE ERROR:", str(e))  # ADD THIS
        raise HTTPException(status_code=500, detail=str(e))


# ===========================================================
# 📝 SUMMARIZE
# ===========================================================

@app.post("/summarize-raw")
async def summarize_raw(
    text: str = Body(..., media_type="text/plain"),
    summary_type: str = "medium"
):
    # 1️⃣ Define the single, massive prompt
    prompt = f"""
Summarize the following lecture in {summary_type} format.

Strict Rules:
1. Condense the core meaning. The final output must be significantly shorter than the source material.
2. Use professional markdown formatting (bullet points, bold text).
3. Return ONLY the final summary text.
4. DO NOT include any conversational filler, meta-commentary, or explanations of what you changed (e.g., never say "Here is the summary").

Lecture:
{text}
"""
    
    max_retries = 3
    
    # 2️⃣ The Retry Loop (Catches Google's Busy/Quota Errors)
    for attempt in range(max_retries):
        try:
            # Send the entire text in ONE request
            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash", 
                contents=prompt
            )

            if not response.text:
                raise HTTPException(status_code=500, detail="Summary failed. Empty response from AI.")

            return {
                "success": True,
                "summary": response.text.strip()
            }

        except Exception as e:
            error_msg = str(e)
            
            # If Google is busy (503) or rate limited (429)
            if "503" in error_msg or "429" in error_msg:
                if attempt == max_retries - 1:
                    # Fail gracefully on the final attempt
                    raise HTTPException(
                        status_code=503, 
                        detail="AI servers are currently overloaded. Please try again in a few minutes."
                    )
                
                # Exponential backoff: Wait 2s, then 4s...
                wait_time = 2 ** (attempt + 1)
                print(f"Gemini API busy ({error_msg}). Retrying in {wait_time} seconds... (Attempt {attempt + 1}/{max_retries})")
                await asyncio.sleep(wait_time)
            
            else:
                # If it's a different error (e.g., 401 Unauthorized), crash and report it immediately
                print(f"Summarization Error: {error_msg}")
                raise HTTPException(status_code=500, detail=error_msg)

# ===========================================================
# ❓ QUIZ (Switched to Gemini for Massive Token Support)
# ===========================================================

class QuizRequest(BaseModel):
    text: str 

@app.post("/generate-quiz")
async def generate_quiz(request: QuizRequest):
    try:
        # 1️⃣ DYNAMIC SIZING: Calculate how many questions to ask based on the massive text
        word_count = len(request.text.split())
        
        # Rule: 1 question per 500 words for long transcripts. Minimum 3, Maximum 15.
        calculated_questions = math.ceil(word_count / 500)
        num_questions = max(3, min(15, calculated_questions))

        # 2️⃣ The Dynamic Prompt
        prompt = f"""
Generate exactly {num_questions} short and clear revision questions based on the following text.

Rules:
- Cover the key concepts evenly.
- Each question must be simple and concise.
- Maximum 15 words per question.
- Return ONLY a numbered list.
- No explanation or conversational filler.

Text:
{request.text}
"""

        # 3️⃣ Fast execution using Gemini (1,000,000 Token Limit protects you here)
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        if not response.text:
            raise HTTPException(status_code=500, detail="Empty response from AI")

        # Clean up the response and split into an array for your frontend
        questions = [q.strip() for q in response.text.strip().split("\n") if q.strip()]

        return {
            "success": True,
            "generated_count": len(questions),
            "questions": questions
        }

    except Exception as e:
        print(f"Quiz Generation Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ===========================================================
# HEALTH
# ===========================================================

@app.get("/health")
def health():
    return {"status": "ok"}