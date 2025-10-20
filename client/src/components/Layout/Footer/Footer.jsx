import { Instagram, X, Github, MapPin, Coffee, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { SOCIAL_LINKS, TEXTS } from '../../../utils/constants';
import { memo } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { language, isDarkMode } = useApp();
  const t = TEXTS[language];

  const iconComponents = {
    Instagram,
    X,
    Github,
  };

  return (
    <footer className={`relative w-full mt-auto ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
      <div className={`absolute top-0 left-0 w-full h-px opacity-50 ${isDarkMode ? 'bg-gradient-to-r from-transparent via-slate-700 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
          {/* Left section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="">
              <h3 className={`text-2xl font-light tracking-wide mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Ichwan Ardi</h3>
              <p className={`text-sm leading-relaxed font-light max-w-md ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{t.footerTagline}</p>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm border rounded-full ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-gray-200/80'}`}>
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t.openToOpportunities}</span>
            </div>
          </div>

          <div className="lg:col-span-2" />

          {/* Right section */}
          <div className="lg:col-span-5 space-y-6 ">
            <div className={`flex items-center gap-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-light">{t.location}</span>
            </div>

            <div className="space-y-3 w-fit">
              <p className={`text-xs uppercase tracking-wider font-medium mb-4 ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>{t.connect}</p>
              {SOCIAL_LINKS.map((social, index) => {
                const IconComponent = iconComponents[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-4 py-2 transition-all duration-300 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <IconComponent className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span className="text-sm font-light">{social.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`mt-16 pt-8 border-t ${isDarkMode ? 'border-slate-800/50' : 'border-gray-300/60'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className={`text-xs font-light ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
              © {currentYear} — {t.craftedWithIntention}
            </p>
            <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
              <Coffee className="w-3 h-3" />
              <span className="text-xs font-light">{t.poweredByCuriosity}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
