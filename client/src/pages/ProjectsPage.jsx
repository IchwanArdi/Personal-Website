import React, { useState } from 'react';
import { Search, Github, ExternalLink, Code, Database, Globe, Calendar, Tag, Star, GitBranch } from 'lucide-react';

// Mock project data
const allProjects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, payment integration, admin dashboard, and real-time inventory management.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe', 'JWT'],
    category: 'FULLSTACK',
    status: 'COMPLETED',
    date: '2024-12',
    githubUrl: 'https://github.com/username/ecommerce',
    liveUrl: 'https://ecommerce-demo.com',
    featured: true,
    stars: 45,
    commits: 128,
  },
  {
    id: 2,
    title: 'Task Management Dashboard',
    description: 'Modern task management application with drag-and-drop functionality, team collaboration, and real-time notifications using Socket.io.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Socket.io'],
    category: 'FULLSTACK',
    status: 'IN PROGRESS',
    date: '2024-11',
    githubUrl: 'https://github.com/username/task-manager',
    liveUrl: 'https://taskboard-demo.com',
    featured: false,
    stars: 23,
    commits: 67,
  },
  {
    id: 3,
    title: 'Social Media API',
    description: 'RESTful API for social media application with user management, post creation, real-time chat, and image upload functionality.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
    technologies: ['Express', 'MongoDB', 'Redis', 'Cloudinary', 'JWT'],
    category: 'BACKEND',
    status: 'COMPLETED',
    date: '2024-10',
    githubUrl: 'https://github.com/username/social-api',
    liveUrl: null,
    featured: false,
    stars: 31,
    commits: 89,
  },
  {
    id: 4,
    title: 'Portfolio Website',
    description: 'Modern responsive portfolio website built with React and Tailwind CSS, featuring smooth animations and optimized performance.',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
    technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    category: 'FRONTEND',
    status: 'COMPLETED',
    date: '2024-09',
    githubUrl: 'https://github.com/username/portfolio',
    liveUrl: 'https://myportfolio.com',
    featured: false,
    stars: 18,
    commits: 42,
  },
  {
    id: 5,
    title: 'Real-time Chat Application',
    description: 'Full-stack chat application with multiple rooms, file sharing, message encryption, and online status indicators.',
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=600&fit=crop',
    technologies: ['Vue.js', 'Socket.io', 'Node.js', 'MongoDB', 'AWS S3'],
    category: 'FULLSTACK',
    status: 'COMPLETED',
    date: '2024-08',
    githubUrl: 'https://github.com/username/chat-app',
    liveUrl: 'https://chatapp-demo.com',
    featured: false,
    stars: 37,
    commits: 95,
  },
  {
    id: 6,
    title: 'Data Visualization Dashboard',
    description: 'Interactive dashboard for data visualization with charts, filters, and export functionality using D3.js and Chart.js.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    technologies: ['React', 'D3.js', 'Chart.js', 'Python', 'FastAPI'],
    category: 'FULLSTACK',
    status: 'IN PROGRESS',
    date: '2024-07',
    githubUrl: 'https://github.com/username/data-viz',
    liveUrl: null,
    featured: false,
    stars: 29,
    commits: 73,
  },
];

function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const categories = ['ALL', 'FULLSTACK', 'FRONTEND', 'BACKEND'];
  const statuses = ['ALL', 'COMPLETED', 'IN PROGRESS'];

  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) || project.description.toLowerCase().includes(searchTerm.toLowerCase()) || project.technologies.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || project.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || project.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const featuredProject = filteredProjects.find((project) => project.featured) || filteredProjects[0];
  const otherProjects = filteredProjects.filter((project) => project !== featuredProject);

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'IN PROGRESS':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950/90 text-white">
      {/* Search Bar */}
      <div className="w-full flex justify-center pt-8 pb-4">
        <div className="relative w-full max-w-2xl mx-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects, technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border border-gray-600 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-center pb-8">
        <div className="flex flex-wrap gap-6 px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-4">
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

          {/* Status Filter */}
          <div className="flex flex-wrap gap-4">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 text-sm font-semibold transition-colors ${selectedStatus === status ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Featured Project */}
        {featuredProject && (
          <div className="mb-16">
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/30 hover:border-yellow-400/30 transition-all duration-500">
              <div className="lg:flex">
                <div className="lg:w-3/5 relative">
                  <div className="relative overflow-hidden h-80 lg:h-96">
                    <img src={featuredProject.image} alt={featuredProject.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/60" />
                    <div className="absolute top-6 left-6">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-full text-sm font-bold">FEATURED</span>
                    </div>
                    <div className="absolute top-6 right-6 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(featuredProject.status)}`}>{featuredProject.status}</span>
                    </div>
                  </div>
                </div>
                <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center gap-2 text-yellow-400 text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      {featuredProject.date}
                    </span>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="flex items-center gap-1 text-gray-400 text-sm">
                      <Star className="w-3 h-3" />
                      {featuredProject.stars}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400 text-sm">
                      <GitBranch className="w-3 h-3" />
                      {featuredProject.commits}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-2 text-yellow-400 text-sm font-medium mb-3">
                    <Tag className="w-4 h-4" />
                    {featuredProject.category}
                  </span>

                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight group-hover:text-yellow-200 transition-colors duration-300">{featuredProject.title}</h2>

                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">{featuredProject.description}</p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredProject.technologies.map((tech, index) => (
                      <span key={index} className="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <a href={featuredProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-2 py-3 rounded-lg font-medium transition-colors">
                      <Github className="w-4 h-4" />
                      View Code
                    </a>
                    {featuredProject.liveUrl && (
                      <a
                        href={featuredProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-2 py-3 rounded-lg font-medium transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Projects Grid */}
        {otherProjects.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-8">Other Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherProjects.map((project) => (
                <article key={project.id} className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/20 hover:border-yellow-400/30 transition-all duration-500 hover:transform hover:scale-[1.02]">
                    <div className="relative overflow-hidden">
                      <img src={project.image} alt={project.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>{project.status}</span>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-black/70 backdrop-blur-sm text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">{project.category}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="flex items-center gap-1 text-gray-400 text-sm">
                          <Calendar className="w-3 h-3" />
                          {project.date}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="flex items-center gap-1 text-gray-400 text-sm">
                          <Star className="w-3 h-3" />
                          {project.stars}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-yellow-200 transition-colors duration-300 line-clamp-2">{project.title}</h3>

                      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <span key={index} className="bg-gray-800/50 text-gray-400 px-2 py-1 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && <span className="text-gray-500 text-xs px-2 py-1">+{project.technologies.length - 3}</span>}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-yellow-400 text-sm font-medium hover:text-yellow-300 transition-colors">
                          <Github className="w-3 h-3" />
                          Code
                        </a>
                        {project.liveUrl && (
                          <>
                            <span className="text-gray-500 text-sm">•</span>
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-yellow-400 text-sm font-medium hover:text-yellow-300 transition-colors">
                              <ExternalLink className="w-3 h-3" />
                              Live
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Code className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No projects found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}

export default ProjectsPage;
