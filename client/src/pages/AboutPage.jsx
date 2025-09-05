import { useState, useEffect } from 'react';
import { Code, Heart, Lightbulb, Target, Rocket, Star, MapPin, Calendar, Zap, BookOpen, Users, Github } from 'lucide-react';
import SEO from '../components/SEO';
import CVFile from '../assets/cv/Ichwan_Ardianto_Resume.pdf';
import { ABOUT } from '../utils/constants';
import { useApp } from '../contexts/AppContext';

function AboutPage() {
  const { language } = useApp();
  const t = ABOUT[language];

  const [currentFact, setCurrentFact] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = CVFile;
    link.download = 'Ichwan_Ardianto_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Tech stack dengan kategori untuk tampilan yang lebih terorganisir
  const techCategories = {
    [t.frontend]: [
      { name: 'React', color: '#61DAFB', bgColor: 'bg-cyan-400' },
      { name: 'Next.js', color: '#000000', bgColor: 'bg-gray-900' },
      { name: 'TypeScript', color: '#3178C6', bgColor: 'bg-blue-600' },
      { name: 'Tailwind', color: '#06B6D4', bgColor: 'bg-cyan-500' },
      { name: 'JavaScript', color: '#F7DF1E', bgColor: 'bg-yellow-400' },
    ],
    [t.backend]: [
      { name: 'Node.js', color: '#339933', bgColor: 'bg-green-500' },
      { name: 'Express', color: '#000000', bgColor: 'bg-gray-800' },
      { name: 'Socket.io', color: '#010101', bgColor: 'bg-gray-700' },
    ],
    [t.database]: [
      { name: 'MongoDB', color: '#47A248', bgColor: 'bg-green-600' },
      { name: 'MySQL', color: '#4479A1', bgColor: 'bg-blue-700' },
      { name: 'Firebase', color: '#FFCA28', bgColor: 'bg-yellow-500' },
    ],
    [t.tools]: [
      { name: 'Git', color: '#F05032', bgColor: 'bg-orange-500' },
      { name: 'VS Code', color: '#007ACC', bgColor: 'bg-blue-600' },
      { name: 'Postman', color: '#FF6C37', bgColor: 'bg-orange-600' },
    ],
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % t.funFacts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [t.funFacts.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <SEO pageKey="about" />
      {/* Hero Section - More Personal */}
      <div className="relative pt-10 ">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              {t.heroTitle} <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{t.heroName}</span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t.heroDescription} <span className="text-yellow-400 font-semibold">{t.heroPassionate}</span> {t.heroAbout}
              <span className="text-yellow-400 font-semibold"> {t.heroFullStack}</span>
              {t.heroLikes}
              <span className="text-yellow-400 font-semibold"> {t.heroEnjoyable}</span>! ✨
            </p>

            {/* Fun Facts Rotator */}
            <div className="bg-gray-900/70 md:bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20 max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">{t.funFactTitle}</span>
              </div>
              <p className="text-lg font-medium transition-all duration-500">{t.funFacts[currentFact]}</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-400">
              <MapPin className="w-6 h-6 md:w-4 md:h-4" />
              <span>{t.location}</span>
              <span className="mx-2">•</span>
              <Calendar className="w-6 h-6  md:w-4 md:h-4" />
              <span>{t.availability}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tech Stack Section */}
      <div className="relative py-16 max-w-7xl mx-auto">
        <div className="mb-12 px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">
            {t.techStackTitle} <span className="text-yellow-400">{t.techStackArsenal}</span> {t.techStackSubtitle}
          </h2>
          <p className="text-center text-gray-400 max-w-2xl mx-auto">{t.techStackDescription}</p>
        </div>

        <div className="space-y-8">
          {Object.entries(techCategories).map(([category, techs], categoryIndex) => (
            <div key={category} className="relative overflow-hidden">
              <div className="mb-4 px-6">
                <h3 className="text-lg font-semibold text-gray-300 capitalize flex items-center gap-2">
                  {category === t.frontend && <Code className="w-5 h-5 text-cyan-400" />}
                  {category === t.backend && <Rocket className="w-5 h-5 text-green-400" />}
                  {category === t.database && <BookOpen className="w-5 h-5 text-blue-400" />}
                  {category === t.tools && <Star className="w-5 h-5 text-orange-400" />}
                  {category}
                </h3>
              </div>

              {/* Smooth sliding animation */}
              <div className="relative h-16 overflow-hidden">
                {/* Gradient overlays */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-10"></div>

                <div
                  className="flex animate-pulse"
                  style={{
                    animation: `slide-${categoryIndex % 2 === 0 ? 'right' : 'left'} ${15 + categoryIndex * 2}s linear infinite`,
                  }}
                >
                  {/* Duplicate for seamless loop */}
                  {[...Array(3)].map((_, repeatIndex) =>
                    techs.map((tech, techIndex) => (
                      <div
                        key={`${repeatIndex}-${techIndex}`}
                        className="flex-shrink-0 mx-3 flex items-center gap-3 bg-gray-800/60 backdrop-blur-sm rounded-xl px-6 py-3 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 shadow-lg"
                      >
                        <div className={`w-3 h-3 rounded-full ${tech.bgColor} shadow-md`}></div>
                        <span className="text-white font-medium whitespace-nowrap">{tech.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Story Section */}
      <div className="max-w-6xl mx-auto px-6 mb-20" data-animate id="story">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">
          {t.journeyTitle} <span className="text-yellow-400">{t.journeyHighlight}</span> {t.journeySoFar}
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">{t.journeyDescription}</p>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-yellow-400 to-orange-400 hidden lg:block"></div>

          <div className="space-y-8 lg:space-y-16">
            {t.journeyItems.map((item, index) => {
              const iconComponents = [BookOpen, Code, Rocket, Target];
              const Icon = iconComponents[index] || BookOpen;
              const colors = ['from-blue-500 to-cyan-500', 'from-green-500 to-emerald-500', 'from-purple-500 to-pink-500', 'from-yellow-500 to-orange-500'];
              const isLeft = index % 2 === 0;

              return (
                <div key={index} className={`flex items-center gap-8 ${!isLeft && 'lg:flex-row-reverse'}`} data-animate id={`journey-${index}`}>
                  {/* Content */}
                  <div className={`flex-1 ${!isLeft && 'lg:text-right'}`}>
                    <div
                      className={`bg-gray-900/70 md:bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20 hover:border-yellow-400/30 transition-all duration-500 ${
                        isVisible[`journey-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${colors[index]} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl font-bold">{item.year}</span>
                          <h3 className="text-lg font-semibold text-yellow-400">{item.title}</h3>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:block relative">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full border-4 border-black"></div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Personality Section */}
      <div className="max-w-6xl mx-auto px-6 mb-20" data-animate id="personality">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">
          {t.personalityTitle} <span className="text-yellow-400">{t.personalityTick}</span>
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">{t.personalityDescription}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.personalityTraits.map((item, index) => {
            const iconComponents = [Lightbulb, Users, BookOpen, Star];
            const Icon = iconComponents[index] || Lightbulb;
            return (
              <div
                key={index}
                className={`group bg-gray-900/70 md:bg-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/20 hover:border-yellow-400/30 transition-all duration-500 hover:scale-105 ${
                  isVisible.personality ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-yellow-400 transition-colors">{item.trait}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Focus Section */}
      <div className="max-w-4xl mx-auto px-6 mb-20" data-animate id="focus">
        <div className="bg-gray-900/70 md:bg-gray-900/30 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-gray-700/20">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t.currentFocusTitle} <span className="text-yellow-400">{t.currentFocusFocusing}</span> {t.currentFocusOn}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.focusItems.map((item, index) => {
              const iconComponents = [Code, Rocket, Heart];
              const Icon = iconComponents[index] || Code;
              const gradients = ['from-blue-500 to-cyan-500', 'from-green-500 to-emerald-500', 'from-purple-500 to-pink-500'];

              return (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${gradients[index]} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fun Stats */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {t.funStats.map((stat, index) => (
            <div key={index} className="bg-gray-900/70 md:bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-700/20 hover:border-yellow-400/30 transition-all duration-300">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 pb-20 text-center">
        <div className="bg-gradient-to-br from-yellow-400/10 to-orange-400/10 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-yellow-400/20">
          <h2 className="text-3xl font-bold mb-4">
            {t.ctaTitle} <span className="text-yellow-400">{t.ctaAmazing}</span> {t.ctaTogether}
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">{t.ctaDescription}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:ichwanpwt22@gmail.com" className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105">
              <Heart className="w-5 h-5" />
              {t.ctaLetsTalk}
            </a>
            <a
              href="https://github.com/IchwanArdi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            >
              <Github className="w-5 h-5" />
              {t.ctaCheckWork}
            </a>
            <button onClick={handleDownload} className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-xl font-medium transition-all duration-300 cursor-pointer hover:scale-105">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t.ctaDownloadCV}
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx="true">{`
        @keyframes slide-right {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100vw);
          }
        }

        @keyframes slide-left {
          from {
            transform: translateX(100vw);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}

export default AboutPage;
