import { useState } from 'react';
import { ArrowLeft, Github, ExternalLink, Calendar, Tag, Star, Users, Clock, CheckCircle, Play, FileImage, Code2 } from 'lucide-react';

// Mock project detail data - nanti diganti dengan data dari database
const projectDetail = {
  id: 1,
  title: 'E-Commerce Platform',
  shortDescription: 'Full-stack e-commerce solution with modern features',
  description:
    'A comprehensive e-commerce platform built with modern web technologies. This project features a complete user authentication system, secure payment processing, admin dashboard for inventory management, and real-time notifications. The platform is designed to handle high traffic loads and provides an excellent user experience across all devices.',
  images: [
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
  ],
  technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe', 'JWT', 'Redis', 'Socket.io', 'Tailwind CSS'],
  category: 'FULLSTACK',
  date: '2/1/25',
  githubUrl: 'https://github.com/username/ecommerce',
  liveUrl: 'https://ecommerce-demo.com',
  featured: true,
  duration: '3 months',
  teamSize: '2 developers',
  status: 'Completed',
  features: [
    'User Authentication & Authorization',
    'Product Catalog Management',
    'Shopping Cart & Checkout',
    'Payment Integration (Stripe)',
    'Admin Dashboard',
    'Real-time Inventory Tracking',
    'Order Management System',
    'Email Notifications',
    'Responsive Design',
    'Search & Filtering',
  ],
  challenges: [
    {
      title: 'Payment Security',
      description: 'Implementing secure payment processing while maintaining user experience',
      solution: 'Used Stripe API with proper error handling and validation',
    },
    {
      title: 'Real-time Updates',
      description: 'Synchronizing inventory across multiple users simultaneously',
      solution: 'Implemented Socket.io for real-time inventory updates',
    },
    {
      title: 'Performance Optimization',
      description: 'Loading large product catalogs efficiently',
      solution: 'Added pagination, lazy loading, and Redis caching',
    },
  ],
  // Removed metrics - not all projects need performance data
};

function ProjectDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const goBack = () => {
    // Nanti implementasi routing back ke /projects
    console.log('Navigate back to projects');
  };

  return (
    <div className="min-h-screen bg-slate-950/90 text-white">
      {/* Back Button */}
      <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-sm border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={goBack} className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="flex items-center gap-2 text-yellow-400 text-sm font-medium">
              <Calendar className="w-4 h-4" />
              {projectDetail.date}
            </span>
            <span className="flex items-center gap-2 text-yellow-400 text-sm font-medium">
              <Tag className="w-4 h-4" />
              {projectDetail.category}
            </span>
            {projectDetail.featured && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3" />
                FEATURED
              </span>
            )}
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{projectDetail.title}</h1>

          <p className="text-xl text-gray-300 mb-6 leading-relaxed max-w-4xl">{projectDetail.shortDescription}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <a href={projectDetail.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium transition-all hover:scale-105">
              <Github className="w-5 h-5" />
              View Code
            </a>
            {projectDetail.liveUrl && (
              <a
                href={projectDetail.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
              >
                <ExternalLink className="w-5 h-5" />
                Live Demo
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Image Gallery */}
            <section>
              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl bg-gray-900 group">
                  <img src={projectDetail.images[currentImageIndex]} alt={`${projectDetail.title} screenshot ${currentImageIndex + 1}`} className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                {/* Thumbnail Navigation */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {projectDetail.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all ${currentImageIndex === index ? 'ring-2 ring-yellow-400 opacity-100' : 'opacity-60 hover:opacity-80'}`}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileImage className="w-6 h-6 text-yellow-400" />
                About This Project
              </h2>
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20">
                <p className="text-gray-300 leading-relaxed text-lg">{projectDetail.description}</p>
              </div>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-yellow-400" />
                Key Features
              </h2>
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(showAllFeatures ? projectDetail.features : projectDetail.features.slice(0, 6)).map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {projectDetail.features.length > 6 && (
                  <button onClick={() => setShowAllFeatures(!showAllFeatures)} className="mt-4 text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors">
                    {showAllFeatures ? 'Show Less' : `Show ${projectDetail.features.length - 6} More Features`}
                  </button>
                )}
              </div>
            </section>

            {/* Challenges & Solutions */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Code2 className="w-6 h-6 text-yellow-400" />
                Challenges & Solutions
              </h2>
              <div className="space-y-4">
                {projectDetail.challenges.map((challenge, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20">
                    <h3 className="text-lg font-semibold mb-2 text-yellow-200">{challenge.title}</h3>
                    <p className="text-gray-400 mb-3">{challenge.description}</p>
                    <div className="bg-gray-800/50 rounded-lg p-3 border-l-4 border-yellow-400">
                      <p className="text-gray-300 text-sm">
                        <strong className="text-yellow-400">Solution:</strong> {challenge.solution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Project Info */}
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20">
              <h3 className="text-xl font-bold mb-4">Project Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">Duration</p>
                    <p className="text-gray-200">{projectDetail.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">Team Size</p>
                    <p className="text-gray-200">{projectDetail.teamSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <p className="text-gray-200">{projectDetail.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20">
              <h3 className="text-xl font-bold mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {projectDetail.technologies.map((tech, index) => (
                  <span key={index} className="bg-gray-800/50 hover:bg-yellow-400/10 text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-default">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance Metrics - Removed for universal compatibility */}

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href={projectDetail.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-4 py-3 rounded-lg transition-all group"
                >
                  <Github className="w-4 h-4 group-hover:text-yellow-400" />
                  <span>View Source Code</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>

                {projectDetail.liveUrl && (
                  <a
                    href={projectDetail.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 hover:text-yellow-300 px-4 py-3 rounded-lg transition-all group border border-yellow-400/20"
                  >
                    <Play className="w-4 h-4" />
                    <span>Live Demo</span>
                    <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Architecture & Technical Details */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Technical Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20 text-center">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Code2 className="w-6 h-6 text-yellow-400" />
              </div>
              <h4 className="font-semibold mb-2">Frontend</h4>
              <p className="text-sm text-gray-400">React, Tailwind CSS</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20 text-center">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Code2 className="w-6 h-6 text-yellow-400" />
              </div>
              <h4 className="font-semibold mb-2">Backend</h4>
              <p className="text-sm text-gray-400">Node.js, Express</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20 text-center">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Code2 className="w-6 h-6 text-yellow-400" />
              </div>
              <h4 className="font-semibold mb-2">Database</h4>
              <p className="text-sm text-gray-400">MongoDB, Redis</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20 text-center">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Code2 className="w-6 h-6 text-yellow-400" />
              </div>
              <h4 className="font-semibold mb-2">Payment</h4>
              <p className="text-sm text-gray-400">Stripe API</p>
            </div>
          </div>
        </div>

        {/* Project Description */}
        <div className="mt-16">
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/20">
            <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
            <p className="text-gray-300 leading-relaxed text-lg">{projectDetail.description}</p>
          </div>
        </div>

        {/* Navigation to other projects */}
        <div className="mt-16 pt-8 border-t border-gray-800/50">
          <div className="text-center">
            <button onClick={goBack} className="inline-flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-6 py-3 rounded-lg transition-all">
              <ArrowLeft className="w-4 h-4" />
              View All Projects
            </button>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}

export default ProjectDetailPage;
