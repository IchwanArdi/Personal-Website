import { Settings, Moon, Sun } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { TEXTS } from '../../../utils/constants';
import Toggle from '../../../UI/Toggle';

const SettingsDropdown = ({ isOpen }) => {
  const { isDarkMode, language, toggleTheme, changeLanguage } = useApp();
  const t = TEXTS[language];

  return (
    <div
      className={`settings-menu absolute top-full right-0 mt-2 w-64 bg-slate-900 backdrop-blur-md rounded-lg shadow-xl border border-slate-700/50 overflow-hidden transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <h3 className="text-white font-medium flex items-center space-x-2">
          <Settings className="w-4 h-4" />
          <span>{t.settings}</span>
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Theme Toggle */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">{t.theme}</label>
          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
            <div className="flex items-center space-x-3">
              {isDarkMode ? <Moon className="w-4 h-4 text-slate-400" /> : <Sun className="w-4 h-4 text-slate-400" />}
              <span className="text-slate-200 text-sm">{isDarkMode ? t.darkMode : t.lightMode}</span>
            </div>
            <Toggle isOn={isDarkMode} onToggle={toggleTheme} />
          </div>
        </div>

        {/* Language Toggle */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">{t.language}</label>
          <div className="space-y-2">
            <button
              onClick={() => changeLanguage('en')}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${language === 'en' ? 'bg-slate-600/50 text-white' : 'bg-slate-700/30 hover:bg-slate-700/50 text-slate-200'}`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm">🇺🇸</span>
                <span className="text-sm">English</span>
              </div>
              {language === 'en' && <div className="w-2 h-2 bg-white rounded-full" />}
            </button>
            <button
              onClick={() => changeLanguage('id')}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${language === 'id' ? 'bg-slate-600/50 text-white' : 'bg-slate-700/30 hover:bg-slate-700/50 text-slate-200'}`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm">🇮🇩</span>
                <span className="text-sm">Bahasa Indonesia</span>
              </div>
              {language === 'id' && <div className="w-2 h-2 bg-white rounded-full" />}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-700/20 border-t border-slate-700/50">
        <p className="text-xs text-slate-400 text-center">{t.settingsAutoSaved}</p>
      </div>
    </div>
  );
};

export default SettingsDropdown;
