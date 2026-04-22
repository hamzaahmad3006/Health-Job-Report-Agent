from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.stt import transcribe_audio
from services.groq_service import extract_report
import uvicorn

app = FastAPI(title="Job Report Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/process-audio")
async def process_audio(file: UploadFile = File(...)):
    try:
        audio_content = await file.read()
        
        # 1. Transcribe
        transcript = transcribe_audio(audio_content, mimetype=file.content_type)
        print(f"DEBUG: Transcript received: '{transcript}'")
        
        if transcript is None:
            raise HTTPException(status_code=500, detail="Failed to communicate with transcription service")
            
        if not transcript.strip():
            return {
                "transcript": "",
                "report": {
                    "patientName": "Unknown",
                    "symptoms": [],
                    "diagnosis": "No voice detected",
                    "treatmentPlan": "Please try recording again with a clearer voice.",
                    "urgency": "Routine"
                }
            }
            
        # 2. Extract structured data using Groq
        report = extract_report(transcript)
        
        if not report:
            raise HTTPException(status_code=500, detail="Failed to extract report from transcript")
            
        return {
            "transcript": transcript,
            "report": report
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

