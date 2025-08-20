import React, { useState, useEffect } from 'react';
import { Coffee, Code, Music, Heart, Lightbulb, Target, Rocket, Star, MapPin, Calendar, Zap, BookOpen, Users, Github } from 'lucide-react';

function AboutPage() {
  const [currentFact, setCurrentFact] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const funFacts = [
    '🚀 Sudah coding 10+ project web dalam 1+ tahun',
    '☕ Tidak bisa hidup tanpa kopi saat coding',
    '🌙 Night owl - most productive jam 10 malam ke atas',
    '🎯 Goal 2025: Mastering Next.js & TypeScript',
    '💡 Always excited tentang tech baru!',
  ];

  const journey = [
    {
      year: '2022',
      title: 'Started My Journey',
      desc: 'Mulai kuliah di Universitas Amikom Purwokerto. First time touching React - it was love at first component! 💕',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      year: '2023',
      title: 'Deep Dive into Full Stack',
      desc: "Belajar MERN Stack secara intensif. Bikin project pertama yang 'wow, gue bisa bikin ini!' moment 🤯",
      icon: Code,
      color: 'from-green-500 to-emerald-500',
    },
    {
      year: '2024',
      title: 'Real Projects Era',
      desc: 'Mulai handle project real seperti e-commerce, chat app dengan enkripsi, sampai layanan desa digital 🔥',
      icon: Rocket,
      color: 'from-purple-500 to-pink-500',
    },
    {
      year: '2025',
      title: 'Next Level Goals',
      desc: 'Fokus ke advanced concepts, performance optimization, dan exploring new frameworks! 🎯',
      icon: Target,
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const personalityTraits = [
    {
      trait: 'Problem Solver',
      desc: 'Love banget sama challenge coding yang bikin mikir keras. Debugging sampe jam 3 pagi? No problem! 🕐',
      icon: Lightbulb,
    },
    {
      trait: 'Team Player',
      desc: 'Kerja bareng tim itu seru! Sharing knowledge dan belajar dari orang lain adalah passion gue 🤝',
      icon: Users,
    },
    {
      trait: 'Always Learning',
      desc: 'Tech berkembang cepet banget, makanya gue selalu update dengan trend terbaru. FOMO sama tech baru! 📚',
      icon: BookOpen,
    },
    {
      trait: 'Detail Oriented',
      desc: "Pixel perfect UI dan clean code adalah obsesi. Kalau ada yang 'agak-agak' pasti ganggu banget 😅",
      icon: Star,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-slate-950/90 text-white overflow-hidden">
      {/* Hero Section - More Personal */}
      <div className="relative pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              Hi, I'm <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Ichwan!</span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Mahasiswa IT yang <span className="text-yellow-400 font-semibold">passionate</span> banget sama
              <span className="text-yellow-400 font-semibold"> full stack development</span>. Suka banget bikin aplikasi web yang tidak cuma berfungsi, tapi juga
              <span className="text-yellow-400 font-semibold"> enak dipake</span>! ✨
            </p>

            {/* Fun Facts Rotator */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20 max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Fun Fact</span>
              </div>
              <p className="text-lg font-medium transition-all duration-500">{funFacts[currentFact]}</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Purwokerto, Central Java</span>
              <span className="mx-2">•</span>
              <Calendar className="w-4 h-4" />
              <span>Available for remote work</span>
            </div>
          </div>
        </div>
      </div>

      {/* My Story Section */}
      <div className="max-w-6xl mx-auto px-6 mb-20" data-animate id="story">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">
          My <span className="text-yellow-400">Journey</span> So Far
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Dari yang awalnya cuma tau HTML-CSS basic, sekarang udah bisa bikin full stack app. Here's the story! 📖</p>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-yellow-400 to-orange-400 hidden lg:block"></div>

          <div className="space-y-8 lg:space-y-16">
            {journey.map((item, index) => {
              const Icon = item.icon;
              const isLeft = index % 2 === 0;

              return (
                <div key={index} className={`flex items-center gap-8 ${!isLeft && 'lg:flex-row-reverse'}`} data-animate id={`journey-${index}`}>
                  {/* Content */}
                  <div className={`flex-1 ${!isLeft && 'lg:text-right'}`}>
                    <div
                      className={`bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20 hover:border-yellow-400/30 transition-all duration-500 ${
                        isVisible[`journey-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center`}>
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
          What Makes Me <span className="text-yellow-400">Tick</span>
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Lebih dari sekedar coding skill, ini yang bikin gue passionate sama development 🔥</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {personalityTraits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`group bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/20 hover:border-yellow-400/30 transition-all duration-500 hover:scale-105 ${
                  isVisible.personality ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-gray-700/20">
          <h2 className="text-3xl font-bold text-center mb-8">
            Currently <span className="text-yellow-400">Focusing</span> On
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Advanced React</h3>
              <p className="text-gray-400 text-sm">Next.js, TypeScript, performance optimization</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">System Design</h3>
              <p className="text-gray-400 text-sm">Scalable architecture, microservices</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">User Experience</h3>
              <p className="text-gray-400 text-sm">Clean design, smooth interactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fun Stats */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: '10+', label: 'Projects Built', icon: '🚀' },
            { number: '1+', label: 'Years Coding', icon: '⏰' },
            { number: '∞', label: 'Cups of Coffee', icon: '☕' },
            { number: '24/7', label: 'Learning Mode', icon: '🧠' },
          ].map((stat, index) => (
            <div key={index} className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-700/20 hover:border-yellow-400/30 transition-all duration-300">
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
            Let's Build Something <span className="text-yellow-400">Amazing</span> Together!
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Punya ide project yang keren? Or just want to chat about tech? I'm always excited to connect with fellow developers and collaborate on cool stuff! 🤝</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:ichwanpwt22@gmail.com" className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105">
              <Heart className="w-5 h-5" />
              Let's Talk!
            </a>
            <a
              href="https://github.com/IchwanArdi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            >
              <Github className="w-5 h-5" />
              Check My Work
            </a>
            <button className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500 px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download CV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
