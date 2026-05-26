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
import uuid # 🔥 ADD THIS to generate random names
import yt_dlp # 🔥 ADD THIS LINE
from pydantic import BaseModel
from fastapi import Body, HTTPException
from deepgram import DeepgramClient


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
# 🎤 TRANSCRIBE (Deepgram SDK v7 - Max Timeout Configured)
# ===========================================================

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    try:
        audio_bytes = await file.read()

        if not audio_bytes:
            raise HTTPException(status_code=400, detail="Empty file")

        DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
        if not DEEPGRAM_API_KEY:
            raise HTTPException(status_code=500, detail="Deepgram API key is missing")

        file_size_mb = len(audio_bytes) / (1024 * 1024)
        print(f"Sending {file.filename} ({file_size_mb:.2f} MB) to Deepgram...")
        
        # 1️⃣ Initialize client with a 10-minute timeout for massive files
        deepgram = DeepgramClient(api_key=DEEPGRAM_API_KEY, timeout=600.0)

        # 2️⃣ Send the file bytes directly (New v7 Syntax!)
        response = deepgram.listen.v1.media.transcribe_file(
            request=audio_bytes,
            model="nova-2",
            smart_format=True
        )

        # 3️⃣ Extract transcript using dot notation (New v7 Object Structure!)
        transcript = response.results.channels[0].alternatives[0].transcript

        if not transcript:
            raise HTTPException(status_code=500, detail="Transcription failed. Audio might be silent.")

        print("Transcription successful!")
        return {
            "success": True,
            "transcript": transcript
        }

    except Exception as e:
        print("🔥 TRANSCRIBE ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
    

# ===========================================================
# 🎥 TRANSCRIBE YOUTUBE (Updated to Deepgram SDK v7)
# ===========================================================

class YouTubeRequest(BaseModel):
    url: str

@app.post("/transcribe-youtube")
async def transcribe_youtube(request: YouTubeRequest):
    try:
        # 🔥 Generate a random string (e.g., 'a1b2c3d4')
        random_id = uuid.uuid4().hex 
        
        ydl_opts = {
            'format': 'm4a[abr<=64]/worstaudio/bestaudio', 
            # 🔥 Inject the random ID into the filename
            'outtmpl': f'temp_audio_{random_id}.%(ext)s', 
            'quiet': False, 
            'noplaylist': True,
            'socket_timeout': 60,
            'extractor_args': {'youtube': ['player_client=android,web']}
        }

        print(f"Downloading audio from: {request.url}")
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(request.url, download=True)
            downloaded_file = ydl.prepare_filename(info_dict)

        # 1️⃣ Read the downloaded file
        with open(downloaded_file, 'rb') as f:
            audio_bytes = f.read()

        DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
        if not DEEPGRAM_API_KEY:
            raise HTTPException(status_code=500, detail="Deepgram API key missing")

        print(f"Sending YouTube Audio ({len(audio_bytes) / (1024 * 1024):.2f} MB) to Deepgram...")

        # 2️⃣ Initialize Deepgram SDK (Just like the file upload endpoint!)
        deepgram = DeepgramClient(api_key=DEEPGRAM_API_KEY, timeout=600.0)

        # 3️⃣ Send to Deepgram
        response = deepgram.listen.v1.media.transcribe_file(
            request=audio_bytes,
            model="nova-2",
            smart_format=True
        )

        # 4️⃣ Delete the temp file from your server so it doesn't take up space
        if os.path.exists(downloaded_file):
            os.remove(downloaded_file)

        # 5️⃣ Extract transcript safely
        transcript = response.results.channels[0].alternatives[0].transcript

        if not transcript:
            raise HTTPException(status_code=500, detail="Transcription failed. Audio might be silent.")

        print("YouTube Transcription successful!")
        return {"success": True, "transcript": transcript}

    except Exception as e:
        # Emergency cleanup if it crashes
        if 'downloaded_file' in locals() and os.path.exists(downloaded_file):
            os.remove(downloaded_file)
        print(f"🔥 YOUTUBE ERROR: {str(e)}")
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