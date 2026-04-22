"use client";

import { useState } from "react";
import AudioRecorder from "@/components/AudioRecorder";
import ReportDisplay from "@/components/ReportDisplay";

interface ReportData {
  transcript: string;
  report: {
    patientName: string;
    location: string;
    clinicalObservation: string;
    treatmentProvided: string[];
    medicalSuppliesUsed: string[];
    patientSentiment: string;
    nextActionRequired: string;
    technicianStatus: string;
    urgency: "Routine" | "Urgent" | "Emergency";
  };
}

export default function Home() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAudioProcessed = (data: ReportData | null) => {
    setReportData(data);
    setIsProcessing(false);
  };

  const handleProcessingStart = () => {
    setIsProcessing(true);
    setReportData(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-premium-slate-900 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[100px] animate-float delay-300"></div>
      
      <div className="w-full max-w-2xl glass-card rounded-[2rem] overflow-hidden relative z-10 transition-all duration-500">
        <header className="p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-sky-500/5 -z-10"></div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-gradient">
            Health Job Assistant
          </h1>
          <p className="text-slate-50 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
            Doctors speak. AI documents. Focused patient care.
          </p>
        </header>

        <section className="p-10 pt-2 space-y-10">
          <div className="flex flex-col items-center">
            <AudioRecorder 
              onProcessingStart={handleProcessingStart}
              onProcessed={handleAudioProcessed} 
            />
          </div>

          {(isProcessing || reportData) && (
            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
              {isProcessing && (
                <div className="flex flex-col items-center space-y-6 py-12">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute inset-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-2 w-16 h-16 border-4 border-sky-500 border-b-transparent rounded-full animate-spin-reverse brightness-110"></div>
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-200">AI is Analysing...</p>
                    <p className="text-slate-500 text-sm font-medium">Generating your professional clinical summary</p>
                  </div>
                </div>
              )}

              {reportData && <ReportDisplay data={reportData} />}
            </div>
          )}
        </section>
      </div>

      <footer className="mt-12 text-slate-400 dark:text-slate-500 text-sm font-medium tracking-wide text-center z-10">
        <p className="opacity-70">Built for Health Professionals</p>
        <div className="flex items-center justify-center space-x-4 mt-2">
          <span className="h-px w-8 bg-slate-300 dark:bg-slate-700"></span>
          <span>Deepgram & Groq</span>
          <span className="h-px w-8 bg-slate-300 dark:bg-slate-700"></span>
        </div>
      </footer>
    </main>
  );
}
