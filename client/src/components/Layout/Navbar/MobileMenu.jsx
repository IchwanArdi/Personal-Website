import { NavLink } from 'react-router-dom';
import { Instagram, X, Github } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { NAVIGATION_LINKS, TEXTS } from '../../../utils/constants';
import { useMemo, memo } from 'react';

const MobileMenu = ({ isOpen, onClose }) => {
  const { language, isDarkMode } = useApp();

  // Memoize computed values untuk mencegah re-computation yang tidak perlu
  const { navLinks, t, socialLinks } = useMemo(
    () => ({
      navLinks: NAVIGATION_LINKS[language],
      t: TEXTS[language],
      // Memindahkan social links ke useMemo untuk mencegah re-creation array setiap render
      socialLinks: [
        { icon: Instagram, href: 'https://www.instagram.com/ichwan_ardi22', delay: '600ms' },
        { icon: X, href: 'https://x.com/IchwanArdi22', delay: '700ms' },
        { icon: Github, href: 'https://github.com/IchwanArdi', delay: '800ms' },
      ],
    }),
    [language]
  );

  // Memoize class names untuk mengurangi string concatenation
  const menuClasses = useMemo(
    () =>
      `mobile-menu lg:hidden fixed top-0 right-0 h-screen w-80 backdrop-blur-md shadow-2xl z-50 transition-all duration-500 ease-out border-l ${isDarkMode ? 'bg-black/95 border-gray-800/30' : 'bg-white/95 border-gray-300/50'} ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`,
    [isDarkMode, isOpen]
  );

  const backdropClasses = useMemo(() => `lg:hidden fixed inset-0 backdrop-blur-sm z-40 transition-all duration-500 animate-in fade-in ${isDarkMode ? 'bg-black/70' : 'bg-gray-900/50'}`, [isDarkMode]);

  // Event handlers dengan useCallback untuk mencegah re-creation
  const handleMenuClick = (e) => e.stopPropagation();
  const handleBackdropClick = (e) => {
    e.stopPropagation();
    onClose();
  };
  const handleCloseClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <>
      {/* Mobile Menu */}
      <div className={menuClasses} onClick={handleMenuClick}>
        <div className="p-6 pt-20 h-full overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={handleCloseClick}
            className={`absolute top-6 right-6 p-2 rounded-lg transition-all duration-300 group hover:rotate-90 hover:scale-110 ${isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-200/70'}`}
            type="button"
            aria-label="Close menu"
          >
            <div className="w-5 h-5 relative">
              {/* Simplified X icon dengan spans yang lebih efisien */}
              <span
                className={`absolute top-1/2 left-1/2 w-4 h-0.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 rotate-45 group-hover:bg-yellow-400 transition-all duration-300 group-hover:scale-110 ${
                  isDarkMode ? 'bg-gray-300' : 'bg-gray-600'
                }`}
              />
              <span
                className={`absolute top-1/2 left-1/2 w-4 h-0.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 -rotate-45 group-hover:bg-yellow-400 transition-all duration-300 group-hover:scale-110 ${
                  isDarkMode ? 'bg-gray-300' : 'bg-gray-600'
                }`}
              />
            </div>
          </button>

          {/* Menu Title */}
          <div className={`mb-8 transform transition-all duration-700 delay-100 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.navigation}</h2>
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
                      isActive
                        ? isDarkMode
                          ? 'bg-gradient-to-r from-gray-800/70 to-gray-900/70 text-yellow-400 shadow-lg border border-yellow-400/30'
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-yellow-600 shadow-lg border border-yellow-500/40'
                        : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800/40 hover:shadow-md hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100/60 hover:shadow-md hover:text-gray-900'
                    }`
                  }
                >
                  {/* Background slide effect - Optimized */}
                  <div
                    className={`absolute inset-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out ${
                      isDarkMode ? 'bg-gradient-to-r from-yellow-400/10 to-yellow-600/10' : 'bg-gradient-to-r from-yellow-400/15 to-yellow-600/15'
                    }`}
                  />

                  <span className={`text-lg font-medium inline-block group-hover:translate-x-2 transition-all duration-300 relative z-10 ${isDarkMode ? 'group-hover:text-yellow-400' : 'group-hover:text-yellow-600'}`}>{link.name}</span>

                  {/* Hover indicator */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full shadow-sm shadow-yellow-400/50" />
                  </div>
                </NavLink>
              </div>
            ))}
          </nav>

          {/* Divider - Simplified */}
          <div className={`w-full h-px mb-8 ${isDarkMode ? 'bg-gradient-to-r from-transparent via-gray-800 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`} />

          {/* Social Links */}
          <div className={`space-y-4 transform transition-all duration-700 delay-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.connectWithMe}</p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <div key={index} className={`transform transition-all duration-500 ${isOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-180 opacity-0'}`} style={{ transitionDelay: social.delay }}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:border-yellow-400/30 ${
                      isDarkMode ? 'bg-gray-900/30 border border-gray-800/50' : 'bg-gray-100/40 border border-gray-300/60 hover:border-yellow-500/40'
                    }`}
                  >
                    {/* Background glow effect */}
                    <div
                      className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        isDarkMode ? 'bg-gradient-to-br from-yellow-400/10 to-yellow-600/10' : 'bg-gradient-to-br from-yellow-400/15 to-yellow-600/15'
                      }`}
                    />

                    <social.icon className={`w-5 h-5 transition-all duration-300 relative z-10 group-hover:scale-110 ${isDarkMode ? 'text-gray-300 group-hover:text-yellow-400' : 'text-gray-600 group-hover:text-yellow-600'}`} />

                    {/* Ripple effect */}
                    <div className={`absolute inset-0 rounded-xl transform scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500 ${isDarkMode ? 'bg-yellow-400/5' : 'bg-yellow-400/10'}`} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Backdrop */}
      {isOpen && <div className={backdropClasses} onClick={handleBackdropClick} />}
    </>
  );
};

export default memo(MobileMenu);
