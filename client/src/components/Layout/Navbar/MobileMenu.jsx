import { NavLink } from 'react-router-dom';
import { Instagram, X, Github } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { NAVIGATION_LINKS, TEXTS } from '../../../utils/constants';

const MobileMenu = ({ isOpen, onClose }) => {
  const { language } = useApp();
  const navLinks = NAVIGATION_LINKS[language];
  const t = TEXTS[language];

  // Prevent event bubbling when clicking inside menu
  const handleMenuClick = (e) => {
    e.stopPropagation();
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  // Handle close button click
  const handleCloseClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <>
      {/* Mobile Menu */}
      <div
        className={`mobile-menu lg:hidden fixed top-0 right-0 h-screen w-80 bg-black/95 backdrop-blur-md shadow-2xl z-50 transition-all duration-500 ease-out border-l border-gray-800/30 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={handleMenuClick}
      >
        <div className="p-6 pt-20 h-full overflow-y-auto">
          {/* Close Button */}
          <button onClick={handleCloseClick} className="absolute top-6 right-6 p-2 hover:bg-gray-800/50 rounded-lg transition-all duration-300 group hover:rotate-90 hover:scale-110" type="button" aria-label="Close menu">
            <div className="w-5 h-5 relative">
              <span className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-gray-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 rotate-45 group-hover:bg-yellow-400 transition-all duration-300 group-hover:scale-110" />
              <span className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-gray-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 -rotate-45 group-hover:bg-yellow-400 transition-all duration-300 group-hover:scale-110" />
            </div>
          </button>

          {/* Menu Title */}
          <div className={`mb-8 transform transition-all duration-700 delay-100 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h2 className="text-xl font-semibold text-white">{t.navigation}</h2>
            <div className={`h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 mt-2 transition-all duration-1000 delay-300 ${isOpen ? 'w-12' : 'w-0'}`} />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-3 mb-12">
            {navLinks.map((link, index) => (
              <div key={link.name} className={`transform transition-all duration-500 ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`} style={{ transitionDelay: `${200 + index * 100}ms` }}>
                <NavLink
                  to={link.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block group py-4 px-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                      isActive ? 'bg-gradient-to-r from-gray-800/70 to-gray-900/70 text-yellow-400 shadow-lg border border-yellow-400/30' : 'text-gray-300 hover:bg-gray-800/40 hover:shadow-md hover:text-white'
                    }`
                  }
                >
                  {/* Background slide effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />

                  <span className="text-lg font-medium inline-block group-hover:translate-x-2 transition-all duration-300 relative z-10 group-hover:text-yellow-400">{link.name}</span>

                  {/* Hover indicator */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full shadow-sm shadow-yellow-400/50" />
                  </div>
                </NavLink>
              </div>
            ))}
          </nav>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-8" />

          {/* Social Links */}
          <div className={`space-y-4 transform transition-all duration-700 delay-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
            <p className="text-gray-400 text-sm font-medium">{t.connectWithMe}</p>
            <div className="flex space-x-4">
              {[
                { icon: Instagram, href: 'https://www.instagram.com/ichwan_ardi22', delay: '600ms' },
                { icon: X, href: 'https://x.com/IchwanArdi22', delay: '700ms' },
                { icon: Github, href: 'https://github.com/IchwanArdi', delay: '800ms' },
              ].map((social, index) => (
                <div key={index} className={`transform transition-all duration-500 ${isOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-180 opacity-0'}`} style={{ transitionDelay: social.delay }}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-3 rounded-xl bg-gray-900/30 border border-gray-800/50 transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:border-yellow-400/30"
                  >
                    {/* Background glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <social.icon className="w-5 h-5 text-gray-300 group-hover:text-yellow-400 transition-all duration-300 relative z-10 group-hover:scale-110" />

                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-xl bg-yellow-400/5 transform scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Backdrop */}
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-all duration-500 animate-in fade-in" onClick={handleBackdropClick} />}
    </>
  );
};

export default MobileMenu;
