import express from 'express';
import Blog from '../../models/Blog.js';

const router = express.Router();

const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ tanggal: -1 });

    const blogsWithSlug = blogs.map((blog) => ({
      ...blog.toObject(),
      slug: blog.slug || createSlug(blog.judul),
    }));

    const responseData = {
      success: true,
      Blogs: blogsWithSlug,
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
    });
  }
});

router.get('/detail/:slug', async (req, res) => {
  try {
    const slugParam = req.params.slug;

    let mainBlog = await Blog.findOne({ slug: slugParam }).select('judul slug gambar tanggal ringkasan konten tags kategori').lean();

    if (!mainBlog) {
      const blogs = await Blog.find().select('judul slug gambar tanggal ringkasan konten tags kategori').lean();
      mainBlog = blogs.find((blog) => createSlug(blog.judul) === slugParam);
    }

    if (!mainBlog) {
      const decodedTitle = decodeURIComponent(slugParam.replace(/-/g, ' '));
      mainBlog = await Blog.findOne({
        judul: { $regex: new RegExp(`^${decodedTitle}$`, 'i') },
      })
        .select('judul slug gambar tanggal ringkasan konten tags kategori')
        .lean();
    }

    if (!mainBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog tidak ditemukan',
      });
    }

    const blogWithSlug = {
      ...mainBlog,
      slug: mainBlog.slug || createSlug(mainBlog.judul),
    };

    const responseData = {
      success: true,
      mainBlog: blogWithSlug,
    };

    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=1800');
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching blog detail:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
    });
  }
});

router.get('/detail/id/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    const mainBlog = await Blog.findById(blogId);

    if (!mainBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog tidak ditemukan',
      });
    }

    const blogWithSlug = {
      ...mainBlog.toObject(),
      slug: mainBlog.slug || createSlug(mainBlog.judul),
    };

    const responseData = {
      success: true,
      mainBlog: blogWithSlug,
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching blog detail:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
    });
  }
});

export default router;
