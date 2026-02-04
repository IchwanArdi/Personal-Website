export default async function handler(req, res) {
  try {
    const { slug } = req.query;
    
    // Fetch data blog dari backend
    const apiUrl = process.env.VITE_API_URL || 'https://server-personal-project.vercel.app';
    const response = await fetch(`${apiUrl}/api/blog/detail/${slug}`);
    
    // Fetch index.html template from the deployment URL
    // We use the deployment URL because reading from FS in Vercel Serverless can be tricky with paths
    const appUrl = 'https://ichwanardi.vercel.app'; 
    const templateResponse = await fetch(appUrl);
    
    if (!templateResponse.ok) {
        throw new Error(`Failed to fetch template: ${templateResponse.statusText}`);
    }
    
    let html = await templateResponse.text();

    if (!response.ok) {
       // Jika error fetch blog, return index.html original
       return res.status(200).send(html);
    }

    const data = await response.json();
    const blog = data.mainBlog;

    if (blog) {
      // Inject Open Graph meta tags
      const title = blog.judul || 'Ichwan - Full Stack Developer';
      // Strip HTML tags for description
      const description = blog.konten ? blog.konten.replace(/<[^>]+>/g, ' ').substring(0, 160).trim() + '...' : 'Portfolio pribadi Ichwan';
      const image = blog.gambar || 'https://ichwanardi-nine.vercel.app/og-image.jpg';
      const url = `https://ichwanardi.vercel.app/blog/${slug}`;

      // Helper function untuk replace atau inject meta tag yang lebih robust
      // Menghandle variasi spasi dan urutan atribut
      const replaceMeta = (property, content) => {
        // Regex untuk match <meta property="..." content="..." /> ATAU <meta content="..." property="..." />
        // Flag 'i' untuk case-insensitive, 's' (dotAll) tidak perlu karena biasanya satu baris
        const regex = new RegExp(`<meta\\s+(?:property="${property}"\\s+content="[^"]*"|content="[^"]*"\\s+property="${property}")\\s*\/?>`, 'gi');
        
        if (regex.test(html)) {
           html = html.replace(regex, `<meta property="${property}" content="${content}" />`);
        } else {
           html = html.replace('</head>', `<meta property="${property}" content="${content}" />\n</head>`);
        }
      };

      const replaceNameMeta = (name, content) => {
          const regex = new RegExp(`<meta\\s+(?:name="${name}"\\s+content="[^"]*"|content="[^"]*"\\s+name="${name}")\\s*\/?>`, 'gi');
          if (regex.test(html)) {
              html = html.replace(regex, `<meta name="${name}" content="${content}" />`);
          } else {
              html = html.replace('</head>', `<meta name="${name}" content="${content}" />\n</head>`);
          }
      }

      // Hapus tag dimensi gambar bawaan agar tidak konflik jika gambar blog berbeda ukuran
      html = html.replace(/<meta property="og:image:width" content="[^"]*" \/>/gi, '');
      html = html.replace(/<meta property="og:image:height" content="[^"]*" \/>/gi, '');

      // Replace Title
      html = html.replace(/<title>.*?<\/title>/gi, `<title>${title}</title>`);

      // OG Tags
      replaceMeta('og:title', title);
      replaceMeta('og:description', description);
      replaceMeta('og:image', image);
      replaceMeta('og:url', url);
      replaceMeta('og:type', 'article');

      // Twitter Tags
      replaceNameMeta('twitter:title', title);
      replaceNameMeta('twitter:description', description);
      replaceNameMeta('twitter:image', image);
      replaceNameMeta('twitter:url', url);
      
      // Basic Meta
      replaceNameMeta('description', description);
    }

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=59');
    return res.status(200).send(html);
    
  } catch (error) {
    console.error('Error generating OG image:', error);
    return res.status(500).json({ 
        error: 'Internal Server Error', 
        details: error.message 
    });
  }
}
