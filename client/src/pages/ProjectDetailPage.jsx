import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, Calendar, Tag, Star, Users, Clock, CheckCircle, Play, FileImage, Code2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useApp } from '../contexts/AppContext';
import { DETAILPROJECT } from '../utils/constants';

function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectDetail, setProjectDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const { language, isDarkMode } = useApp();
  const t = DETAILPROJECT[language];

  useEffect(() => {
    const fetchProjectDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/project/detail/${id}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Project not found');
        }

        const result = await response.json();

        // Transform the API data to match the component's expected structure
        const transformedProject = {
          id: result.id || result._id,
          title: result.title,
          shortDescription: result.description || result.deskripsi,
          description: result.detailedDescription || result.displayDescription,
          images: result.images && result.images.length > 0 ? result.images : result.allImages && result.allImages.length > 0 ? result.allImages : [result.image || result.gambar],
          technologies: result.technologies || [],
          category: result.category || result.kategori?.toUpperCase() || 'OTHER',
          date: result.date || new Date(result.tanggal).toLocaleDateString() || 'Not specified',
          githubUrl: result.githubUrl || '#',
          liveUrl: result.liveUrl || result.link || null,
          featured: result.featured || false,
          duration: result.duration || 'Not specified',
          teamSize: result.teamSize || 'Not specified',
          status: result.status || 'Completed',
          features: result.features || [],
          challenges: result.challenges || [],
        };

        setProjectDetail(transformedProject);
      } catch (error) {
        console.error('Error fetching project details:', error);
        toast.error('Error fetching project details');
        // Redirect back to projects page if project not found
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectDetail();
    }
  }, [id, navigate, language, t]);

  const goBack = () => {
    navigate('/projects');
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{t.loadingProject}</p>
        </div>
      </div>
    );
  }

  if (!projectDetail) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t.noProject}</h2>
          <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.noProjectInfo}</p>
          <button onClick={goBack} className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium transition-colors">
            {t.backToProjects}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Back Button */}
      <div className={`sticky top-5 z-30 backdrop-blur-sm ${isDarkMode ? 'bg-black' : 'bg-white/80'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={goBack} className="flex font-semibold items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t.backToProjects}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="flex items-center gap-2 text-yellow-500 text-sm font-medium">
              <Calendar className="w-4 h-4" />
              {projectDetail.date}
            </span>
            <span className="flex items-center gap-2 text-yellow-500 text-sm font-medium">
              <Tag className="w-4 h-4" />
              {projectDetail.category}
            </span>
          </div>

          <h1 className={`text-4xl lg:text-5xl md:py-2 font-bold mb-4 ${isDarkMode ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'}`}>
            {projectDetail.title}
          </h1>

          <p className={`text-md md:text-xl mb-6 leading-relaxed max-w-4xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{projectDetail.shortDescription}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {projectDetail.githubUrl && projectDetail.githubUrl !== '#' && (
              <a href={projectDetail.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium transition-all">
                <Github className="w-5 h-5" />
                {t.viewCode}
              </a>
            )}
            {projectDetail.liveUrl && (
              <a
                href={projectDetail.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-6 py-3 rounded-lg font-medium transition-all"
              >
                <ExternalLink className="w-5 h-5" />
                {t.liveDemo}
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
                <div className={`relative overflow-hidden rounded-2xl group ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <img
                    src={projectDetail.images[currentImageIndex]}
                    alt={`${projectDetail.title} screenshot ${currentImageIndex + 1}`}
                    className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                {/* Thumbnail Navigation - Only show if multiple images */}
                {projectDetail.images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {projectDetail.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-16 m-1 rounded-lg overflow-hidden transition-all ${currentImageIndex === index ? 'ring-2 ring-yellow-500 opacity-100' : 'opacity-60 hover:opacity-80'}`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileImage className="w-6 h-6 text-yellow-500" />
                {t.aboutThisProject}
              </h2>
              <div className={`backdrop-blur-sm rounded-2xl p-6 border ${isDarkMode ? 'bg-gradient-to-br from-gray-900/20 to-gray-900/30 border-gray-700/20' : 'bg-gradient-to-br from-white/70 to-gray-50/30 border-gray-300/30'}`}>
                <p className={`leading-relaxed text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{projectDetail.description}</p>
              </div>
            </section>

            {/* Features - Only show if features exist */}
            {projectDetail.features && projectDetail.features.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-yellow-500" />
                  {t.keyFeatures}
                </h2>
                <div className={`backdrop-blur-sm rounded-2xl p-6 border mb-5 ${isDarkMode ? 'bg-gradient-to-br from-gray-900/20 to-gray-900/30 border-gray-700/20' : 'bg-gradient-to-br from-white/70 to-gray-50/30 border-gray-300/30'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(showAllFeatures ? projectDetail.features : projectDetail.features.slice(0, 6)).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {projectDetail.features.length > 6 && (
                    <button onClick={() => setShowAllFeatures(!showAllFeatures)} className="mt-4 text-yellow-500 hover:text-yellow-400 text-sm font-medium transition-colors">
                      {showAllFeatures ? t.showLess : `${t.show} ${projectDetail.features.length - 6} ${t.moreFeatures}`}
                    </button>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Project Info */}
            <div className={`backdrop-blur-sm rounded-2xl p-6 border ${isDarkMode ? 'bg-gradient-to-br from-gray-900/20 to-gray-900/30 border-gray-700/20' : 'bg-gradient-to-br from-white/70 to-gray-50/30 border-gray-300/30'}`}>
              <h3 className="text-xl font-bold mb-4">{t.projectInfo}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.duration}</p>
                    <p className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{projectDetail.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-yellow-500" />
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.teamSize}</p>
                    <p className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{projectDetail.teamSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-yellow-500" />
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.status}</p>
                    <p className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{projectDetail.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies */}
            {projectDetail.technologies && projectDetail.technologies.length > 0 && (
              <div className={`backdrop-blur-sm rounded-2xl p-6 border ${isDarkMode ? 'bg-gradient-to-br from-gray-900/20 to-gray-900/30 border-gray-700/20' : 'bg-gradient-to-br from-white/70 to-gray-50/30 border-gray-300/30'}`}>
                <h3 className="text-xl font-bold mb-4">{t.technologiesUsed}</h3>
                <div className="flex flex-wrap gap-2">
                  {projectDetail.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-default ${
                        isDarkMode ? 'bg-gray-800/50 hover:bg-yellow-400/10 text-gray-300 hover:text-yellow-400' : 'bg-gray-200 hover:bg-yellow-400/20 text-gray-700 hover:text-yellow-600'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className={`backdrop-blur-sm rounded-2xl p-6 border ${isDarkMode ? 'bg-gradient-to-br from-gray-900/20 to-gray-900/30 border-gray-700/20' : 'bg-gradient-to-br from-white/70 to-gray-50/30 border-gray-300/30'}`}>
              <h3 className="text-xl font-bold mb-4">{t.quickActions}</h3>
              <div className="space-y-3">
                {projectDetail.githubUrl && projectDetail.githubUrl !== '#' && (
                  <a
                    href={projectDetail.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all group ${
                      isDarkMode ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <Github className="w-4 h-4 group-hover:text-yellow-500" />
                    <span>{t.viewSourceCode}</span>
                    <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}

                {projectDetail.liveUrl && (
                  <a
                    href={projectDetail.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 hover:text-yellow-400 px-4 py-3 rounded-lg transition-all group border border-yellow-400/20"
                  >
                    <Play className="w-4 h-4" />
                    <span>{t.liveDemo}</span>
                    <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation to other projects */}
        <div className={`mx-16 pt-8 border-t ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
          <div className="text-center">
            <button
              onClick={goBack}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                isDarkMode ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              {t.viewAllProjects}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailPage;
