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
      <div className="min-h-screen bg-slate-950/90 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading article...</p>
        </div>
      </div>
    );
  }

  // If no data found
  if (!blogDetailData) {
    return (
      <div className="min-h-screen bg-slate-950/90 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <Link to="/blogs" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950/90 text-white">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Blogs
        </Link>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-6">
        {/* Category Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium border border-yellow-400/20">
            <Tag className="w-4 h-4" />
            {blogDetailData.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{blogDetailData.title}</h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{blogDetailData.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{blogDetailData.readTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>By {blogDetailData.author}</span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied to clipboard!');
            }}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors ml-auto"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {/* Featured Image */}
        {blogDetailData.bgImage && (
          <div className="mb-2">
            <div className="relative overflow-hidden rounded-2xl bg-gray-800/50">
              <img
                src={blogDetailData.bgImage}
                alt={blogDetailData.title}
                className="w-full h-64 md:h-96 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none mb-2">
          <div className="blog-content text-gray-200 leading-relaxed" dangerouslySetInnerHTML={createMarkup(blogDetailData.content)} />
        </div>

        {/* Article Footer */}
        <div className="border-t border-gray-700/50 pt-8 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 mb-2">Thank you for reading!</p>
              <p className="text-sm text-gray-500">
                Published on {blogDetailData.date} • {blogDetailData.readTime}
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
              }}
              className="flex items-center gap-2 bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-400/20 transition-colors border border-yellow-400/20"
            >
              <Share2 className="w-4 h-4" />
              Share Article
            </button>
          </div>
        </div>

        {/* Navigation to other articles */}
        <div className="bg-gray-800/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">More Articles</h3>
          <Link to="/blogs" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors">
            Explore all blog posts
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
        <br />
      </article>
    </div>
  );
}

export default BlogDetailPage;
