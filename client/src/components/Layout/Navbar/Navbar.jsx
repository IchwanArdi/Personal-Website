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
      <header className="w-full sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-24">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink key={link.name} to={link.href} className={({ isActive }) => `text-sm font-semibold transition-colors duration-200 ${isActive ? 'text-blue-400' : 'text-slate-200 hover:text-blue-400'}`}>
                  {link.name}
                </NavLink>
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
              {/* Settings Toggle */}
              <div className="relative" ref={settingsRef}>
                <button className="settings-toggle relative p-3 group" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                  <div className="relative w-5 h-5">
                    <Settings className={`w-5 h-5 text-slate-300 transition-all duration-300 ${isSettingsOpen ? 'rotate-90 text-white' : 'group-hover:rotate-45 group-hover:text-slate-200'}`} />
                  </div>
                </button>

                <SettingsDropdown isOpen={isSettingsOpen} onClose={closeSettings} />
              </div>

              {/* Mobile Menu Toggle */}
              <button className="menu-toggle lg:hidden relative p-3 group" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <div className="relative w-5 h-5">
                  <span className={`absolute top-1 left-0 w-5 h-0.5 bg-slate-300 rounded-full transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-46 translate-y-1.5' : 'group-hover:w-4'}`} />
                  <span
                    className={`absolute top-1/2 left-0 w-5 h-0.5 bg-slate-300 rounded-full transition-all duration-300 transform -translate-y-1/2 ${isMenuOpen ? 'opacity-0 scale-x-0' : 'group-hover:w-3 group-hover:translate-x-0.5'}`}
                  />
                  <span className={`absolute bottom-1 left-0 w-5 h-0.5 bg-slate-300 rounded-full transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'group-hover:w-4'}`} />
                </div>
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
