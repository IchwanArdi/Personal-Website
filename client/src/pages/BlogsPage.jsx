import React, { useState } from 'react';
import { Search, Calendar, ArrowRight, Tag } from 'lucide-react';

// Mock images
const images = {
  img1: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
  img2: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
  img3: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
  img4: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
  img5: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
  img6: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
};

const allContent = [
  {
    bgImage: images.img1,
    date: '4/26/25',
    title: 'Uncaptured Moments: Enter & Escape Mission To Guarded Factory Complex',
    category: 'UNCAPTURED MOMENTS',
    featured: true,
    readTime: '5 min read',
    excerpt: 'Exploring the intersection of technology and creativity in modern digital landscapes.',
  },
  {
    bgImage: images.img2,
    date: '4/25/25',
    title: 'Project Development: Building Modern Web Applications',
    category: 'ED MOMENTS',
    readTime: '8 min read',
    excerpt: 'A comprehensive guide to creating scalable and maintainable web applications.',
  },
  {
    bgImage: images.img3,
    date: '4/24/25',
    title: 'Photography Tips: Capturing the Perfect Shot',
    category: 'UNCAPTURED MOMENTS',
    readTime: '6 min read',
    excerpt: 'Professional techniques for capturing stunning photographs in any environment.',
  },
  {
    bgImage: images.img4,
    date: '4/23/25',
    title: 'Technology Review: Latest Gadgets and Tools',
    category: 'UNCAPTURED',
    readTime: '4 min read',
    excerpt: 'In-depth analysis of the newest technology trends and innovations.',
  },
  {
    bgImage: images.img5,
    date: '4/22/25',
    title: 'Creative Writing: Storytelling in Digital Age',
    category: 'ED MOMENTS',
    readTime: '7 min read',
    excerpt: 'How digital platforms are transforming the art of storytelling.',
  },
  {
    bgImage: images.img6,
    date: '4/21/25',
    title: 'Design Principles: Creating Beautiful User Interfaces',
    category: 'UNCAPTURED MOMENTS',
    readTime: '9 min read',
    excerpt: 'Essential design principles for creating intuitive and beautiful interfaces.',
  },
];

function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'ED MOMENTS', 'UNCAPTURED MOMENTS', 'UNCAPTURED'];

  const filteredContent = allContent.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase()) || item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredItem = filteredContent.find((item) => item.featured) || filteredContent[0];
  const otherItems = filteredContent.filter((item) => item !== featuredItem);

  return (
    <div className="min-h-screen bg-slate-950/90 text-white">
      {/* Search Bar */}
      <div className="w-full flex justify-center pt-8 pb-4">
        <div className="relative w-full max-w-2xl mx-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border border-gray-600 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center pb-8">
        <div className="flex flex-wrap gap-4 px-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${selectedCategory === category ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Featured Article */}
        {featuredItem && (
          <div className="mb-16">
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/30 hover:border-yellow-400/30 transition-all duration-500 cursor-pointer">
              <div className="lg:flex">
                <div className="lg:w-3/5 relative">
                  <div className="relative overflow-hidden h-80 lg:h-96">
                    <img src={featuredItem.bgImage} alt="Featured content" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/60" />
                    <div className="absolute top-6 left-6">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-full text-sm font-bold">FEATURED</span>
                    </div>
                  </div>
                </div>
                <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center gap-2 text-yellow-400 text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      {featuredItem.date}
                    </span>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-gray-400 text-sm">{featuredItem.readTime}</span>
                  </div>

                  <span className="inline-flex items-center gap-2 text-yellow-400 text-sm font-medium mb-3">
                    <Tag className="w-4 h-4" />
                    {featuredItem.category}
                  </span>

                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight group-hover:text-yellow-200 transition-colors duration-300">{featuredItem.title}</h2>

                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">{featuredItem.excerpt}</p>

                  <button className="flex items-center gap-2 text-yellow-400 font-medium hover:text-yellow-300 transition-colors group/btn">
                    Read More
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Articles Grid */}
        {otherItems.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-8">More Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherItems.map((item, index) => (
                <article key={index} className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/20 hover:border-yellow-400/30 transition-all duration-500 hover:transform hover:scale-[1.02]">
                    <div className="relative overflow-hidden">
                      <img src={item.bgImage} alt={item.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-black/70 backdrop-blur-sm text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">{item.category}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="flex items-center gap-1 text-gray-400 text-sm">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400 text-sm">{item.readTime}</span>
                      </div>

                      <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-yellow-200 transition-colors duration-300 line-clamp-2">{item.title}</h3>

                      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{item.excerpt}</p>

                      <button className="flex items-center gap-2 text-yellow-400 text-sm font-medium hover:text-yellow-300 transition-colors group/btn">
                        Read Article
                        <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredContent.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No articles found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}

export default BlogsPage;
