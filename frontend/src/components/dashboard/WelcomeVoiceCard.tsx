import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Shield, Lock, Send, Keyboard } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useLanguage } from '../../context/LanguageContext';
import { useCase } from '../../context/CaseContext';
import { Button } from '../common/Button';

export const WelcomeVoiceCard: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { updateCaseTaking } = useCase();
  const [typedInput, setTypedInput] = useState('');
  const [showTypedInput, setShowTypedInput] = useState(false);

  const {
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
  } = useSpeechRecognition(language);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
      if (transcript.trim()) {
        updateCaseTaking({ chief_complaint: transcript });
        navigate('/patient/interview');
      }
    } else {
      startListening();
    }
  };

  const handleTypedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typedInput.trim()) {
      await updateCaseTaking({ chief_complaint: typedInput });
      navigate('/patient/interview');
    }
  };

  const getDynamicGreeting = () => {
    if (language === 'hi') {
      return 'नमस्ते!';
    }
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning!';
    } else if (hour < 17) {
      return 'Good afternoon!';
    } else {
      return 'Good evening!';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-white/90 via-[#F7FBFC]/95 to-white/90 border border-[#9CD1CE]/40 shadow-card-soft p-6 lg:p-8 backdrop-blur-md">
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-[#9FD8E1]/30 via-[#61BACA]/20 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Text Greeting */}
        <div className="space-y-3 text-center md:text-left max-w-xl">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#1D837F] tracking-tight">
            {getDynamicGreeting()}
          </h2>
          <p className="text-base font-semibold text-[#102A43]">
            {t('dashboard.welcomeSub')}
          </p>

          <p className="text-xs text-slate-600 leading-relaxed">
            {t('dashboard.voicePrompt')}
          </p>

          {/* Privacy Badges */}
          <div className="flex items-center justify-center md:justify-start gap-4 pt-2 text-xs font-medium text-[#1D837F]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D7EAEE]/50 border border-[#9CD1CE]/50">
              <Shield className="w-3.5 h-3.5 text-[#3EAEB1]" />
              {t('dashboard.securePrivate')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D7EAEE]/50 border border-[#9CD1CE]/50">
              <Lock className="w-3.5 h-3.5 text-[#3EAEB1]" />
              {t('dashboard.dataProtected')}
            </span>
          </div>
        </div>

        {/* Central Voice Mic Button & Waveform */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5 h-8">
            <span className={`w-1 rounded-full bg-[#3EAEB1] ${isListening ? 'animate-wave-1' : 'h-1.5 opacity-40'}`} />
            <span className={`w-1 rounded-full bg-[#1D837F] ${isListening ? 'animate-wave-2' : 'h-3 opacity-40'}`} />
            <span className={`w-1 rounded-full bg-[#61BACA] ${isListening ? 'animate-wave-3' : 'h-5 opacity-40'}`} />
            <span className={`w-1 rounded-full bg-[#1D837F] ${isListening ? 'animate-wave-4' : 'h-3 opacity-40'}`} />
            <span className={`w-1 rounded-full bg-[#3EAEB1] ${isListening ? 'animate-wave-5' : 'h-1.5 opacity-40'}`} />
          </div>

          <button
            onClick={handleToggleListening}
            className={`relative group w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening
                ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white mic-active shadow-lg shadow-rose-500/30 scale-105'
                : 'bg-gradient-to-tr from-[#1D837F] to-[#3EAEB1] text-white shadow-xl shadow-[#3EAEB1]/30 hover:scale-105 hover:shadow-2xl'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start speaking'}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 animate-pulse" />
            ) : (
              <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
            )}
          </button>

          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-[#1D837F] block">
              {isListening ? t('dashboard.listening') : t('dashboard.tapToSpeak')}
            </span>
            <button
              onClick={() => setShowTypedInput(!showTypedInput)}
              className="text-[11px] text-slate-500 hover:text-[#3EAEB1] underline inline-flex items-center gap-1"
            >
              <Keyboard className="w-3 h-3" />
              {t('dashboard.typeInstead')}
            </button>
          </div>
        </div>
      </div>

      {/* Transcript or Typed Input Area */}
      {(isListening || transcript || showTypedInput) && (
        <div className="mt-6 pt-4 border-t border-[#D7EAEE] animate-fade-in">
          {isListening && (
            <div className="p-3 rounded-xl bg-[#D7EAEE]/40 border border-[#9CD1CE]/50 text-xs text-[#102A43]">
              <span className="font-semibold text-[#1D837F]">Hearing: </span>
              {transcript || 'Speaking into microphone...'}
            </div>
          )}

          {speechError && (
            <p className="text-xs text-rose-500 font-medium mb-2">{speechError}</p>
          )}

          {showTypedInput && (
            <form onSubmit={handleTypedSubmit} className="flex gap-2">
              <input
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder="Describe your health problem or symptoms here..."
                className="flex-1 px-4 py-2 text-xs rounded-xl border border-[#9CD1CE] focus:outline-none focus:ring-2 focus:ring-[#3EAEB1]"
              />
              <Button type="submit" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
                Continue
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
