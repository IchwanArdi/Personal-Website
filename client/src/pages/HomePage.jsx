import { useEffect, useState } from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import { useApp } from '../contexts/AppContext';
import { HOME } from '../utils/constants';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState(null);
  const [contentSections, setContentSections] = useState([]);

  const { language } = useApp();
  const t = HOME[language];

  const [hoveredSection, setHoveredSection] = useState(null);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)}`;
  };

  useEffect(() => {
    const fetchHome = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/home`, {
          credentials: 'include',
        });

        const result = await response.json();

        if (response.ok) {
          setHomeData(result);

          // Process the API data into content sections
          const sections = [];

          // Latest Project section
          if (result.latestProject) {
            const project = result.latestProject;
            sections.push({
              bgImage: project.gambar,
              mainImage: project.gambar,
              tag: 'latestProject',
              date: formatDate(project.tanggal),
              title: project.title,
              link: project.link || '#',
              type: 'project',
            });
          }

          // Latest Blog section
          if (result.latestBlog) {
            const blog = result.latestBlog;
            sections.push({
              bgImage: blog.gambar,
              mainImage: blog.gambar,
              tag: 'latestBlogs',
              date: formatDate(blog.tanggal),
              title: blog.judul,
              link: `/blog/${encodeURIComponent(blog.judul)}`, // Assuming you have blog detail route
              type: 'blog',
            });
          }

          // Latest Update section (About Me)
          if (result.latestUpdate) {
            const update = result.latestUpdate;
            sections.push({
              bgImage: update.gambar,
              mainImage: update.gambar,
              tag: 'latestUpdate',
              date: new Date()
                .toLocaleDateString('en-US', {
                  month: 'numeric',
                  day: 'numeric',
                  year: '2-digit',
                })
                .replace(/\//g, '/'),
              title: 'Tentang Saya',
              link: '/about', // Assuming you have about page
              type: 'update',
            });
          }

          setContentSections(sections);
        } else {
          toast.error(result.message || 'Gagal mengambil data dashboard.');
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        toast.error('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchHome();
  }, [language, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!homeData || contentSections.length === 0) {
    return (
      <div className="w-full mx-auto bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">No data available</div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-black">
      {contentSections.map((section, index) => (
        <div
          key={`${section.type}-${index}`}
          className="relative w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[500px] flex items-center justify-center overflow-hidden group"
          onMouseEnter={() => setHoveredSection(index)}
          onMouseLeave={() => setHoveredSection(null)}
        >
          {/* Background Image with improved overlay */}
          <div className="absolute inset-0 ">
            <img
              src={section.bgImage}
              alt={`background-${section.type}`}
              className="w-full h-full object-cover transition-transform blur-sm sm:blur-md duration-700"
              onError={(e) => {
                // Fallback to a default image if the API image fails to load
                e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex flex-col lg:flex-row justify-center items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6 lg:gap-12 py-8 lg:py-0">
            {/* Image Section - Lebih lebar */}
            <div className="w-full lg:w-3/5 flex justify-center order-1 lg:order-none">
              <div className="relative group/image w-full max-w-lg lg:max-w-none">
                <a
                  href={section.link}
                  className="block relative overflow-hidden rounded-lg sm:rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-105"
                  target={section.link.startsWith('http') ? '_self' : ''}
                  rel={section.link.startsWith('http') ? 'noopener noreferrer' : ''}
                >
                  <img
                    src={section.mainImage}
                    alt={section.title}
                    className="w-full h-56 sm:h-64 md:h-80 lg:h-96 xl:h-[20rem] object-cover transition-transform duration-700 group-hover/image:scale-110"
                    onError={(e) => {
                      // Fallback to a default image if the API image fails to load
                      e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop';
                    }}
                  />

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
                  <span className="inline-flex px-2 py-1 font-bold bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 italic rounded-md text-xs sm:text-sm tracking-wide shadow-lg">{t[section.tag]}</span>
                </div>

                {/* Date with icon */}
                <div className="flex items-center justify-start gap-2 text-white/90">
                  <Calendar className="w-4 h-4" />
                  <span className="font-semibold text-sm tracking-wide">{section.date}</span>
                </div>

                {/* Title with better typography */}
                <div className="space-y-2 sm:space-y-3 ">
                  <h2 className="text-left text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl xl:w-2xl font-bold text-white leading-tight tracking-tight">{section.title}</h2>

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
};

export default HomePage;
