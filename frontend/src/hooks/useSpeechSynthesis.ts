import { useState, useCallback, useEffect } from 'react';
import { voiceService } from '../services/voiceService';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(() => voiceService.isSpeechSynthesisSupported());

  useEffect(() => {
    // Pre-warm browser voice list
    if (isSupported) {
      voiceService.getAvailableVoices();
    }
  }, [isSupported]);

  const speak = useCallback(
    (text: string, lang: string = 'en', rate: number = 0.95) => {
      if (!isSupported || !text) return;
      setIsSpeaking(true);
      voiceService.speakText(
        text,
        lang,
        rate,
        () => {
          setIsSpeaking(false);
        },
        (err) => {
          console.error('Speech error:', err);
          setIsSpeaking(false);
        }
      );
    },
    [isSupported]
  );

  const stop = useCallback(() => {
    voiceService.stopSpeech();
    setIsSpeaking(false);
  }, []);

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
  };
};
