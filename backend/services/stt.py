import os
import requests
from dotenv import load_dotenv

load_dotenv()

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")

def transcribe_audio(audio_content: bytes, mimetype: str = "audio/wav"):
    """
    Transcribe audio using Deepgram REST API for maximum reliability 
    regardless of SDK version.
    """
    if not DEEPGRAM_API_KEY:
        print("STT Error: DEEPGRAM_API_KEY is missing")
        return None

    url = "https://api.deepgram.com/v1/listen"
    params = {
        "model": "nova-2",
        "smart_format": "true",
        "punctuate": "true",
    }
    headers = {
        "Authorization": f"Token {DEEPGRAM_API_KEY}",
        "Content-Type": mimetype,
    }

    try:
        response = requests.post(
            url, 
            params=params, 
            headers=headers, 
            data=audio_content, 
            timeout=60
        )
        response.raise_for_status()
        data = response.json()
        
        # Extract transcript from response (allow empty string, only fail if None)
        transcript = data.get("results", {}).get("channels", [{}])[0].get("alternatives", [{}])[0].get("transcript")
        
        if transcript is None:
            print(f"STT Warning: Direct transcript field missing, response: {data}")
            return None
            
        return transcript
        
    except Exception as e:
        print(f"STT Error: {e}")
        return None


