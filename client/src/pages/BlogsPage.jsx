import { useState, useEffect } from 'react';
import { Search, Calendar, ArrowRight, Tag } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(false); // Fixed: was string 'false', should be boolean
  const [blogData, setBlogData] = useState([]); // Initialize as empty array

  // Helper function to create slug from title
  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)}`;
    } catch (error) {
      console.error('Error fetching blog:', error);
      return dateString; // Return original if formatting fails
    }
  };

  // Helper function to strip HTML tags and create clean excerpt
  const createExcerpt = (htmlContent, maxLength = 150) => {
    if (!htmlContent) return 'No excerpt available';

    // Remove HTML tags
    const textOnly = htmlContent.replace(/<[^>]*>/g, '');

    // Remove extra whitespace and newlines
    const cleanText = textOnly.replace(/\s+/g, ' ').trim();

    // Remove emoji or special characters if needed (optional)
    // const noEmoji = cleanText.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');

    if (cleanText.length <= maxLength) return cleanText;

    // Truncate and add ellipsis
    return cleanText.substring(0, maxLength).trim() + '...';
  };

  useEffect(() => {
    const fetchBlog = async () => {
      // Fixed typo: fecthBlog -> fetchBlog
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog`, {
          credentials: 'include',
        });

        const result = await response.json();

        // Helper function to calculate read time based on word count
        const getReadTime = (content) => {
          if (!content) return '1 min read';

          // hapus semua tag HTML
          const plainText = content.replace(/<[^>]+>/g, ' ');
          // hitung jumlah kata
          const words = plainText.trim().split(/\s+/).length;
          // rata-rata orang baca 200 kata/menit
          const minutes = Math.max(1, Math.ceil(words / 200));

          return `${minutes} min read`;
        };

        if (response.ok) {
          // Transform the data to match expected format
          if (result.Blogs && Array.isArray(result.Blogs)) {
            const transformedBlogs = result.Blogs.map((blog) => ({
              bgImage: blog.gambar,
              title: blog.judul,
              content: blog.konten, // Fixed typo: contect -> content
              date: formatDate(blog.tanggal),
              category: blog.kategori,
              readTime: getReadTime(blog.konten), // baru
              excerpt: createExcerpt(blog.konten, 150), // Use helper function to create clean excerpt
              featured: false, // You can add logic to determine featured posts
              slug: blog.slug || createSlug(blog.judul), // Generate slug if not exists
            }));

            // Mark first post as featured if exists
            if (transformedBlogs.length > 0) {
              transformedBlogs[0].featured = true;
            }

            setBlogData(transformedBlogs);
          } else {
            setBlogData([]);
          }
        } else {
          toast.error(result.message || 'Gagal mengambil data blog.');
          setBlogData([]);
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('Error fetching data');
        setBlogData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, []);

  // Get unique categories from blog data
  const getCategories = () => {
    const categories = ['ALL'];
    const uniqueCategories = [...new Set(blogData.map((blog) => blog.category).filter(Boolean))];
    return [...categories, ...uniqueCategories];
  };

  const categories = getCategories();

  // Filter content based on search and category
  const filteredContent = blogData.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || item.category?.toLowerCase().includes(searchTerm.toLowerCase()) || item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredItem = filteredContent.find((item) => item.featured) || filteredContent[0];
  const otherItems = filteredContent.filter((item) => item !== featuredItem);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950/90 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950/90 text-white">
      {/* Search Bar */}
      <div className="w-full flex justify-center pt-8 pb-4">
        <div className="relative w-full max-w-2xl mx-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border border-gray-600 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center pb-8">
        <div className="flex flex-wrap gap-4 px-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${selectedCategory === category ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Featured Article */}
        {featuredItem && (
          <div className="mb-16">
            <Link to={`/blog/${encodeURIComponent(featuredItem.title)}`}>
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/30 hover:border-yellow-400/30 transition-all duration-500 cursor-pointer">
                <div className="lg:flex">
                  {/* Left Side Image */}
                  <div className="lg:w-3/5 relative">
                    <div className="relative overflow-hidden h-80 lg:h-96">
                      <img src={featuredItem.bgImage} alt="Featured content" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/60" />
                      <div className="absolute top-6 left-6">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-full text-sm font-bold">FEATURED</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side Content */}
                  <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="flex items-center gap-2 text-yellow-400 text-sm font-medium">
                        <Calendar className="w-4 h-4" />
                        {featuredItem.date}
                      </span>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-400 text-sm">{featuredItem.readTime}</span>
                    </div>

                    <span className="inline-flex items-center gap-2 text-yellow-400 text-sm font-medium mb-3">
                      <Tag className="w-4 h-4" />
                      {featuredItem.category}
                    </span>

                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight group-hover:text-yellow-200 transition-colors duration-300">{featuredItem.title}</h2>

                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">{featuredItem.excerpt}</p>

                    <button className="flex items-center gap-2 text-yellow-400 font-medium hover:text-yellow-300 transition-colors group/btn">
                      Read More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>{' '}
              {/* ← ini div yang hilang di kode kamu */}
            </Link>
          </div>
        )}

        {/* Other Articles Grid */}
        {otherItems.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-8">More Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherItems.map((item, index) => (
                <Link key={index} to={`/blog/${item.slug}`}>
                  <article className="group cursor-pointer">
                    <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/20 hover:border-yellow-400/30 transition-all duration-500 hover:transform">
                      <div className="relative overflow-hidden">
                        <img src={item.bgImage} alt={item.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-black/70 backdrop-blur-sm text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">{item.category}</span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="flex items-center gap-1 text-gray-400 text-sm">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-400 text-sm">{item.readTime}</span>
                        </div>

                        <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-yellow-200 transition-colors duration-300 line-clamp-2">{item.title}</h3>

                        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{item.excerpt}</p>

                        <button className="flex items-center gap-2 text-yellow-400 text-sm font-medium hover:text-yellow-300 transition-colors group/btn">
                          Read Article
                          <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredContent.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No articles found</h3>
            <p className="text-gray-400">{blogData.length === 0 ? 'No blog posts available at the moment' : 'Try adjusting your search or filter criteria'}</p>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}

export default BlogsPage;
