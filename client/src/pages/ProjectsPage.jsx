import { useState, useEffect } from 'react';
import { Search, Github, ExternalLink, Code, Calendar, Tag } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function ProjectsPage() {
  const [dataProjects, setDataProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/project`, {
          credentials: 'include',
        });
        const result = await response.json();

        // Transform the API data to match the component's expected structure
        const transformedProjects = result.Projects.map((project) => ({
          id: project.id || project._id,
          title: project.title,
          description: project.displayDescription || project.description,
          image: project.image || project.gambar,
          technologies: project.technologies || [],
          category: project.category || project.kategori?.toUpperCase() || 'OTHER',
          date: project.date,
          githubUrl: project.githubUrl || '#',
          liveUrl: project.liveUrl || project.link || null,
          featured: project.featured || false,
        }));

        setDataProjects(transformedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Error fetching data');
        setDataProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Get unique categories from the data
  const getCategories = () => {
    if (!Array.isArray(dataProjects) || dataProjects.length === 0) {
      return ['ALL'];
    }
    const uniqueCategories = [...new Set(dataProjects.map((project) => project?.category).filter(Boolean))];
    return ['ALL', ...uniqueCategories.filter((cat) => cat && cat !== 'ALL')];
  };

  const categories = getCategories();

  const filteredProjects = Array.isArray(dataProjects)
    ? dataProjects.filter((project) => {
        // Safety check for project object
        if (!project) return false;

        const searchLower = searchTerm.toLowerCase();

        const matchesSearch =
          (project.title || '').toLowerCase().includes(searchLower) ||
          (project.description || '').toLowerCase().includes(searchLower) ||
          (Array.isArray(project.technologies) && project.technologies.some((tech) => tech && typeof tech === 'string' && tech.toLowerCase().includes(searchLower)));

        const matchesCategory = selectedCategory === 'ALL' || project.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
    : [];

  const featuredProject = filteredProjects.find((project) => project.featured) || filteredProjects[0];
  const otherProjects = filteredProjects.filter((project) => project !== featuredProject);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Featured Project */}
        {featuredProject && (
          <div className="mb-16">
            <Link to={`/project/${featuredProject.id}`}>
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/20 to-gray-900/40 backdrop-blur-sm border border-gray-700/30 hover:border-yellow-400/30 transition-all duration-500">
                <div className="lg:flex">
                  <div className="lg:w-3/5 relative">
                    <div className="relative overflow-hidden h-80 lg:h-96">
                      <img
                        src={featuredProject.image}
                        alt={featuredProject.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop';
                        }}
                      />
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
                        {featuredProject.date}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-2 text-yellow-400 text-sm font-medium mb-3">
                      <Tag className="w-4 h-4" />
                      {featuredProject.category}
                    </span>

                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight group-hover:text-yellow-200 transition-colors duration-300">{featuredProject.title}</h2>

                    <p className="text-gray-300 text-lg mb-6 leading-relaxed line-clamp-5">{featuredProject.description}</p>

                    {/* Technologies */}
                    {featuredProject.technologies && featuredProject.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {featuredProject.technologies.map((tech, index) => (
                          <span key={index} className="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      {featuredProject.githubUrl && featuredProject.githubUrl !== '#' && (
                        <a href={featuredProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-2 py-3 rounded-lg font-medium transition-colors">
                          <Github className="w-4 h-4" />
                          View Code
                        </a>
                      )}
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
            </Link>
          </div>
        )}

        {/* Other Projects Grid */}
        {otherProjects.length > 0 && (
          <div className="">
            <h3 className="text-2xl font-bold mb-8 border-l-4 border-yellow-400 pl-4">Other Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherProjects.map((project, index) => (
                <Link key={index} to={`/project/${project.id}`}>
                  <article className="group cursor-pointer">
                    <div className=" bg-gray-900/50 md:bg-gray-900/40  backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/30 hover:border-yellow-400/40 transition-all duration-500 hover:transform">
                      <div className="relative overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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
                        </div>

                        <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-yellow-200 transition-colors duration-300 line-clamp-2">{project.title}</h3>

                        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>

                        {/* Technologies */}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {project.technologies.slice(0, 3).map((tech, index) => (
                              <span key={index} className="bg-gray-800/50 text-gray-400 px-2 py-1 rounded text-xs">
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && <span className="text-gray-500 text-xs px-2 py-1">+{project.technologies.length - 3}</span>}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {project.githubUrl && project.githubUrl !== '#' && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-yellow-400 text-sm font-medium hover:text-yellow-300 transition-colors">
                              <Github className="w-3 h-3" />
                              Code
                            </a>
                          )}
                          {project.liveUrl && project.githubUrl && project.githubUrl !== '#' && <span className="text-gray-500 text-sm">•</span>}
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-yellow-400 text-sm font-medium hover:text-yellow-300 transition-colors">
                              <ExternalLink className="w-3 h-3" />
                              Live
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
        {/* No Results */}
        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Code className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No projects found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* No Data */}
        {dataProjects.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Code className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No projects available</h3>
            <p className="text-gray-400">Projects will appear here once they are added to the database</p>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}

export default ProjectsPage;
