export const voiceService = {
  isSpeechRecognitionSupported: (): boolean => {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  },

  isSpeechSynthesisSupported: (): boolean => {
    return 'speechSynthesis' in window;
  },

  getAvailableVoices: (): SpeechSynthesisVoice[] => {
    if (!('speechSynthesis' in window)) return [];
    return window.speechSynthesis.getVoices();
  },

  speakText: (
    text: string,
    lang: string = 'en',
    rate: number = 0.95,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): void => {
    if (!('speechSynthesis' in window)) {
      if (onError) onError('Speech synthesis not supported');
      return;
    }

    // Cancel any active speech utterance
    window.speechSynthesis.cancel();

    // Clean up text (remove markdown symbols)
    const cleanText = text.replace(/[*_#`~]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.lang = targetLang;
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Helper to assign best matching voice from browser
    const setBestVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        let voice: SpeechSynthesisVoice | undefined;
        if (lang === 'hi') {
          voice = voices.find(
            (v) =>
              v.lang.toLowerCase().includes('hi') ||
              v.name.toLowerCase().includes('hindi') ||
              v.lang.toLowerCase().includes('hi-in')
          );
        }
        if (!voice) {
          voice = voices.find(
            (v) =>
              v.lang.toLowerCase().includes('en-in') ||
              v.lang.toLowerCase().includes('en-us') ||
              v.lang.toLowerCase().includes('en')
          );
        }
        if (voice) {
          utterance.voice = voice;
        }
      }
    };

    setBestVoice();

    // If voices weren't loaded yet, try when onvoiceschanged fires
    if (!utterance.voice && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        setBestVoice();
      };
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis utterance error:', e);
      if (onEnd) onEnd();
      if (onError) onError(e);
    };

    // Chrome workaround for stuck synthesis queue
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);
  },

  stopSpeech: (): void => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },
};
