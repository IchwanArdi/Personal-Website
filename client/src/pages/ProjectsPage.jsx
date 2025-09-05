import { useState, useEffect } from 'react';
import { Search, Github, ExternalLink, Code, Calendar, Tag } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useApp } from '../contexts/AppContext';
import { PROJECTS } from '../utils/constants';

function ProjectsPage() {
  const [dataProjects, setDataProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const { language, isDarkMode } = useApp();
  const t = PROJECTS[language];

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
          new: project.new || false,
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
  }, [language, t]);

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

  const newProject = filteredProjects.find((project) => project.new) || filteredProjects[0];
  const otherProjects = filteredProjects.filter((project) => project !== newProject);

  // Generate dynamic meta for SEO
  const generateProjectsMeta = () => {
    let dynamicDescription = 'Kumpulan project dan karya terbaik Ichwan dalam bidang web development, mulai dari aplikasi web hingga sistem kompleks.';
    let dynamicKeywords = 'Projects, Portfolio, Web Development, JavaScript, React, Node.js';
    let dynamicImage = '/og-image.jpg'; // default image

    // Customize based on search/filter state
    if (searchTerm) {
      dynamicDescription = `Pencarian blog untuk "${searchTerm}" - ${dynamicDescription}`;
      dynamicKeywords = `${searchTerm}, ${dynamicKeywords}`;
    }

    if (selectedCategory && selectedCategory !== 'ALL') {
      dynamicDescription = `Artikel kategori ${selectedCategory} - ${dynamicDescription}`;
      dynamicKeywords = `${selectedCategory}, ${dynamicKeywords}`;
    }

    // Use new project image if available
    if (newProject?.bgImage) {
      dynamicImage = newProject.bgImage;
    }

    return {
      title: searchTerm ? `Pencarian: ${searchTerm} - Projects` : selectedCategory && selectedCategory !== 'ALL' ? `${selectedCategory} - Projects` : 'Projects',
      description: dynamicDescription,
      keywords: dynamicKeywords,
      image: dynamicImage,
      url: '/projects',
    };
  };

  // Handle button clicks to prevent event bubbling
  const handleButtonClick = (e, url) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <>
        <SEO customMeta={generateProjectsMeta()} />
        <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading projects...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <SEO customMeta={generateProjectsMeta()} />
      {/* Search Bar */}
      <div className="w-full flex justify-center pt-8 pb-4">
        <div className="relative w-full max-w-2xl mx-4">
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border rounded-lg py-3 pl-12 pr-4 transition-colors focus:outline-none focus:border-yellow-500 ${
              isDarkMode ? 'bg-transparent border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
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
                className={`px-4 py-2 text-sm font-semibold transition-colors ${
                  selectedCategory === category ? 'text-yellow-500 border-b-2 border-yellow-500' : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6">
        {/* New Project */}
        {newProject && (
          <div className="mb-16">
            <Link to={`/project/${newProject.id}`}>
              <div
                className={`group relative overflow-hidden rounded-3xl backdrop-blur-sm border transition-all duration-500 ${
                  isDarkMode ? 'bg-gray-900/70 md:bg-gray-900/30 border-gray-700/30 hover:border-yellow-400/30' : 'bg-white/70 md:bg-white/10 shadow-md border-gray-600/30 hover:border-yellow-500/40'
                }`}
              >
                <div className="lg:flex">
                  <div className="lg:w-3/5 relative">
                    <div className="relative overflow-hidden h-80 lg:h-96">
                      <img
                        src={newProject.image}
                        alt={newProject.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/60" />
                      <div className="absolute top-6 left-6">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-full text-sm font-bold">{t.newProject}</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-2/5 py-8 px-4 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="flex items-center gap-2 text-yellow-500 text-sm font-medium">
                        <Calendar className="w-4 h-4" />
                        {newProject.date}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-2 text-yellow-500 text-sm font-medium mb-3">
                      <Tag className="w-4 h-4" />
                      {newProject.category}
                    </span>

                    <h2 className={`text-3xl lg:text-4xl font-bold mb-4 leading-tight group-hover:text-yellow-400 transition-colors duration-300 ${isDarkMode ? 'group-hover:text-yellow-200' : 'group-hover:text-yellow-600'}`}>
                      {newProject.title}
                    </h2>

                    <p className={`text-lg mb-6 leading-relaxed line-clamp-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{newProject.description}</p>

                    {/* Technologies */}
                    {newProject.technologies && newProject.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {newProject.technologies.map((tech, index) => (
                          <span key={index} className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      {newProject.githubUrl && newProject.githubUrl !== '#' && (
                        <button onClick={(e) => handleButtonClick(e, newProject.githubUrl)} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-2 py-3 rounded-lg font-medium transition-colors">
                          <Github className="w-4 h-4" />
                          {t.viewCode}
                        </button>
                      )}
                      {newProject.liveUrl && (
                        <button
                          onClick={(e) => handleButtonClick(e, newProject.liveUrl)}
                          className="flex items-center gap-2 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-2 py-3 rounded-lg font-medium transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {t.liveDemo}
                        </button>
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
            <h3 className="text-2xl font-bold mb-8 border-l-4 border-yellow-500 pl-4">{t.otherProjects}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherProjects.map((project, index) => (
                <Link key={index} to={`/project/${project.id}`}>
                  <article className="group cursor-pointer">
                    <div
                      className={`backdrop-blur-sm rounded-2xl overflow-hidden border transition-all duration-500 hover:transform ${
                        isDarkMode ? 'bg-gray-900/70 md:bg-gray-900/40 border-gray-700/30 hover:border-yellow-400/40' : 'bg-white/70 md:bg-white/10 border-gray-600/30 hover:border-yellow-500/50'
                      }`}
                    >
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
                          <span className={`flex items-center gap-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Calendar className="w-3 h-3" />
                            {project.date}
                          </span>
                        </div>

                        <h3 className={`text-xl font-bold mb-3 leading-tight group-hover:text-yellow-500 transition-colors duration-300 line-clamp-2 ${isDarkMode ? 'group-hover:text-yellow-200' : 'group-hover:text-yellow-600'}`}>
                          {project.title}
                        </h3>

                        <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.description}</p>

                        {/* Technologies */}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {project.technologies.slice(0, 3).map((tech, index) => (
                              <span key={index} className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && <span className={`text-xs px-2 py-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>+{project.technologies.length - 3}</span>}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {project.githubUrl && project.githubUrl !== '#' && (
                            <button onClick={(e) => handleButtonClick(e, project.githubUrl)} className="flex items-center gap-1 text-yellow-500 text-sm font-medium hover:text-yellow-400 transition-colors">
                              <Github className="w-3 h-3" />
                              {t.code}
                            </button>
                          )}
                          {project.liveUrl && project.githubUrl && project.githubUrl !== '#' && <span className="text-gray-500 text-sm">•</span>}
                          {project.liveUrl && (
                            <button onClick={(e) => handleButtonClick(e, project.liveUrl)} className="flex items-center gap-1 text-yellow-500 text-sm font-medium hover:text-yellow-400 transition-colors">
                              <ExternalLink className="w-3 h-3" />
                              {t.live}
                            </button>
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
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <Code className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t.noResults}</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{t.information}</p>
          </div>
        )}

        {/* No Data */}
        {dataProjects.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <Code className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t.noData}</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{t.noDataInfo}</p>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}

export default ProjectsPage;
