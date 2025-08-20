import React, { useState } from 'react';
import { Calendar, ExternalLink } from 'lucide-react';

// Mock images - ganti dengan import img1, img2, img3 Anda
const images = {
  img1: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
  img2: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
  img3: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
};

const contentSections = [
  {
    bgImage: images.img1,
    mainImage: images.img1,
    tag: 'Latest Project',
    date: '5/20/25',
    title: 'Ini Project Terbaru',
    link: '#',
  },
  {
    bgImage: images.img2,
    mainImage: images.img2,
    tag: 'Latest Blogs',
    date: '5/20/25',
    title: 'Ini Blog Terbaru',
    link: '#',
  },
  {
    bgImage: images.img3,
    mainImage: images.img3,
    tag: 'Latest Update',
    date: '5/20/25',
    title: 'Tentang Saya',
    link: '#',
  },
];

function HomePage() {
  const [hoveredSection, setHoveredSection] = useState(null);

  return (
    <div className="w-full mx-auto bg-slate-950/90">
      {contentSections.map((section, index) => (
        <div
          key={index}
          className="relative w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[500px] flex items-center justify-center overflow-hidden group"
          onMouseEnter={() => setHoveredSection(index)}
          onMouseLeave={() => setHoveredSection(null)}
        >
          {/* Background Image with improved overlay */}
          <div className="absolute inset-0">
            <img src={section.bgImage} alt={`background-${index}`} className="w-full h-full object-cover transition-transform blur-sm sm:blur-md duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex flex-col lg:flex-row justify-center items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6 lg:gap-12 py-8 lg:py-0">
            {/* Image Section - Lebih lebar */}
            <div className="w-full lg:w-3/5 flex justify-center order-1 lg:order-none">
              <div className="relative group/image w-full max-w-lg lg:max-w-none">
                <a href={section.link} className="block relative overflow-hidden rounded-lg sm:rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-105">
                  <img src={section.mainImage} alt={`content-${index}`} className="w-full h-56 sm:h-64 md:h-80 lg:h-96 xl:h-[20rem] object-cover transition-transform duration-700 group-hover/image:scale-110" />

                  {/* Image overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-300" />

                  {/* Hover icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-300">
                    <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-full">
                      <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>

                  {/* Subtle border glow on hover */}
                  <div className="absolute inset-0 rounded-lg sm:rounded-xl ring-0 group-hover/image:ring-2 group-hover/image:ring-white/30 transition-all duration-300" />
                </a>
              </div>
            </div>

            {/* Text Section - Lebih kecil */}
            <div className="w-full lg:w-2/5 flex flex-col justify-center px-2 text-center lg:text-left order-2 lg:order-none">
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                {/* Tag with better styling */}
                <div className="flex justify-start">
                  <span className="inline-flex px-2 py-1 font-bold bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 italic rounded-md text-xs sm:text-sm tracking-wide shadow-lg">{section.tag}</span>
                </div>

                {/* Date with icon */}
                <div className="flex items-center justify-start gap-2 text-white/90">
                  <Calendar className="w-4 h-4" />
                  <span className="font-semibold text-sm tracking-wide">{section.date}</span>
                </div>

                {/* Title with better typography */}
                <div className="space-y-2 sm:space-y-3 ">
                  <h2 className="text-left text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">{section.title}</h2>

                  {/* Subtle underline decoration */}
                  <div className="flex justify-start">
                    <div className="w-15 sm:w-25 h-1 bg-gradient-to-r from-amber-500 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle animation indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className={`w-8 sm:w-12 h-0.5 bg-white/30 rounded-full transition-all duration-300 ${hoveredSection === index ? 'bg-white/60 w-12 sm:w-16' : ''}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
