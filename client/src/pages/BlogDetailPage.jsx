import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Calendar, Clock, Tag, ArrowLeft, Share2, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [blogDetailData, setBlogDetailData] = useState(null);

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
  }, [slug, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  // If no data found
  if (!blogDetailData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h2>
          <p className="text-gray-400 mb-6">Artikel yang Anda cari mungkin telah dipindahkan atau dihapus.</p>
          <Link to="/blogs" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Blog
          </Link>
        </div>
      </div>
    );
  }

  const currentUrl = `${window.location.origin}/blog/${slug}`;
  const structuredData = {
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
      url: window.location.origin,
    },
    datePublished: blogDetailData.rawDate,
    dateModified: blogDetailData.rawDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl,
    },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{blogDetailData.title} - Ichwan Blog</title>
        <meta name="description" content={blogDetailData.excerpt} />
        <meta name="keywords" content={`${blogDetailData.category}, blog, artikel, ${blogDetailData.title.split(' ').slice(0, 5).join(', ')}`} />
        <meta name="author" content={blogDetailData.author} />
        <link rel="canonical" href={currentUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blogDetailData.title} />
        <meta property="og:description" content={blogDetailData.excerpt} />
        <meta property="og:image" content={blogDetailData.bgImage} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="Ichwan Blog" />
        <meta property="article:author" content={blogDetailData.author} />
        <meta property="article:published_time" content={blogDetailData.rawDate} />
        <meta property="article:section" content={blogDetailData.category} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blogDetailData.title} />
        <meta name="twitter:description" content={blogDetailData.excerpt} />
        <meta name="twitter:image" content={blogDetailData.bgImage} />
        <meta name="twitter:creator" content="@ichwan" />

        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* Header dengan back button */}
      <div className="sticky top-5 z-50 mb-6 bg-black/80 backdrop-blur-sm ">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link to="/blogs" className="flex font-semibold items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blogs
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
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors ml-auto transform duration-200"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Bagikan</span>
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
                <p className="text-lg text-gray-300 mb-2">Terima kasih telah membaca! 🙏</p>
                <p className="text-gray-500">
                  Dipublikasikan {blogDetailData.date} • {blogDetailData.readTime}
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link berhasil disalin!');
                }}
                className="flex items-center gap-2 bg-yellow-400/10 text-yellow-400 px-6 py-3 rounded-xl hover:bg-yellow-400/20 transition-all duration-300 border border-yellow-400/20 hover:border-yellow-400/40 font-medium"
              >
                <Share2 className="w-4 h-4" />
                Bagikan Artikel
              </button>
            </div>
          </footer>

          {/* More articles section - card style but softer */}
          <section className="bg-gray-900/30 rounded-3xl p-8 border border-gray-800/50">
            <h3 className="text-2xl font-bold mb-3 text-white">Artikel Lainnya</h3>
            <p className="text-gray-400 mb-6">Jelajahi lebih banyak artikel menarik di blog kami</p>
            <Link to="/blogs" className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-xl font-medium hover:bg-yellow-300 transition-all duration-300hover:shadow-lg hover:shadow-yellow-400/25">
              Lihat Semua Artikel
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </section>
        </main>
        <br />
      </div>
    </div>
  );
}

export default BlogDetailPage;
