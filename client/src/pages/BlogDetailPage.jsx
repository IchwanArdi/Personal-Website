import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Calendar, Clock, Tag, ArrowLeft, Share2, User } from 'lucide-react';
import SEO from '../components/SEO';
import { useApp } from '../contexts/AppContext';
import { DETAILBLOG } from '../utils/constants';

function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [blogDetailData, setBlogDetailData] = useState(null);

  const { language, isDarkMode } = useApp();

  // Memoized translations untuk menghindari re-referencing
  const t = useMemo(() => DETAILBLOG[language], [language]);

  // Helper function to format date - dibuat callback untuk optimasi
  const formatDate = useCallback((dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch (error) {
      console.error(error);
      return dateString;
    }
  }, []);

  // Helper function to create excerpt - optimized dengan memoization
  const createExcerpt = useCallback((content, maxLength = 160) => {
    if (!content) return '';
    const plainText = content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText;
  }, []);

  // Helper function to render HTML content safely
  const createMarkup = useCallback((htmlContent) => {
    return { __html: htmlContent };
  }, []);

  // Calculate read time - extracted dan optimized
  const getReadTime = useCallback((content) => {
    if (!content) return '1 min read';
    const plainText = content.replace(/<[^>]+>/g, ' ');
    const words = plainText.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  }, []);

  // Share functionality - callback untuk menghindari re-creation
  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link berhasil disalin!');
  }, []);

  // Handle image error - callback untuk optimasi
  const handleImageError = useCallback((e) => {
    e.target.style.display = 'none';
  }, []);

  // Fetch blog detail - optimized dengan useCallback
  const fetchDetailBlog = useCallback(async () => {
    if (!slug) {
      toast.error('Slug blog tidak ditemukan');
      navigate('/blogs', { replace: true });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/detail/${slug}`, {
        credentials: 'include',
      });

      const result = await response.json();

      if (response.ok && result.mainBlog) {
        const mainBlog = result.mainBlog;
        const transformedBlog = {
          bgImage: mainBlog.gambar,
          title: mainBlog.judul,
          content: mainBlog.konten,
          date: formatDate(mainBlog.tanggal),
          rawDate: mainBlog.tanggal,
          category: mainBlog.kategori,
          readTime: getReadTime(mainBlog.konten),
          author: 'Ichwan',
          excerpt: createExcerpt(mainBlog.konten),
          slug: slug,
          // Data untuk meta helpers
          judul: mainBlog.judul,
          kategori: mainBlog.kategori,
          tanggal: mainBlog.tanggal,
          gambar: mainBlog.gambar,
          description: createExcerpt(mainBlog.konten),
        };
        setBlogDetailData(transformedBlog);
      } else {
        toast.error('Blog tidak ditemukan');
        navigate('/blogs', { replace: true });
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Error fetching data');
      navigate('/blogs', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [slug, navigate, formatDate, getReadTime, createExcerpt]);

  useEffect(() => {
    fetchDetailBlog();
  }, [fetchDetailBlog]);

  // Memoized class names untuk performa
  const containerClass = useMemo(() => `min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`, [isDarkMode]);

  const stickyHeaderClass = useMemo(() => `sticky top-5 z-30 mb-6 backdrop-blur-sm ${isDarkMode ? 'bg-black/80' : 'bg-white/80'}`, [isDarkMode]);

  const metaInfoClass = useMemo(() => `flex flex-wrap items-center gap-6 mb-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`, [isDarkMode]);

  const titleClass = useMemo(() => `text-3xl sm:text-4xl md:text-5xl font-bold mb-8 leading-relaxed ${isDarkMode ? 'text-white' : 'text-gray-900'}`, [isDarkMode]);

  const footerBorderClass = useMemo(() => `border-t pt-12 pb-8 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`, [isDarkMode]);

  // Memoized dynamic meta untuk SEO
  const dynamicMeta = useMemo(() => {
    if (!blogDetailData) return null;

    return {
      title: blogDetailData.title,
      description: blogDetailData.excerpt,
      image: blogDetailData.bgImage,
      url: `/blog/${slug}`,
      type: 'article',
      keywords: `${blogDetailData.category}, blog, artikel, ${blogDetailData.title}`,
      publishedTime: blogDetailData.rawDate,
    };
  }, [blogDetailData, slug]);

  // Memoized structured data untuk SEO
  const structuredData = useMemo(() => {
    if (!blogDetailData) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blogDetailData.title,
      description: blogDetailData.excerpt,
      image: blogDetailData.bgImage,
      author: {
        '@type': 'Person',
        name: blogDetailData.author,
      },
      publisher: {
        '@type': 'Person',
        name: 'Ichwan',
        url: typeof window !== 'undefined' ? window.location.origin : '',
      },
      datePublished: blogDetailData.rawDate,
      dateModified: blogDetailData.rawDate,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : '',
      },
    };
  }, [blogDetailData, slug]);

  // Memoized loading component
  const LoadingComponent = useMemo(
    () => (
      <>
        <SEO pageKey="blogs" />
        <div className={containerClass}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Loading...</p>
            </div>
          </div>
        </div>
      </>
    ),
    [containerClass, isDarkMode]
  );

  // Memoized not found component
  const NotFoundComponent = useMemo(
    () => (
      <>
        <SEO pageKey="blogs" />
        <div className={containerClass}>
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">{t.noBlog}</h2>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.noBlogInfo}</p>
              <Link to="/blogs" className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                {t.backToBlogs}
              </Link>
            </div>
          </div>
        </div>
      </>
    ),
    [containerClass, isDarkMode, t.noBlog, t.noBlogInfo, t.backToBlogs]
  );

  // Early returns untuk loading dan not found
  if (loading) return LoadingComponent;
  if (!blogDetailData) return NotFoundComponent;

  return (
    <div className={containerClass}>
      <SEO customMeta={dynamicMeta}>
        {/* Structured Data for Blog Post */}
        {structuredData && <script type="application/ld+json">{JSON.stringify(structuredData)}</script>}
      </SEO>

      {/* Header dengan back button */}
      <div className={stickyHeaderClass}>
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link to="/blogs" className="flex font-semibold items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t.backToBlogs}
          </Link>
        </div>
      </div>

      <div className="relative z-10">
        {/* Main content */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Category badge - floating style */}
          <div className="">
            <span className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-500 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-yellow-400/20">
              <Tag className="w-3 h-3" />
              {blogDetailData.category}
            </span>
          </div>

          {/* Title - more natural spacing */}
          <h1 className={titleClass}>{blogDetailData.title}</h1>

          {/* Meta info - cleaner, less boxed */}
          <div className={metaInfoClass}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-yellow-500" />
              <span>{blogDetailData.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span>{blogDetailData.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-yellow-500" />
              <span>{blogDetailData.author}</span>
            </div>
            <button onClick={handleShare} className="hidden md:flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors ml-auto transform duration-200">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{t.share}</span>
            </button>
          </div>

          {/* Featured image - more organic shape */}
          {blogDetailData.bgImage && (
            <div className="mb-12">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src={blogDetailData.bgImage}
                  alt={blogDetailData.title}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover transition-transform duration-700 hover:scale-110"
                  onError={handleImageError}
                  loading="lazy" // Lazy loading untuk performa
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
            </div>
          )}

          {/* Article content - clean and readable */}
          <article className="mb-16">
            <div
              className={`prose prose-lg max-w-none blog-content ${isDarkMode ? 'prose-invert' : 'prose-gray'}`}
              style={{
                fontSize: '18px',
                lineHeight: '1.8',
                color: isDarkMode ? '#e2e8f0' : '#374151',
              }}
              dangerouslySetInnerHTML={createMarkup(blogDetailData.content)}
            />
          </article>

          {/* Article footer - subtle separator */}
          <footer className={footerBorderClass}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className={`text-lg mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t.thankForReading} 🙏</p>
                <p className={isDarkMode ? 'text-gray-500' : 'text-gray-600'}>
                  {t.publicationDate} {blogDetailData.date} • {blogDetailData.readTime}
                </p>
              </div>
              <button
                onClick={handleShare}
                className={`flex items-center gap-2 text-yellow-500 px-6 py-3 rounded-xl transition-all duration-300 border border-yellow-400/20 hover:border-yellow-400/40 font-medium ${
                  isDarkMode ? 'hover:bg-yellow-400/20' : 'hover:bg-yellow-400/10'
                }`}
              >
                <Share2 className="w-4 h-4" />
                {t.shareArticle}
              </button>
            </div>
          </footer>

          {/* Navigation to other projects */}
          <div className={`mx-16 pt-8 border-t ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
            <div className="text-center">
              <Link
                to="/blogs"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                  isDarkMode ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                {t.viewAllBlogs}
              </Link>
            </div>
          </div>
        </main>
        <br />
      </div>
    </div>
  );
}

export default BlogDetailPage;
