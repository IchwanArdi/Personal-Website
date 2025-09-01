export const DEFAULT_META = {
  siteName: 'Ichwan Portfolio',
  siteUrl: 'https://ichwanardi-nine.vercel.app', // Ganti dengan domain Anda
  author: 'Ichwan',
  image: '/og-image.jpg', // Default OG image
  twitterHandle: '@yourtwitterhandle', // Ganti dengan Twitter handle Anda
};

// Function untuk generate meta tags untuk setiap halaman
export const generatePageMeta = ({ title, description, image, url, type = 'website', keywords, publishedTime, modifiedTime }) => {
  const fullTitle = title ? `${title} | ${DEFAULT_META.siteName}` : DEFAULT_META.siteName;
  const fullUrl = url ? `${DEFAULT_META.siteUrl}${url}` : DEFAULT_META.siteUrl;
  const fullImage = image ? (image.startsWith('http') ? image : `${DEFAULT_META.siteUrl}${image}`) : `${DEFAULT_META.siteUrl}${DEFAULT_META.image}`;

  return {
    title: fullTitle,
    meta: [
      // Basic Meta
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'author', content: DEFAULT_META.author },
      { name: 'robots', content: 'index, follow' },

      // Open Graph
      { property: 'og:type', content: type },
      { property: 'og:title', content: title || DEFAULT_META.siteName },
      { property: 'og:description', content: description },
      { property: 'og:image', content: fullImage },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: fullUrl },
      { property: 'og:site_name', content: DEFAULT_META.siteName },
      { property: 'og:locale', content: 'id_ID' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title || DEFAULT_META.siteName },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: fullImage },
      { name: 'twitter:url', content: fullUrl },
      { name: 'twitter:creator', content: DEFAULT_META.twitterHandle },

      // Article specific (untuk blog)
      ...(type === 'article' && publishedTime
        ? [
            { property: 'article:published_time', content: publishedTime },
            { property: 'article:author', content: DEFAULT_META.author },
          ]
        : []),

      ...(type === 'article' && modifiedTime ? [{ property: 'article:modified_time', content: modifiedTime }] : []),
    ].filter(Boolean),
  };
};

// Pre-defined meta untuk setiap halaman
export const PAGE_METAS = {
  home: {
    title: 'Home',
    description: 'Portfolio pribadi Ichwan - Full Stack Developer yang berpengalaman dalam JavaScript, React, Node.js, dan teknologi web modern lainnya.',
    keywords: 'Ichwan, Full Stack Developer, JavaScript, React, Node.js, Web Developer, Portfolio, Home',
    url: '/',
  },

  about: {
    title: 'Tentang Saya',
    description: 'Kenali lebih dekat Ichwan, seorang Full Stack Developer dengan passion dalam menciptakan solusi web yang inovatif dan user-friendly.',
    keywords: 'Tentang Ichwan, About, Full Stack Developer, Profil, CV, Resume',
    url: '/about',
  },

  projects: {
    title: 'Projects',
    description: 'Kumpulan project dan karya terbaik Ichwan dalam bidang web development, mulai dari aplikasi web hingga sistem kompleks.',
    keywords: 'Projects, Portfolio, Web Development, JavaScript, React, Node.js, Karya',
    url: '/projects',
  },

  blogs: {
    title: 'Blog',
    description: 'Artikel dan tulisan terbaru dari Ichwan tentang teknologi, web development, tips programming, dan pengalaman sebagai developer.',
    keywords: 'Blog, Artikel, Web Development, Programming Tips, JavaScript, React, Tutorial',
    url: '/blogs',
  },

  contact: {
    title: 'Kontak',
    description: 'Hubungi Ichwan untuk kolaborasi project, konsultasi web development, atau sekadar diskusi tentang teknologi.',
    keywords: 'Kontak, Contact, Hire, Freelance, Web Developer, Konsultasi',
    url: '/contact',
  },
};

// Function untuk blog detail
export const generateBlogMeta = (blogData) => {
  if (!blogData) return PAGE_METAS.blogs;

  return {
    title: blogData.title || blogData.judul,
    description: blogData.excerpt || blogData.description || `Artikel terbaru dari Ichwan tentang ${blogData.kategori || 'web development'}. Baca selengkapnya di blog portfolio Ichwan.`,
    keywords: `${blogData.kategori || 'Web Development'}, Blog, Artikel, ${blogData.title || blogData.judul}, Ichwan`,
    url: `/blog/${encodeURIComponent(blogData.judul || blogData.title)}`,
    image: blogData.gambar || blogData.image,
    type: 'article',
    publishedTime: blogData.tanggal ? new Date(blogData.tanggal).toISOString() : undefined,
  };
};

// Function untuk project detail
export const generateProjectMeta = (projectData) => {
  if (!projectData) return PAGE_METAS.projects;

  return {
    title: projectData.title,
    description: projectData.deskripsi || projectData.description || `Project ${projectData.title} - Salah satu karya terbaik Ichwan dalam bidang web development.`,
    keywords: `${projectData.title}, Project, Portfolio, Web Development, ${projectData.teknologi?.join(', ') || 'JavaScript, React'}`,
    url: `/project/${encodeURIComponent(projectData.title)}`,
    image: projectData.gambar || projectData.image,
  };
};
