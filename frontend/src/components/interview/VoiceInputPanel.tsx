import React, { useState } from 'react';
import { Mic, MicOff, Send, Volume2, Sparkles } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../common/Button';

interface VoiceInputPanelProps {
  question: string;
  onAnswerSubmit: (answer: string) => void;
  isLoading?: boolean;
}

export const VoiceInputPanel: React.FC<VoiceInputPanelProps> = ({
  question,
  onAnswerSubmit,
  isLoading = false,
}) => {
  const { language } = useLanguage();
  const [typedText, setTypedText] = useState('');
  const { isListening, transcript, error: speechError, startListening, stopListening, resetTranscript } =
    useSpeechRecognition(language);
  const { speak, isSpeaking } = useSpeechSynthesis();


  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleReadQuestion = () => {
    speak(question, language);
  };

  const handleSubmit = () => {
    const finalAnswer = transcript.trim() || typedText.trim();
    if (finalAnswer) {
      onAnswerSubmit(finalAnswer);
      setTypedText('');
      resetTranscript();
    }
  };

  return (
    <div className="space-y-6">
      {/* Current AI Question */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-white via-[#F7FBFC] to-[#D7EAEE]/30 border border-[#9CD1CE]/50 shadow-card-soft space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1D837F] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#3EAEB1]" />
            AI Intake Assistant Question
          </span>
          <button
            onClick={handleReadQuestion}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all ${
              isSpeaking
                ? 'bg-[#3EAEB1] text-white border-[#3EAEB1] animate-pulse'
                : 'bg-white text-[#1D837F] border-[#9CD1CE] hover:bg-[#D7EAEE]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'Reading...' : 'Listen Question'}</span>
          </button>
        </div>

        <h3 className="text-xl font-bold text-[#102A43] leading-snug">
          {question}
        </h3>
      </div>

      {/* Voice Assistant Visualizer & Mic Button */}
      <div className="p-8 rounded-2xl bg-white border border-[#9CD1CE]/40 shadow-card-soft flex flex-col items-center justify-center space-y-6">
        <div className="flex items-center gap-1.5 h-10">
          <span className={`w-1.5 rounded-full bg-[#3EAEB1] ${isListening ? 'animate-wave-1' : 'h-2 opacity-30'}`} />
          <span className={`w-1.5 rounded-full bg-[#1D837F] ${isListening ? 'animate-wave-2' : 'h-4 opacity-30'}`} />
          <span className={`w-1.5 rounded-full bg-[#61BACA] ${isListening ? 'animate-wave-3' : 'h-6 opacity-30'}`} />
          <span className={`w-1.5 rounded-full bg-[#1D837F] ${isListening ? 'animate-wave-4' : 'h-4 opacity-30'}`} />
          <span className={`w-1.5 rounded-full bg-[#3EAEB1] ${isListening ? 'animate-wave-5' : 'h-2 opacity-30'}`} />
        </div>

        <button
          onClick={handleMicClick}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening
              ? 'bg-rose-500 text-white mic-active scale-105 shadow-xl shadow-rose-500/30'
              : 'bg-gradient-to-tr from-[#1D837F] to-[#3EAEB1] text-white shadow-xl shadow-[#3EAEB1]/30 hover:scale-105'
          }`}
        >
          {isListening ? (
            <MicOff className="w-10 h-10 animate-pulse" />
          ) : (
            <Mic className="w-10 h-10" />
          )}
        </button>

        {speechError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold text-center max-w-md">
            {speechError}
          </div>
        )}

        <p className="text-sm font-bold text-[#1D837F]">
          {isListening ? 'Listening... Speak your response clearly' : 'Tap Microphone to Speak Response'}
        </p>


        {/* Real-time transcript feedback */}
        {(transcript || isListening) && (
          <div className="w-full p-4 rounded-xl bg-[#D7EAEE]/30 border border-[#9CD1CE]/40 text-sm text-[#102A43]">
            <span className="font-semibold text-[#1D837F]">Recognized Text: </span>
            {transcript || 'Listening for speech...'}
          </div>
        )}
      </div>

      {/* Alternative Typed Input Form */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-[#102A43]">
          Or type your answer below:
        </label>
        <div className="flex gap-2">
          <textarea
            rows={2}
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder="Type your response here..."
            className="flex-1 p-3 text-sm rounded-xl border border-[#9CD1CE] focus:outline-none focus:ring-2 focus:ring-[#3EAEB1] resize-none"
          />
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            className="self-end"
            icon={<Send className="w-4 h-4" />}
          >
            Submit Answer
          </Button>
        </div>
      </div>
    </div>
  );
};
