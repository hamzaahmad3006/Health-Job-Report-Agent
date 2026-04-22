"use client";

import { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaStop, FaUpload } from "react-icons/fa6";

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

interface AudioRecorderProps {
    onProcessed: (data: ReportData | null) => void;
    onProcessingStart: () => void;
}

export default function AudioRecorder({ onProcessed, onProcessingStart }: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startRecording = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Browser does not support audio recording or is not in a secure context.");
            }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const mimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
                const audioBlob = new Blob(chunksRef.current, { type: mimeType });
                await uploadAudio(audioBlob, mimeType);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access denied or not supported.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const uploadAudio = async (blob: Blob, mimeType: string) => {
        onProcessingStart();
        const formData = new FormData();
        const extension = mimeType.includes("wav") ? "wav" : mimeType.includes("mp4") ? "m4a" : "webm";
        formData.append("file", blob, `recording.${extension}`);

        try {
            const response = await fetch("/api/process-audio", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || "Processing failed");
            }

            const data = await response.json();
            onProcessed(data);
        } catch (err: unknown) {
            console.error("Upload error:", err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
            alert(`Error: ${errorMessage}. Please check your connection and backend configuration.`);
            onProcessingStart(); // Reset loading state
            onProcessed(null);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadAudio(file, file.type);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex flex-col items-center space-y-10 w-full max-w-sm mx-auto">
            <div className="relative group cursor-pointer" onClick={isRecording ? stopRecording : startRecording}>
                {/* Background glowing rings */}
                <div className={`absolute inset-[-20px] rounded-full transition-all duration-700 blur-2xl opacity-20 ${
                    isRecording ? "bg-red-500 scale-125 animate-pulse" : "bg-blue-500 group-hover:scale-110"
                }`}></div>
                
                <button
                    className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
                        isRecording
                            ? "bg-gradient-to-tr from-rose-500 to-red-600 scale-110 shadow-red-500/20"
                            : "bg-gradient-to-tr from-blue-600 to-sky-700 hover:scale-105 shadow-blue-500/20"
                    } text-white border-4 border-white/10`}
                >
                    {isRecording ? (
                        <FaStop className="text-4xl animate-in zoom-in duration-300" />
                    ) : (
                        <FaMicrophone className="text-4xl animate-in zoom-in duration-300" />
                    )}
                    
                    {/* Inner glowing ring */}
                    <div className={`absolute inset-0 rounded-full border-2 border-white/30 ${isRecording ? 'animate-ping opacity-20' : 'group-hover:animate-pulse opacity-50'}`}></div>
                </button>

                {isRecording && (
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
                        <div className="flex items-center space-x-2 bg-red-500/10 dark:bg-red-500/20 px-3 py-1.5 rounded-full border border-red-500/30">
                           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                           <span className="font-mono font-bold text-red-500 text-sm tracking-wider">
                                {formatTime(recordingTime)}
                           </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full space-y-6">
                <div className="text-center space-y-2">
                    <p className="text-slate-800 dark:text-slate-200 font-bold text-lg">
                        {isRecording ? "Listening to clinical details..." : "Capture Clinical Session"}
                    </p>
                    <p className="text-slate-500 text-sm font-medium">
                        {isRecording ? "Tap recording button to finish" : "Speak naturally or upload an existing file"}
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>
                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">or</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>
                </div>

                <label className="flex items-center justify-center space-x-3 w-full py-4 px-6 bg-slate-100/50 dark:bg-slate-800/30 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-2xl cursor-pointer transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 group active:scale-[0.98]">
                    <div className="p-2.5 bg-white dark:bg-slate-700 rounded-xl shadow-sm group-hover:-translate-y-0.5 transition-transform duration-300">
                        <FaUpload className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-bold tracking-tight">Upload Clinical Audio</span>
                    <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
                </label>
            </div>
        </div>
    );
}
