import { Settings, Instagram, X, Github, Moon, Sun, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState('en'); // 'en' or 'id'

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.mobile-menu') && !e.target.closest('.menu-toggle')) {
        setIsMenuOpen(false);
      }
      if (!e.target.closest('.settings-menu') && !e.target.closest('.settings-toggle')) {
        setIsSettingsOpen(false);
      }
    };

    if (isMenuOpen || isSettingsOpen) {
      document.addEventListener('click', handleClickOutside);
      if (isMenuOpen) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isSettingsOpen]);

  const navLinks = [
    {
      name: language === 'en' ? 'HOME' : 'BERANDA',
      href: '#home',
    },
    {
      name: language === 'en' ? 'PROJECTS' : 'PROYEK',
      href: '#projects',
    },
    {
      name: language === 'en' ? 'BLOGS' : 'BLOG',
      href: '#blogs',
    },
    {
      name: language === 'en' ? 'ABOUT ME' : 'TENTANG SAYA',
      href: '#about',
    },
  ];

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-sm font-semibold text-slate-200 hover:text-blue-400 transition-colors duration-200">
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Mobile Logo */}
            <div className="lg:hidden">
              <a href="/home" className="text-white text-xl font-bold">
                LOGO
              </a>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {/* Simple Elegant Settings Toggle */}
              <div className="relative">
                <button className="settings-toggle relative p-3 group" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                  <div className="relative w-5 h-5">
                    <Settings className={`w-5 h-5 text-slate-300 transition-all duration-300 ${isSettingsOpen ? 'rotate-90 text-white' : 'group-hover:rotate-45 group-hover:text-slate-200'}`} />
                  </div>
                </button>

                {/* Simple Settings Dropdown */}
                <div
                  className={`settings-menu absolute top-full right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-700/50 overflow-hidden transition-all duration-300 ${
                    isSettingsOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                  }`}
                >
                  {/* Simple Header */}
                  <div className="p-4 border-b border-slate-700/50">
                    <h3 className="text-white font-medium flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>{language === 'en' ? 'Settings' : 'Pengaturan'}</span>
                    </h3>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Simple Theme Toggle */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">{language === 'en' ? 'Theme' : 'Tema'}</label>
                      <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          {isDarkMode ? <Moon className="w-4 h-4 text-slate-400" /> : <Sun className="w-4 h-4 text-slate-400" />}
                          <span className="text-slate-200 text-sm">{isDarkMode ? (language === 'en' ? 'Dark Mode' : 'Mode Gelap') : language === 'en' ? 'Light Mode' : 'Mode Terang'}</span>
                        </div>
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-500'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isDarkMode ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                        </button>
                      </div>
                    </div>

                    {/* Simple Language Toggle */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">{language === 'en' ? 'Language' : 'Bahasa'}</label>
                      <div className="space-y-2">
                        <button
                          onClick={() => setLanguage('en')}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${language === 'en' ? 'bg-slate-600/50 text-white' : 'bg-slate-700/30 hover:bg-slate-700/50 text-slate-200'}`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-sm">🇺🇸</span>
                            <span className="text-sm">English</span>
                          </div>
                          {language === 'en' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </button>
                        <button
                          onClick={() => setLanguage('id')}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${language === 'id' ? 'bg-slate-600/50 text-white' : 'bg-slate-700/30 hover:bg-slate-700/50 text-slate-200'}`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-sm">🇮🇩</span>
                            <span className="text-sm">Bahasa Indonesia</span>
                          </div>
                          {language === 'id' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Simple Footer */}
                  <div className="p-3 bg-slate-700/20 border-t border-slate-700/50">
                    <p className="text-xs text-slate-400 text-center">{language === 'en' ? 'Settings auto-saved' : 'Pengaturan tersimpan'}</p>
                  </div>
                </div>
              </div>

              {/* Simple Elegant Menu Toggle */}
              <button className="menu-toggle lg:hidden relative p-3 group" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <div className="relative w-5 h-5">
                  <span className={`absolute top-1 left-0 w-5 h-0.5 bg-slate-300 rounded-full transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-46 translate-y-1.5' : 'group-hover:w-4'}`}></span>
                  <span
                    className={`absolute top-1/2 left-0 w-5 h-0.5 bg-slate-300 rounded-full transition-all duration-300 transform -translate-y-1/2 ${isMenuOpen ? 'opacity-0 scale-x-0' : 'group-hover:w-3 group-hover:translate-x-0.5'}`}
                  ></span>
                  <span className={`absolute bottom-1 left-0 w-5 h-0.5 bg-slate-300 rounded-full transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'group-hover:w-4'}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Simple Enhanced Mobile Menu */}
      <div className={`mobile-menu lg:hidden fixed top-0 right-0 h-screen w-80 bg-slate-900/95 backdrop-blur-md shadow-2xl z-40 transition-all duration-400 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 pt-20">
          {/* Simple Close Button */}
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-800/50 rounded-lg transition-colors group">
            <div className="w-5 h-5 relative">
              <span className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-slate-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 rotate-45 group-hover:bg-white transition-colors"></span>
              <span className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-slate-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 -rotate-45 group-hover:bg-white transition-colors"></span>
            </div>
          </button>

          {/* Simple Menu title */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white">{language === 'en' ? 'Navigation' : 'Navigasi'}</h2>
            <div className="w-8 h-0.5 bg-slate-400 mt-2"></div>
          </div>

          {/* Simple Navigation Links */}
          <nav className="space-y-2 mb-12">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="block group py-3 px-4 rounded-lg hover:bg-slate-800/50 transition-all duration-200">
                <span className="text-lg font-medium text-slate-200 group-hover:text-white group-hover:translate-x-1 inline-block transition-all duration-200">{link.name}</span>
              </a>
            ))}
          </nav>

          {/* Simple Social Links */}
          <div className="space-y-4">
            <p className="text-slate-400 text-sm font-medium">{language === 'en' ? 'Connect with me' : 'Hubungi saya'}</p>
            <div className="flex space-x-3">
              <a href="https://www.instagram.com/ichwan_ardi22/" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800/70 hover:bg-slate-700 rounded-lg transition-all duration-200 hover:scale-105">
                <Instagram className="w-5 h-5 text-slate-300 hover:text-white transition-colors" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800/70 hover:bg-slate-700 rounded-lg transition-all duration-200 hover:scale-105">
                <X className="w-5 h-5 text-slate-300 hover:text-white transition-colors" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800/70 hover:bg-slate-700 rounded-lg transition-all duration-200 hover:scale-105">
                <Github className="w-5 h-5 text-slate-300 hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Backdrop */}
      {isMenuOpen && <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-400" onClick={() => setIsMenuOpen(false)} />}
    </>
  );
}

export default Navbar;
