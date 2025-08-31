import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, Calendar, Tag, Star, Users, Clock, CheckCircle, Play, FileImage, Code2 } from 'lucide-react';
import { toast } from 'react-toastify';

function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectDetail, setProjectDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

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
        console.log(result);

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
  }, [id, navigate]);

  const goBack = () => {
    navigate('/projects');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950/90 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!projectDetail) {
    return (
      <div className="min-h-screen bg-slate-950/90 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-gray-400 mb-4">The project you're looking for doesn't exist.</p>
          <button onClick={goBack} className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium transition-colors">
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

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

          <h1 className="text-4xl lg:text-5xl md:p-2 font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{projectDetail.title}</h1>

          <p className="text-xl text-gray-300 mb-6 leading-relaxed max-w-4xl">{projectDetail.shortDescription}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {projectDetail.githubUrl && projectDetail.githubUrl !== '#' && (
              <a href={projectDetail.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium transition-all hover:scale-105">
                <Github className="w-5 h-5" />
                View Code
              </a>
            )}
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
                        className={`relative flex-shrink-0 w-20 h-16 m-1 rounded-lg overflow-hidden transition-all ${currentImageIndex === index ? 'ring-2 ring-yellow-400 opacity-100' : 'opacity-60 hover:opacity-80'}`}
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
                <FileImage className="w-6 h-6 text-yellow-400" />
                About This Project
              </h2>
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20">
                <p className="text-gray-300 leading-relaxed text-lg">{projectDetail.description}</p>
              </div>
            </section>

            {/* Features - Only show if features exist */}
            {projectDetail.features && projectDetail.features.length > 0 && (
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
            )}

            {/* Challenges & Solutions - Only show if challenges exist */}
            {projectDetail.challenges && projectDetail.challenges.length > 0 && (
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
            )}
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
            {projectDetail.technologies && projectDetail.technologies.length > 0 && (
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
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/20">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {projectDetail.githubUrl && projectDetail.githubUrl !== '#' && (
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
                )}

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
