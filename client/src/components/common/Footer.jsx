import { Instagram, X, Github, MapPin, Coffee } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Instagram,
      href: 'https://www.instagram.com/ichwan_ardi22/',
      label: 'Instagram',
    },
    {
      icon: X,
      href: 'https://twitter.com/your-profile',
      label: 'Twitter',
    },
    {
      icon: Github,
      href: 'https://github.com/your-profile',
      label: 'GitHub',
    },
  ];

  return (
    <footer className="relative w-full bg-slate-950 border-t border-slate-800/30 mt-auto overflow-hidden">
      {/* Subtle background pattern - hide on mobile */}
      <div className="absolute inset-0 opacity-5 hidden md:block">
        <div className="absolute top-10 left-10 w-32 h-32 border border-slate-700 rounded-full"></div>
        <div className="absolute bottom-20 right-16 w-24 h-24 border border-slate-700 rounded-full"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 border border-slate-700 rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Mobile Layout */}
        <div className="block md:hidden space-y-6">
          {/* Mobile: Personal Brand */}
          <div className="text-center space-y-3">
            <h3 className="text-xl font-semibold text-white">Ichwan Ardi</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">Crafting digital experiences with passion and precision.</p>
          </div>

          {/* Mobile: Social Links */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-1 bg-slate-900/50 rounded-full p-2 border border-slate-800/50">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="p-3 hover:bg-slate-800 rounded-full transition-all duration-200 group" aria-label={`Visit ${social.label}`}>
                  <social.icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Mobile: Status & Location */}
          <div className="flex flex-col items-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">Available for work</span>
            </div>
            <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>Purwokerto, Indonesia</span>
              </div>
              <div className="flex items-center space-x-1">
                <Coffee className="w-3 h-3" />
                <span>Fueled by coffee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 items-start">
          {/* Desktop: Personal Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Ichwan Ardi</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Crafting digital experiences with passion and precision.</p>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <MapPin className="w-3 h-3" />
              <span>Purwokerto, Indonesia</span>
            </div>
          </div>

          {/* Desktop: Social Links */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-1 bg-slate-900/50 rounded-full p-2 border border-slate-800/50">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-800 rounded-full transition-all duration-200 group" aria-label={`Visit ${social.label}`}>
                  <social.icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Desktop: Status */}
          <div className="text-right space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">Available for work</span>
            </div>
            <div className="flex items-center justify-end space-x-2 text-xs text-slate-500">
              <Coffee className="w-3 h-3" />
              <span>Fueled by coffee</span>
            </div>
          </div>
        </div>

        {/* Bottom line - Responsive */}
        <div className="mt-8 sm:mt-12 pt-6 border-t border-slate-800/30">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 text-center sm:text-left">
            <p className="text-xs text-slate-500">© {currentYear} — Built with curiosity and late nights</p>
            <p className="text-xs text-slate-600">Version 2.0.1</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
