import { Settings, Moon, Sun } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { TEXTS } from '../../../utils/constants';
import { useMemo, useCallback } from 'react';
import Toggle from '../../../UI/Toggle';

const SettingsDropdown = ({ isOpen }) => {
  const { isDarkMode, language, toggleTheme, changeLanguage } = useApp();

  // Memoize texts untuk mencegah re-computation
  const t = useMemo(() => TEXTS[language], [language]);

  // Memoize class names untuk mengurangi string concatenation
  const containerClasses = useMemo(
    () =>
      `settings-menu absolute top-full right-0 mt-2 w-64 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'} backdrop-blur-md rounded-lg shadow-xl border ${
        isDarkMode ? 'border-slate-700/50' : 'border-slate-300/50'
      } overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}`,
    [isDarkMode, isOpen]
  );

  const headerClasses = useMemo(() => `p-4 border-b ${isDarkMode ? 'border-slate-700/50' : 'border-slate-300/50'}`, [isDarkMode]);

  const footerClasses = useMemo(() => `p-3 border-t text-xs text-center ${isDarkMode ? 'bg-slate-700/20 border-slate-700/50 text-slate-400' : 'bg-slate-200 border-slate-300/50 text-slate-500'}`, [isDarkMode]);

  // Optimized event handlers dengan useCallback
  const handleEnglish = useCallback(() => changeLanguage('en'), [changeLanguage]);
  const handleIndonesian = useCallback(() => changeLanguage('id'), [changeLanguage]);

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className={headerClasses}>
        <h3 className={`font-medium flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <Settings className="w-4 h-4" />
          <span>{t.settings}</span>
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Theme Toggle */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.theme}</label>
          <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-slate-200 hover:bg-slate-300'}`}>
            <div className="flex items-center space-x-3">
              {isDarkMode ? <Moon className="w-4 h-4 text-slate-400" /> : <Sun className="w-4 h-4 text-slate-500" />}
              <span className={`text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{isDarkMode ? t.darkMode : t.lightMode}</span>
            </div>
            <Toggle isOn={isDarkMode} onToggle={toggleTheme} />
          </div>
        </div>

        {/* Language Toggle */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.language}</label>
          <div className="space-y-2">
            {/* English Button */}
            <button
              onClick={handleEnglish}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                language === 'en' ? (isDarkMode ? 'bg-slate-600/50 text-white' : 'bg-slate-300 text-slate-900') : isDarkMode ? 'bg-slate-700/30 hover:bg-slate-700/50 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm">🇺🇸</span>
                <span className="text-sm">English</span>
              </div>
              {language === 'en' && <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-white' : 'bg-slate-900'}`} />}
            </button>

            {/* Indonesian Button */}
            <button
              onClick={handleIndonesian}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                language === 'id' ? (isDarkMode ? 'bg-slate-600/50 text-white' : 'bg-slate-300 text-slate-900') : isDarkMode ? 'bg-slate-700/30 hover:bg-slate-700/50 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm">🇮🇩</span>
                <span className="text-sm">Bahasa Indonesia</span>
              </div>
              {language === 'id' && <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-white' : 'bg-slate-900'}`} />}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={footerClasses}>
        <p>{t.settingsAutoSaved}</p>
      </div>
    </div>
  );
};

export default SettingsDropdown;
