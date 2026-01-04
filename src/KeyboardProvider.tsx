import React, { createContext, useContext, useState, useCallback } from 'react';

type KeyboardContextType = {
  showKeyboard: (name: string) => void;
  hideKeyboard: () => void;
  activeKeyboard: string | null;
};

const KeyboardContext = createContext<KeyboardContextType | null>(null);

export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeKeyboard, setActiveKeyboard] = useState<string | null>(null);

  const showKeyboard = useCallback((name: string) => {
    setActiveKeyboard(name);
  }, []);

  const hideKeyboard = useCallback(() => {
    setActiveKeyboard(null);
  }, []);

  return (
    <KeyboardContext.Provider
      value={{ showKeyboard, hideKeyboard, activeKeyboard }}
    >
      {children}
    </KeyboardContext.Provider>
  );
};

export const useKeyboardContext = () => {
  const ctx = useContext(KeyboardContext);
  if (!ctx) {
    throw new Error('useKeyboard must be used within KeyboardProvider');
  }
  return ctx;
};
