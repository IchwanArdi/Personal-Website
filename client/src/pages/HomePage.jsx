import { useEffect, useState, useCallback, useMemo } from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import { useApp } from '../contexts/AppContext';
import { HOME } from '../utils/constants';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);

  const { language } = useApp();
  const t = HOME[language];

  // Memoized helper functions - tidak perlu dibuat ulang setiap render
  const createSlug = useCallback((title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  }, []);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)}`;
  }, []);

  // Memoized content sections processing - hanya dihitung ulang jika homeData berubah
  const contentSections = useMemo(() => {
    if (!homeData) return [];

    const sections = [];

    // Latest Project section
    if (homeData.latestProject) {
      const project = homeData.latestProject;
      sections.push({
        bgImage: project.gambar,
        mainImage: project.gambar,
        tag: 'latestProject',
        date: formatDate(project.tanggal),
        title: project.title,
        link: project.liveUrl || '#test',
        type: 'project',
        isExternal: true,
      });
    }

    // Latest Blog section
    if (homeData.latestBlog) {
      const blog = homeData.latestBlog;
      sections.push({
        bgImage: blog.gambar,
        mainImage: blog.gambar,
        tag: 'latestBlogs',
        date: formatDate(blog.tanggal),
        title: blog.judul,
        type: 'blog',
        isExternal: false,
        slug: blog.slug || createSlug(blog.judul),
        link: `/blog/${blog.slug || createSlug(blog.judul)}`,
      });
    }

    // Latest Update section (About Me)
    if (homeData.latestUpdate) {
      const update = homeData.latestUpdate;
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
        link: '/about',
        type: 'update',
        isExternal: false,
      });
    }

    return sections;
  }, [homeData, formatDate, createSlug]);

  // Memoized dynamic meta - hanya dihitung ulang jika contentSections berubah
  const dynamicMeta = useMemo(
    () => ({
      title: 'Home',
      description: `Portfolio Ichwan - Lihat project terbaru "${contentSections[0]?.title || 'dan karya terbaik'}" serta artikel blog terkini tentang web development.`,
      image: contentSections[0]?.bgImage,
    }),
    [contentSections]
  );

  // API fetch dengan proper error handling dan cleanup
  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounted

    const fetchHome = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/home`, {
          credentials: 'include',
        });

        const result = await response.json();

        // Check if component is still mounted before updating state
        if (!isMounted) return;

        if (response.ok) {
          setHomeData(result);
        } else {
          toast.error(result.message || 'Gagal mengambil data dashboard.');
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching dashboard:', error);
        toast.error('Error fetching data');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHome();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Removed language and t from dependencies - tidak diperlukan

  // Memoized link wrapper component - mencegah re-render yang tidak perlu
  const LinkWrapper = useCallback(({ section, children, className }) => {
    if (section.isExternal) {
      return (
        <a href={section.link} className={className} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link to={section.link} className={className}>
        {children}
      </Link>
    );
  }, []);

  // Memoized image error handler
  const handleImageError = useCallback((e) => {
    e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop';
  }, []);

  // Loading state
  if (loading) {
    return (
      <>
        <SEO pageKey="home" />
        <div className="bg-black text-white flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  // No data state
  if (!homeData || contentSections.length === 0) {
    return (
      <>
        <SEO pageKey="home" />
        <div className="w-full mx-auto bg-black min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">No data available</div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO pageKey="home" customMeta={dynamicMeta} />
      <div className="w-full mx-auto bg-black">
        {contentSections.map((section, index) => (
          <div
            key={`${section.type}-${index}`}
            className="relative w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[500px] flex items-center justify-center overflow-hidden group"
            onMouseEnter={() => setHoveredSection(index)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {/* Background Image with improved overlay */}
            <div className="absolute inset-0">
              <img
                src={section.bgImage}
                alt={`background-${section.type}`}
                className="w-full h-full object-cover transition-transform blur-sm sm:blur-md duration-700"
                onError={handleImageError}
                loading="lazy" // Lazy loading untuk performa
              />
              {/* Simplified gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col lg:flex-row justify-center items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6 lg:gap-12 py-8 lg:py-0">
              {/* Image Section */}
              <div className="w-full lg:w-3/5 flex justify-center order-1 lg:order-none">
                <div className="relative group/image w-full max-w-lg lg:max-w-none">
                  <LinkWrapper section={section} className="block relative overflow-hidden rounded-lg sm:rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-105">
                    <img
                      src={section.mainImage}
                      alt={section.title}
                      className="w-full h-56 sm:h-64 md:h-80 lg:h-96 xl:h-[20rem] object-cover transition-transform duration-700 group-hover/image:scale-110"
                      onError={handleImageError}
                      loading="lazy" // Lazy loading untuk performa
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
                  </LinkWrapper>
                </div>
              </div>

              {/* Text Section */}
              <div className="w-full lg:w-2/5 flex flex-col justify-center px-2 text-center lg:text-left order-2 lg:order-none">
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  {/* Tag */}
                  <div className="flex justify-start">
                    <span className="inline-flex px-2 py-1 font-bold bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 italic rounded-md text-xs sm:text-sm tracking-wide shadow-lg">{t[section.tag]}</span>
                  </div>

                  {/* Date with icon */}
                  <div className="flex items-center justify-start gap-2 text-white/90">
                    <Calendar className="w-4 h-4" />
                    <span className="font-semibold text-sm tracking-wide">{section.date}</span>
                  </div>

                  {/* Title */}
                  <div className="space-y-2 sm:space-y-3">
                    <h2 className="text-left text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl xl:w-2xl font-bold text-white leading-tight tracking-tight">{section.title}</h2>

                    {/* Underline decoration */}
                    <div className="flex justify-start">
                      <div className="w-15 sm:w-25 h-1 bg-gradient-to-r from-amber-500 to-transparent rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animation indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className={`w-8 sm:w-12 h-0.5 bg-white/30 rounded-full transition-all duration-300 ${hoveredSection === index ? 'bg-white/60 w-12 sm:w-16' : ''}`} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default HomePage;
