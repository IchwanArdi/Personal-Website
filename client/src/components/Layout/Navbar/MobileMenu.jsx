import { NavLink } from 'react-router-dom';
import { Instagram, X, Github } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { NAVIGATION_LINKS, TEXTS } from '../../../utils/constants';

const MobileMenu = ({ isOpen, onClose }) => {
  const { language } = useApp();
  const navLinks = NAVIGATION_LINKS[language];
  const t = TEXTS[language];

  return (
    <>
      {/* Mobile Menu */}
      <div className={`mobile-menu lg:hidden fixed top-0 right-0 h-screen w-80 bg-slate-900/95 backdrop-blur-md shadow-2xl z-40 transition-all duration-400 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 pt-20">
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-800/50 rounded-lg transition-colors group">
            <div className="w-5 h-5 relative">
              <span className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-slate-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 rotate-45 group-hover:bg-white transition-colors" />
              <span className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-slate-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 -rotate-45 group-hover:bg-white transition-colors" />
            </div>
          </button>

          {/* Menu Title */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white">{t.navigation}</h2>
            <div className="w-8 h-0.5 bg-slate-400 mt-2" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 mb-12">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={onClose}
                className={({ isActive }) => `block group py-3 px-4 rounded-lg transition-all duration-200 ${isActive ? 'bg-slate-800 text-slate-50' : 'text-slate-400 hover:bg-slate-800/50'}`}
              >
                <span className="text-lg font-medium inline-block group-hover:translate-x-1 transition-all duration-200">{link.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Social Links */}
          <div className="space-y-4">
            <p className="text-slate-400 text-sm font-medium">{t.connectWithMe}</p>
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

      {/* Backdrop */}
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-400" onClick={onClose} />}
    </>
  );
};

export default MobileMenu;
