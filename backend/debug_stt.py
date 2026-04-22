import os
import requests
from dotenv import load_dotenv

load_dotenv()

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")

def test_deepgram_rest():
    print("Testing Deepgram REST API directly...")
    url = "https://api.deepgram.com/v1/listen"
    params = {
        "model": "nova-2",
        "smart_format": "true",
    }
    headers = {
        "Authorization": f"Token {DEEPGRAM_API_KEY}",
        "Content-Type": "audio/wav",
    }
    # Create a dummy 1-second silent wav for testing if possible, or just send empty/minimal
    # Actually, let's just check if we get a 401/403 or a 400.
    try:
        r = requests.post(url, params=params, headers=headers, data=b"", timeout=10)
        print(f"Status Code: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if not DEEPGRAM_API_KEY:
        print("Error: DEEPGRAM_API_KEY is missing in .env")
    else:
        test_deepgram_rest()
