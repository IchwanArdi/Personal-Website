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
    <div className="min-w-7xl mx-auto ">
      {contentSections.map((section, index) => (
        <div key={index} className="relative w-full h-[500px] flex items-center justify-center overflow-hidden group" onMouseEnter={() => setHoveredSection(index)} onMouseLeave={() => setHoveredSection(null)}>
          {/* Background Image with improved overlay */}
          <div className="absolute inset-0">
            <img src={section.bgImage} alt={`background-${index}`} className="w-full h-full object-cover transition-transform blur-md duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex flex-col md:flex-row justify-center items-center w-full max-w-6xl mx-auto px-6 gap-8">
            {/* Image Section */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative group/image">
                <a href={section.link} className="block relative overflow-hidden rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-105">
                  <img src={section.mainImage} alt={`content-${index}`} className="w-full h-48 sm:h-56 md:h-72 lg:h-80 object-cover transition-transform duration-700 group-hover/image:scale-110" />

                  {/* Image overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-300" />

                  {/* Hover icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-300">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                      <ExternalLink className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Subtle border glow on hover */}
                  <div className="absolute inset-0 rounded-lg ring-0 group-hover/image:ring-2 group-hover/image:ring-white/30 transition-all duration-300" />
                </a>
              </div>
            </div>

            {/* Text Section */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-2 mt-4 md:mt-0">
              <div className="space-y-4">
                {/* Tag with better styling */}
                <div className="inline-flex items-center">
                  <span className="px-2 py-1 font-bold bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 italic rounded-md text-sm tracking-wide shadow-lg ">{section.tag}</span>
                </div>

                {/* Date with icon */}
                <div className="flex items-center gap-2 text-white/90">
                  <Calendar className="w-4 h-4" />
                  <span className="font-semibold text-sm tracking-wide">{section.date}</span>
                </div>

                {/* Title with better typography */}
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">{section.title}</h2>

                  {/* Subtle underline decoration */}
                  <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-transparent rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Subtle animation indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className={`w-12 h-0.5 bg-white/30 rounded-full transition-all duration-300 ${hoveredSection === index ? 'bg-white/60 w-16' : ''}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
