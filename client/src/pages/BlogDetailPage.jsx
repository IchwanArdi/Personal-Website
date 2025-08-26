import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react';

function BlogDetailPage() {
  const { judul } = useParams(); // Get judul from URL params
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [blogDetailData, setBlogDetailData] = useState(null); // Single blog object, not array

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

  // Helper function to render HTML content safely
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  useEffect(() => {
    if (!judul) {
      toast.error('Judul blog tidak ditemukan');
      navigate('/blogs');
      return;
    }

    const fetchDetailBlog = async () => {
      setLoading(true);
      try {
        // Updated API call to match backend route
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/detail/${encodeURIComponent(judul)}`, {
          credentials: 'include',
        });

        const result = await response.json();

        if (response.ok) {
          // Handle single blog object response
          if (result.mainBlog) {
            const transformedBlog = {
              bgImage: result.mainBlog.gambar,
              title: result.mainBlog.judul,
              content: result.mainBlog.konten,
              date: formatDate(result.mainBlog.tanggal),
              category: result.mainBlog.kategori,
              readTime: `${Math.max(1, Math.ceil((result.mainBlog.konten?.length || 0) / 1000))} min read`,
              author: 'Ichwan', // You can add author field to your database
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
  }, [judul, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
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
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Floating background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-400/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-400/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header dengan back button */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-4">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-all duration-300 mb-8 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Kembali ke Blog</span>
          </Link>
        </header>

        {/* Main content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Category badge - floating style */}
          <div className="mb-6">
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
              <span>
                Oleh <span className="text-white font-medium">{blogDetailData.author}</span>
              </span>
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
