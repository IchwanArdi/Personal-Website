import { useState, useEffect } from 'react';
import { Search, Calendar, ArrowRight, Tag } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BLOGS } from '../utils/constants';
import { useApp } from '../contexts/AppContext';

function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [blogData, setBlogData] = useState([]);

  const { language, isDarkMode } = useApp();
  const t = BLOGS[language];

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

    if (cleanText.length <= maxLength) return cleanText;

    // Truncate and add ellipsis
    return cleanText.substring(0, maxLength).trim() + '...';
  };

  useEffect(() => {
    const fetchBlog = async () => {
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
              content: blog.konten,
              date: formatDate(blog.tanggal),
              category: blog.kategori,
              readTime: getReadTime(blog.konten),
              excerpt: createExcerpt(blog.konten, 150),
              featured: false,
              slug: blog.slug || createSlug(blog.judul),
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
  }, [language, t]);

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

  // Generate dynamic meta for SEO
  const generateBlogsMeta = () => {
    let dynamicDescription = 'Artikel dan tulisan terbaru dari Ichwan tentang teknologi, web development, tips programming, dan pengalaman sebagai developer.';
    let dynamicKeywords = 'Blog, Artikel, Web Development, Programming Tips, JavaScript, React, Tutorial';
    let dynamicImage = '/og-image.jpg'; // default image

    // Customize based on search/filter state
    if (searchTerm) {
      dynamicDescription = `Pencarian blog untuk "${searchTerm}" - ${dynamicDescription}`;
      dynamicKeywords = `${searchTerm}, ${dynamicKeywords}`;
    }

    if (selectedCategory && selectedCategory !== 'ALL') {
      dynamicDescription = `Artikel kategori ${selectedCategory} - ${dynamicDescription}`;
      dynamicKeywords = `${selectedCategory}, ${dynamicKeywords}`;
    }

    // Use featured article image if available
    if (featuredItem?.bgImage) {
      dynamicImage = featuredItem.bgImage;
    }

    return {
      title: searchTerm ? `Pencarian: ${searchTerm} - Blog` : selectedCategory && selectedCategory !== 'ALL' ? `${selectedCategory} - Blog` : 'Blog',
      description: dynamicDescription,
      keywords: dynamicKeywords,
      image: dynamicImage,
      url: '/blogs',
    };
  };

  // Loading state
  if (loading) {
    return (
      <>
        <SEO pageKey="blogs" />
        <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading blogs...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <SEO customMeta={generateBlogsMeta()}>
        {/* Structured Data untuk Blog List */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Ichwan Blog',
            description: 'Blog pribadi Ichwan tentang web development, programming, dan teknologi',
            url: typeof window !== 'undefined' ? `${window.location.origin}/blogs` : '',
            author: {
              '@type': 'Person',
              name: 'Ichwan',
            },
            blogPost: filteredContent.slice(0, 5).map((blog) => ({
              '@type': 'BlogPosting',
              headline: blog.title,
              description: blog.excerpt,
              image: blog.bgImage,
              datePublished: blog.date,
              author: {
                '@type': 'Person',
                name: 'Ichwan',
              },
              url: typeof window !== 'undefined' ? `${window.location.origin}/blog/${blog.slug}` : '',
            })),
          })}
        </script>
      </SEO>

      {/* Search Bar */}
      <div className="w-full flex justify-center pt-8 pb-4">
        <div className="relative w-full max-w-2xl mx-4">
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border rounded-lg py-3 pl-12 pr-4 transition-colors focus:outline-none focus:border-yellow-500 ${
              isDarkMode ? 'bg-transparent border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
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
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                selectedCategory === category ? 'text-yellow-500 border-b-2 border-yellow-500' : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
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
            <Link to={`/blog/${featuredItem.slug}`}>
              <div
                className={`group relative overflow-hidden rounded-3xl backdrop-blur-sm border transition-all duration-500 cursor-pointer ${
                  isDarkMode ? 'bg-gray-900/70 md:bg-gray-900/30 border-gray-700/30 hover:border-yellow-400/30' : 'bg-white/70 md:bg-white/10 shadow-md border-gray-600/30 hover:border-yellow-500/40'
                }`}
              >
                <div className="lg:flex">
                  {/* Left Side Image */}
                  <div className="lg:w-3/5 relative">
                    <div className="relative overflow-hidden h-80 lg:h-96">
                      <img src={featuredItem.bgImage} alt="Featured content" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/60" />
                      <div className="absolute top-6 left-6">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-full text-sm font-bold">{t.newPost}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side Content */}
                  <div className="lg:w-2/5 py-8 px-4 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="flex items-center gap-2 text-yellow-500 text-sm font-medium">
                        <Calendar className="w-4 h-4" />
                        {featuredItem.date}
                      </span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm>
                        •
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{featuredItem.readTime}</span>
                    </div>

                    <span className="inline-flex items-center gap-2 text-yellow-500 text-sm font-medium mb-3">
                      <Tag className="w-4 h-4" />
                      {featuredItem.category}
                    </span>

                    <h2 className={`text-3xl lg:text-4xl font-bold mb-4 leading-tight group-hover:text-yellow-500 transition-colors duration-300 ${isDarkMode ? 'group-hover:text-yellow-200' : 'group-hover:text-yellow-600'}`}>
                      {featuredItem.title}
                    </h2>

                    <p className={`text-lg mb-6 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{featuredItem.excerpt}</p>

                    <button className="flex items-center gap-2 text-yellow-500 font-medium hover:text-yellow-400 transition-colors group/btn">
                      {t.readMore}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Other Articles Grid */}
        {otherItems.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-8 border-l-4 border-yellow-500 pl-4">{t.moreArticles}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherItems.map((item, index) => (
                <Link key={index} to={`/blog/${item.slug}`}>
                  <article className="group cursor-pointer">
                    <div
                      className={`backdrop-blur-sm rounded-2xl overflow-hidden border transition-all duration-500 hover:transform ${
                        isDarkMode ? 'bg-gray-900/70 md:bg-gray-900/30 border-gray-700/30 hover:border-yellow-400/40' : 'bg-white/70 md:bg-white/10 border-gray-600/30 hover:border-yellow-500/50'
                      }`}
                    >
                      <div className="relative overflow-hidden">
                        <img src={item.bgImage} alt={item.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-black/70 backdrop-blur-sm text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">{item.category}</span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`flex items-center gap-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </span>
                          <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>•</span>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.readTime}</span>
                        </div>

                        <h3 className={`text-xl font-bold mb-3 leading-tight group-hover:text-yellow-500 transition-colors duration-300 line-clamp-2 ${isDarkMode ? 'group-hover:text-yellow-200' : 'group-hover:text-yellow-600'}`}>
                          {item.title}
                        </h3>

                        <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.excerpt}</p>

                        <button className="flex items-center gap-2 text-yellow-500 text-sm font-medium hover:text-yellow-400 transition-colors group/btn">
                          {t.readArticle}
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
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <Search className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t.noResults}</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{blogData.length === 0 ? t.information : t.information}</p>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}

export default BlogsPage;
