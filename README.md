# 🏥 Health Job Assistant

Health Job Assistant is a premium, AI-powered mobile-friendly web application designed for healthcare professionals. It automates the clinical documentation process by converting voice notes from patient visits into structured, professional medical reports.

## 🚀 Key Features

- **🎙️ Voice Capture**: High-quality audio recording directly from the browser or mobile device.
- **⚡ Real-time Transcription**: Powered by **Deepgram Nova-2** for blazing-fast and accurate speech-to-text.
- **🧠 AI Clinical Extraction**: Uses **Groq (Llama 3)** to extract structured data points including:
    - Patient Identity & Location
    - Clinical Observations
    - Treatments Provided
    - Medical Supplies Used
    - Patient Sentiment
    - Required Next Actions
- **💎 Premium UI**: A modern, sleek, and responsive interface built with Next.js and Tailwind CSS.
- **📄 Professional Export**: One-click export of clinical summaries into formatted text reports.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Fa6)
- **Animations**: Framer Motion / CSS Transitions

### Backend
- **Framework**: FastAPI (Python)
- **STT**: Deepgram REST API
- **LLM**: Groq SDK (Llama 3.3 70B)
- **Data Validation**: Pydantic

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- Python (3.9+)
- Deepgram API Key
- Groq API Key

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```env
DEEPGRAM_API_KEY=your_deepgram_key
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.3-70b-versatile
```

Run the backend:
```bash
python main.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Run the frontend:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📖 Usage Guide

1. **Start Recording**: Tap the microphone icon and speak naturally about the patient visit details.
2. **Clinical Details**: Mention the patient name, location, clinical findings, treatment given, and any supplies used.
3. **Stop & Process**: Tap the stop button. The AI will instantly transcribe and analyze your voice note.
4. **Review Report**: Review the structured report displayed on the screen.
5. **Export**: Use the "Export Patient Visit Report" button to download a professional summary.

## 🔒 Security & Compliance
- Designed with HIPAA-compliant workflows in mind (though local dev versions should be secured further for production).
- Audio is processed securely via API and not stored permanently on this server in its current form.

---
Built for Health Professionals. Focused on Patient Care.
