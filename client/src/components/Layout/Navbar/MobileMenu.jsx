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
      <div className={`mobile-menu lg:hidden fixed top-0 right-0 h-screen w-80 bg-slate-900/95 backdrop-blur-md shadow-2xl z-40 transition-all duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 pt-25">
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-800/50 rounded-lg transition-all duration-300 group hover:rotate-90 hover:scale-110">
            <div className="w-5 h-5 relative">
              <span className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-slate-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 rotate-45 group-hover:bg-white transition-all duration-300 group-hover:scale-110" />
              <span className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-slate-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 -rotate-45 group-hover:bg-white transition-all duration-300 group-hover:scale-110" />
            </div>
          </button>

          {/* Menu Title */}
          <div className={`mb-8 transform transition-all duration-700 delay-100 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h2 className="text-xl font-semibold text-white">{t.navigation}</h2>
            <div className={`h-0.5 bg-gradient-to-r from-slate-400 to-slate-600 mt-2 transition-all duration-1000 delay-300 ${isOpen ? 'w-8' : 'w-0'}`} />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 mb-12">
            {navLinks.map((link, index) => (
              <div key={link.name} className={`transform transition-all duration-500 ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`} style={{ transitionDelay: `${200 + index * 100}ms` }}>
                <NavLink
                  to={link.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block group py-3 px-4 rounded-lg transition-all duration-300 relative overflow-hidden ${isActive ? 'bg-slate-800 text-slate-50 shadow-lg' : 'text-slate-400 hover:bg-slate-800/50 hover:shadow-md'}`
                  }
                >
                  {/* Background slide effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-800 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />

                  <span className="text-lg font-medium inline-block group-hover:translate-x-2 transition-all duration-300 relative z-10 group-hover:text-white">{link.name}</span>

                  {/* Hover indicator */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <div className="w-1 h-6 bg-gradient-to-b from-slate-300 to-slate-500 rounded-full" />
                  </div>
                </NavLink>
              </div>
            ))}
          </nav>

          {/* Social Links */}
          <div className={`space-y-4 transform transition-all duration-700 delay-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
            <p className="text-slate-400 text-sm font-medium">{t.connectWithMe}</p>
            <div className="flex space-x-3">
              {[
                { icon: Instagram, href: 'https://www.instagram.com/ichwan_ardi22/', delay: '600ms' },
                { icon: X, href: '#', delay: '700ms' },
                { icon: Github, href: '#', delay: '800ms' },
              ].map((social, index) => (
                <div key={index} className={`transform transition-all duration-500 ${isOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-180 opacity-0'}`} style={{ transitionDelay: social.delay }}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className="group relative p-3 bg-slate-800/70 hover:bg-slate-700 rounded-lg transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg">
                    {/* Background glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-600/20 to-slate-800/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <social.icon className="w-5 h-5 text-slate-300 group-hover:text-white transition-all duration-300 relative z-10 group-hover:scale-110" />

                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-lg bg-white/10 transform scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative gradient line */}
        <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-slate-600 via-slate-500 to-slate-600 transition-all duration-1000 ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`} />
      </div>

      {/* Enhanced Backdrop */}
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-all duration-500 animate-in fade-in" onClick={onClose} />}
    </>
  );
};

export default MobileMenu;
