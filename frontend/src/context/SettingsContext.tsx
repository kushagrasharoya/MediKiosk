import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  audioHelpEnabled: boolean;
  setAudioHelpEnabled: (enabled: boolean) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
  saveSettings: () => void;
}

const STORAGE_KEY_SETTINGS = 'medikiosk_app_settings';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioHelpEnabled, setAudioHelpEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved).audioHelpEnabled ?? true;
      } catch (e) {}
    }
    return true;
  });

  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved).darkMode ?? false;
      } catch (e) {}
    }
    return false;
  });

  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved).reducedMotion ?? false;
      } catch (e) {}
    }
    return false;
  });

  // Apply DOM classes when darkMode or reducedMotion change
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

  const saveSettings = () => {
    const data = { audioHelpEnabled, darkMode, reducedMotion };
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(data));
  };

  return (
    <SettingsContext.Provider
      value={{
        audioHelpEnabled,
        setAudioHelpEnabled: setAudioHelpEnabledState,
        darkMode,
        setDarkMode: setDarkModeState,
        reducedMotion,
        setReducedMotion: setReducedMotionState,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
