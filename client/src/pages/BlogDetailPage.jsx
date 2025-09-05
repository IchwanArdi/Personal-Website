import { useState, useEffect } from 'react';
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

  const { language } = useApp();
  const t = DETAILBLOG[language];

  // Helper function to format date
  const formatDate = (dateString) => {
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
  };

  // Helper function to create excerpt from content
  const createExcerpt = (content, maxLength = 160) => {
    if (!content) return '';
    const plainText = content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText;
  };

  // Helper function to render HTML content safely
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  useEffect(() => {
    if (!slug) {
      toast.error('Slug blog tidak ditemukan');
      navigate('/blogs');
      return;
    }

    const fetchDetailBlog = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/detail/${slug}`, {
          credentials: 'include',
        });

        const result = await response.json();

        const getReadTime = (content) => {
          if (!content) return '1 min read';
          const plainText = content.replace(/<[^>]+>/g, ' ');
          const words = plainText.trim().split(/\s+/).length;
          const minutes = Math.max(1, Math.ceil(words / 200));
          return `${minutes} min read`;
        };

        if (response.ok) {
          if (result.mainBlog) {
            const transformedBlog = {
              bgImage: result.mainBlog.gambar,
              title: result.mainBlog.judul,
              content: result.mainBlog.konten,
              date: formatDate(result.mainBlog.tanggal),
              rawDate: result.mainBlog.tanggal,
              category: result.mainBlog.kategori,
              readTime: getReadTime(result.mainBlog.konten),
              author: 'Ichwan',
              excerpt: createExcerpt(result.mainBlog.konten),
              slug: slug,
              // Data untuk meta helpers
              judul: result.mainBlog.judul,
              kategori: result.mainBlog.kategori,
              tanggal: result.mainBlog.tanggal,
              gambar: result.mainBlog.gambar,
              description: createExcerpt(result.mainBlog.konten),
            };
            setBlogDetailData(transformedBlog);
          } else {
            toast.error('Blog tidak ditemukan');
            navigate('/blogs');
          }
        } else {
          toast.error(result.message || 'Gagal mengambil data blog.');
          navigate('/blogs');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('Error fetching data');
        navigate('/blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchDetailBlog();
  }, [slug, navigate, language, t]);

  // Loading state
  if (loading) {
    return (
      <>
        <SEO pageKey="blogs" />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-300"></p>
          </div>
        </div>
      </>
    );
  }

  // If no data found
  if (!blogDetailData) {
    return (
      <>
        <SEO pageKey="blogs" />
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t.noBlog}</h2>
            <p className="text-gray-400 mb-6">{t.noBlogInfo}</p>
            <Link to="/blogs" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t.backToBlogs}
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Generate blog meta langsung seperti di HomePage
  const dynamicMeta = {
    title: blogDetailData.title,
    description: blogDetailData.excerpt,
    image: blogDetailData.bgImage,
    url: `/blog/${slug}`,
    type: 'article',
    keywords: `${blogDetailData.category}, blog, artikel, ${blogDetailData.title}`,
    publishedTime: blogDetailData.rawDate,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO customMeta={dynamicMeta}>
        {/* Structured Data for Blog Post */}
        <script type="application/ld+json">
          {JSON.stringify({
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
          })}
        </script>
      </SEO>

      {/* Header dengan back button */}
      <div className="sticky top-5 z-30 mb-6 bg-black/80 backdrop-blur-sm ">
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
            <span className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-yellow-400/20">
              <Tag className="w-3 h-3" />
              {blogDetailData.category}
            </span>
          </div>

          {/* Title - more natural spacing */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 leading-relaxed text-white">{blogDetailData.title}</h1>

          {/* Meta info - cleaner, less boxed */}
          <div className="flex flex-wrap items-center gap-6 mb-12 text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-yellow-400" />
              <span>{blogDetailData.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span>{blogDetailData.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-yellow-400" />
              <span>{blogDetailData.author}</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link berhasil disalin!');
              }}
              className="hidden md:flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors ml-auto transform duration-200"
            >
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
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
            </div>
          )}

          {/* Article content - clean and readable */}
          <article className="mb-16">
            <div
              className="prose prose-invert prose-lg max-w-none blog-content"
              style={{
                fontSize: '18px',
                lineHeight: '1.8',
                color: '#e2e8f0',
              }}
              dangerouslySetInnerHTML={createMarkup(blogDetailData.content)}
            />
          </article>

          {/* Article footer - subtle separator */}
          <footer className="border-t border-gray-800 pt-12 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-lg text-gray-300 mb-2">{t.thankForReading} 🙏</p>
                <p className="text-gray-500">
                  {t.publicationDate} {blogDetailData.date} • {blogDetailData.readTime}
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link berhasil disalin!');
                }}
                className="flex items-center gap-2 text-yellow-400 px-6 py-3 rounded-xl hover:bg-yellow-400/20 transition-all duration-300 border border-yellow-400/20 hover:border-yellow-400/40 font-medium"
              >
                <Share2 className="w-4 h-4" />
                {t.shareArticle}
              </button>
            </div>
          </footer>

          {/* Navigation to other projects */}
          <div className="mx-16 pt-8 border-t border-gray-800/50">
            <div className="text-center">
              <Link to="/blogs" className="inline-flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-6 py-3 rounded-lg transition-all">
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
