import { Instagram, X, Github, MapPin, Coffee, ArrowUpRight } from 'lucide-react';

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
      label: 'X',
    },
    {
      icon: Github,
      href: 'https://github.com/your-profile',
      label: 'GitHub',
    },
  ];

  return (
    <footer className="relative w-full  mt-auto">
      {/* Minimal geometric accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-50"></div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left section - Name & tagline */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h3 className="text-2xl font-light text-white tracking-wide mb-3">Ichwan Ardi</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light max-w-md">Digital craftsman focused on creating meaningful experiences through thoughtful design and code.</p>
            </div>

            {/* Status indicator */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-300 font-medium">Open to opportunities</span>
            </div>
          </div>

          {/* Center spacer */}
          <div className="lg:col-span-2"></div>

          {/* Right section - Contact & social */}
          <div className="lg:col-span-5 space-y-6">
            {/* Location */}
            <div className="flex items-center gap-3 text-slate-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-light">Purwokerto, Central Java</span>
            </div>

            {/* Social links - vertical layout */}
            <div className="space-y-3 w-fit">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-4">Connect</p>
              {socialLinks.map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 py-2 text-slate-400 hover:text-white transition-all duration-300"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <social.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span className="text-sm font-light">{social.label}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-slate-800/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500 font-light">© {currentYear} — Crafted with intention</p>
            <div className="flex items-center gap-2 text-slate-500">
              <Coffee className="w-3 h-3" />
              <span className="text-xs font-light">Powered by curiosity</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
