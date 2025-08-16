import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState('en');

  // Persist settings (opsional - bisa pakai localStorage nanti)
  useEffect(() => {
    // Load saved settings dari localStorage jika ada
    const savedTheme = localStorage.getItem('theme');
    const savedLang = localStorage.getItem('language');

    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
    if (savedLang) setLanguage(savedLang);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const value = {
    isDarkMode,
    language,
    toggleTheme,
    changeLanguage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
