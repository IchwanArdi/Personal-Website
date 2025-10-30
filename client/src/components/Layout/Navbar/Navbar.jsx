import { Settings } from 'lucide-react';
import { useState, useRef, useMemo, useCallback, memo } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { NAVIGATION_LINKS } from '../../../utils/constants';
import SettingsDropdown from './SettingsDropdown';
import MobileMenu from './MobileMenu';

import logo from '../../../assets/logo.webp';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { isDarkMode, language } = useApp();
  const { isAuthenticated } = useAuth();

  const settingsRef = useRef();
  const mobileMenuRef = useRef();

  // Memoize navigation links untuk mencegah re-computation
  const navLinks = useMemo(() => NAVIGATION_LINKS[language], [language]);

  // Memoize class names untuk header
  const headerClasses = useMemo(() => `w-full fixed top-0 z-20 backdrop-blur-md border-b transition-all duration-300 ${isDarkMode ? 'bg-black border-slate-800/50' : 'bg-white border-slate-200 shadow-md'}`, [isDarkMode]);

  // Memoize class names untuk mobile logo
  const logoClasses = useMemo(() => `text-xl font-bold transition-all duration-300 transform hover:scale-105 ${isDarkMode ? 'text-white hover:text-yellow-400' : 'text-slate-800 hover:text-yellow-600'}`, [isDarkMode]);

  // Optimized event handlers dengan useCallback
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen(!isMenuOpen), [isMenuOpen]);
  const toggleSettings = useCallback(() => setIsSettingsOpen(!isSettingsOpen), [isSettingsOpen]);

  // Close menus when clicking outside
  useClickOutside(settingsRef, closeSettings, isSettingsOpen);
  useClickOutside(mobileMenuRef, closeMenu, isMenuOpen);

  return (
    <>
      <header className={headerClasses}>
        <div className="max-w-7xl mx-auto px-6 md:px-0">
          <div className="flex items-center justify-between h-20">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              {navLinks.map((link, index) => (
                <div key={link.name} className="relative group" style={{ animationDelay: `${index * 100}ms` }}>
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      `relative text-sm font-semibold transition-all duration-300 px-2 py-2 rounded-lg ${
                        isDarkMode ? (isActive ? 'text-yellow-400' : 'text-slate-200 hover:text-yellow-400 hover:bg-slate-800/30') : isActive ? 'text-yellow-600' : 'text-black hover:text-yellow-600 hover:bg-slate-100'
                      }`
                    }
                  >
                    {link.name}
                    {/* Animated underline - Optimized */}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 rounded-full transition-all duration-300 transform -translate-x-1/2 group-hover:w-full bg-gradient-to-r from-yellow-400 to-yellow-600" />
                  </NavLink>
                </div>
              ))}
            </nav>

            {/* Mobile Logo */}
            <div className="lg:hidden">
              <Link to="/" className={logoClasses}>
                <img src={logo} alt="Logo" className={`w-20 transition-all ${!isDarkMode ? 'invert' : ''}`} />
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {isAuthenticated && (
                <Link
                  to="/dashboard/projects"
                  className={`hidden lg:inline-block px-3 py-2 rounded text-sm font-semibold ${isDarkMode ? 'text-slate-200 hover:text-yellow-400 hover:bg-slate-800/30' : 'text-black hover:text-yellow-600 hover:bg-slate-100'}`}
                >
                  Dashboard
                </Link>
              )}
              {/* Settings Toggle */}
              <div className="relative" ref={settingsRef}>
                <button
                  className={`settings-toggle relative p-3 group rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-200'}`}
                  onClick={toggleSettings}
                  type="button"
                  aria-label="Settings"
                >
                  {/* Background pulse effect - Simplified */}
                  <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${isSettingsOpen ? (isDarkMode ? 'bg-slate-700/30 scale-100 opacity-100' : 'bg-yellow-100 scale-100 opacity-100') : 'scale-0 opacity-0'}`} />

                  {/* Rotating background - Optimized */}
                  <div
                    className={`absolute inset-0 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                      isDarkMode ? 'bg-gradient-to-br from-slate-700/30 to-slate-800/30' : 'bg-gradient-to-br from-yellow-100 to-yellow-200'
                    }`}
                  />

                  <div className="relative w-5 h-5">
                    <Settings
                      className={`w-5 h-5 transition-all duration-500 ease-out ${
                        isSettingsOpen
                          ? isDarkMode
                            ? 'rotate-180 text-yellow-400 scale-110'
                            : 'rotate-180 text-yellow-600 scale-110'
                          : isDarkMode
                          ? 'text-slate-300 group-hover:rotate-90 group-hover:text-slate-100 group-hover:scale-105'
                          : 'text-slate-700 group-hover:rotate-90 group-hover:text-yellow-600 group-hover:scale-105'
                      }`}
                    />
                  </div>
                </button>
                <SettingsDropdown isOpen={isSettingsOpen} onClose={closeSettings} />
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className={`menu-toggle lg:hidden relative p-3 group rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-200'}`}
                onClick={toggleMenu}
                type="button"
                aria-label="Menu"
              >
                {/* Background effect */}
                <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${isMenuOpen ? (isDarkMode ? 'bg-slate-700/30 scale-100 opacity-100' : 'bg-yellow-100 scale-100 opacity-100') : 'scale-0 opacity-0'}`} />

                {/* Hamburger lines container */}
                <div className="relative w-5 h-5 flex flex-col justify-center items-center">
                  {/* Top line */}
                  <span
                    className={`absolute w-5 h-0.5 rounded-full transition-all duration-500 ease-out transform ${
                      isMenuOpen
                        ? isDarkMode
                          ? 'rotate-45 translate-y-0 bg-yellow-400 scale-110'
                          : 'rotate-45 translate-y-0 bg-yellow-600 scale-110'
                        : isDarkMode
                        ? '-translate-y-1.5 bg-slate-300 group-hover:bg-slate-100 group-hover:w-4 group-hover:translate-x-0.5'
                        : '-translate-y-1.5 bg-slate-700 group-hover:bg-yellow-600 group-hover:w-4 group-hover:translate-x-0.5'
                    }`}
                  />
                  {/* Middle line */}
                  <span
                    className={`absolute w-3 h-0.5 rounded-full transition-all duration-300 ${
                      isMenuOpen
                        ? 'opacity-0 scale-x-0 rotate-180'
                        : isDarkMode
                        ? 'opacity-100 scale-x-100 bg-slate-300 group-hover:bg-slate-100 group-hover:w-3 group-hover:translate-x-1'
                        : 'opacity-100 scale-x-100 bg-slate-700 group-hover:bg-yellow-600 group-hover:w-3 group-hover:translate-x-1'
                    }`}
                  />
                  {/* Bottom line */}
                  <span
                    className={`absolute w-5 h-0.5 rounded-full transition-all duration-500 ease-out transform ${
                      isMenuOpen
                        ? isDarkMode
                          ? '-rotate-45 translate-y-0 bg-yellow-400 scale-110'
                          : '-rotate-45 translate-y-0 bg-yellow-600 scale-110'
                        : isDarkMode
                        ? 'translate-y-1.5 bg-slate-300 group-hover:bg-slate-100 group-hover:w-4 group-hover:translate-x-0.5'
                        : 'translate-y-1.5 bg-slate-700 group-hover:bg-yellow-600 group-hover:w-4 group-hover:translate-x-0.5'
                    }`}
                  />
                </div>

                {/* Ripple effect - Simplified */}
                <div className={`absolute inset-0 rounded-lg transition-all duration-500 ${isMenuOpen ? (isDarkMode ? 'bg-white/10 scale-150 opacity-0' : 'bg-yellow-100 scale-150 opacity-0') : 'scale-0 opacity-100'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  );
};

export default memo(Navbar);
