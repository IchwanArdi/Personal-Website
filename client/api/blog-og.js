import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const { slug } = req.query;
    const userAgent = req.headers['user-agent'] || '';

    // Hanya jalankan logic ini untuk bot/crawler
    // Untuk user biasa, biarkan client-side routing yang menangani (optional optimization)
    // Tapi untuk simplisitas dan konsistensi, kita serve SSR untuk semua request ke /blog/:slug
    
    // Fetch data blog dari backend
    const apiUrl = process.env.VITE_API_URL || 'https://server-personal-project.vercel.app';
    const response = await fetch(`${apiUrl}/api/blog/detail/${slug}`);
    
    if (!response.ok) {
       // Jika error fetch, fallback ke index.html biasa tanpa inject
       // atau return 404
       const filePath = path.join(process.cwd(), 'index.html');
       if (fs.existsSync(filePath)) {
           const html = fs.readFileSync(filePath, 'utf8');
           return res.status(200).send(html);
       }
       return res.status(404).send('Not found');
    }

    const data = await response.json();
    const blog = data.mainBlog;

    // Baca file index.html original (template)
    // Perlu diperhatikan path-nya saat deployed di Vercel
    const filePath = path.join(process.cwd(), 'index.html');
    let html = fs.readFileSync(filePath, 'utf8');

    if (blog) {
      // Inject Open Graph meta tags
      const title = blog.judul || 'Ichwan - Full Stack Developer';
      const description = blog.konten ? blog.konten.replace(/<[^>]+>/g, ' ').substring(0, 160) + '...' : 'Portfolio pribadi Ichwan';
      const image = blog.gambar || 'https://ichwanardi-nine.vercel.app/og-image.jpg';
      const url = `https://ichwanardi.vercel.app/blog/${slug}`;

      // Replace tags yang ada atau inject baru
      // Strategi: Replace default meta tags yang ada di index.html
      
      // Replace Title
      html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
      
      // Helper function untuk replace meta content
      const replaceMeta = (property, content) => {
        const regex = new RegExp(`<meta property="${property}" content=".*?" />`, 'g');
        if (regex.test(html)) {
           html = html.replace(regex, `<meta property="${property}" content="${content}" />`);
        } else {
           // Jika tidak ada, insert sebelum </head>
           html = html.replace('</head>', `<meta property="${property}" content="${content}" />\n</head>`);
        }
      };

      const replaceNameMeta = (name, content) => {
          const regex = new RegExp(`<meta name="${name}" content=".*?" />`, 'g');
          if (regex.test(html)) {
              html = html.replace(regex, `<meta name="${name}" content="${content}" />`);
          } else {
              html = html.replace('</head>', `<meta name="${name}" content="${content}" />\n</head>`);
          }
      }

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
    return res.status(200).send(html);
    
  } catch (error) {
    console.error('Error generating OG image:', error);
    // Fallback on error
    try {
        const filePath = path.join(process.cwd(), 'index.html');
        const html = fs.readFileSync(filePath, 'utf8');
        return res.status(200).send(html);
    } catch (e) {
        return res.status(500).send('Internal Server Error');
    }
  }
}
