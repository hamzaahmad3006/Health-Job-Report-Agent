import os
from groq import Groq
from dotenv import load_dotenv
import json

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

def extract_report(transcript: str) -> dict:
    """Extract structured job report from transcript using Groq."""
    if not GROQ_API_KEY:
        print("Groq Error: GROQ_API_KEY is missing")
        return None
        
    client = Groq(api_key=GROQ_API_KEY)

    
    system_prompt = """You are an expert medical transcriptionist and clinical coder. 

Extract the following information from the medical voice transcript and return it as a valid JSON object:
- patientName: The name of the patient
- location: The location of the visit (e.g., "4th Street Residence")
- clinicalObservation: A concise summary of symptoms or clinical findings mentioned
- treatmentProvided: An array of specific treatments or interventions performed
- medicalSuppliesUsed: An array of medications or supplies used (e.g., "Batch XJ-900", "2 oxygen canisters")
- patientSentiment: Brief description of the patient's emotional state or concerns
- nextActionRequired: Specific follow-up or next steps recommended
- technicianStatus: Current status or ETA for next appointment
- urgency: One of "Routine", "Urgent", or "Emergency" based on clinical severity

Return ONLY a valid JSON object, no additional text."""

    user_prompt = f"Transcript: {transcript}"

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0,
            response_format={"type": "json_object"}
        )
        
        result = response.choices[0].message.content
        return json.loads(result)
    except Exception as e:
        print(f"Groq Error: {e}")
        return None
