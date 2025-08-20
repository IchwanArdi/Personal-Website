import { Settings } from 'lucide-react';
import { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../../contexts/AppContext';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { NAVIGATION_LINKS } from '../../../utils/constants';
import SettingsDropdown from './SettingsDropdown';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { language } = useApp();

  const settingsRef = useRef();
  const mobileMenuRef = useRef();

  // Close menus when clicking outside
  useClickOutside(settingsRef, () => setIsSettingsOpen(false), isSettingsOpen);
  useClickOutside(mobileMenuRef, () => setIsMenuOpen(false), isMenuOpen);

  const navLinks = NAVIGATION_LINKS[language];

  const closeMenu = () => setIsMenuOpen(false);
  const closeSettings = () => setIsSettingsOpen(false);

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-24">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <div key={link.name} className="relative group" style={{ animationDelay: `${index * 100}ms` }}>
                  <NavLink
                    to={link.href}
                    className={({ isActive }) => `relative text-sm font-semibold transition-all duration-300 px-3 py-2 rounded-lg ${isActive ? 'text-yellow-400' : 'text-slate-200 hover:text-yellow-400 hover:bg-slate-800/30'}`}
                  >
                    {link.name}

                    {/* Animated underline */}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-300 transform -translate-x-1/2 group-hover:w-full" />
                  </NavLink>
                </div>
              ))}
            </nav>

            {/* Mobile Logo */}
            <div className="lg:hidden">
              <a href="/home" className="text-white text-xl font-bold hover:text-blue-400 transition-all duration-300 transform hover:scale-105">
                LOGO
              </a>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {/* Settings Toggle */}
              <div className="relative" ref={settingsRef}>
                <button className="settings-toggle relative p-3 group rounded-lg hover:bg-slate-800/50 transition-all duration-300 hover:scale-110" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                  {/* Background pulse effect */}
                  <div className={`absolute inset-0 rounded-lg bg-slate-700/30 transition-all duration-300 ${isSettingsOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />

                  {/* Rotating background */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-slate-700/30 to-slate-800/30 opacity-0 group-hover:opacity-100 transition-all duration-300" />

                  <div className="relative w-5 h-5">
                    <Settings className={`w-5 h-5 text-slate-300 transition-all duration-500 ease-out ${isSettingsOpen ? 'rotate-180 text-blue-400 scale-110' : 'group-hover:rotate-90 group-hover:text-slate-100 group-hover:scale-105'}`} />
                  </div>
                </button>

                <SettingsDropdown isOpen={isSettingsOpen} onClose={closeSettings} />
              </div>

              {/* Mobile Menu Toggle */}
              <button className="menu-toggle lg:hidden relative p-3 group rounded-lg hover:bg-slate-800/50 transition-all duration-300 hover:scale-110" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {/* Background effect */}
                <div className={`absolute inset-0 rounded-lg bg-slate-700/30 transition-all duration-300 ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />

                {/* Hamburger lines container */}
                <div className="relative w-5 h-5 flex flex-col justify-center items-center">
                  {/* Top line */}
                  <span
                    className={`absolute w-5 h-0.5 bg-slate-300 rounded-full transition-all duration-500 ease-out transform ${
                      isMenuOpen ? 'rotate-45 translate-y-0 bg-blue-400 scale-110' : '-translate-y-1.5 group-hover:bg-slate-100 group-hover:w-4 group-hover:translate-x-0.5'
                    }`}
                  />

                  {/* Middle line */}
                  <span
                    className={`absolute w-3 h-0.5 bg-slate-300 rounded-full transition-all duration-300 ${
                      isMenuOpen ? 'opacity-0 scale-x-0 rotate-180' : 'opacity-100 scale-x-100 group-hover:bg-slate-100 group-hover:w-3 group-hover:translate-x-1'
                    }`}
                  />

                  {/* Bottom line */}
                  <span
                    className={`absolute w-5 h-0.5 bg-slate-300 rounded-full transition-all duration-500 ease-out transform ${
                      isMenuOpen ? '-rotate-45 translate-y-0 bg-blue-400 scale-110' : 'translate-y-1.5 group-hover:bg-slate-100 group-hover:w-4 group-hover:translate-x-0.5'
                    }`}
                  />
                </div>

                {/* Ripple effect on click */}
                <div className={`absolute inset-0 rounded-lg bg-white/10 transition-all duration-500 ${isMenuOpen ? 'scale-150 opacity-0' : 'scale-0 opacity-100'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  );
};

export default Navbar;
