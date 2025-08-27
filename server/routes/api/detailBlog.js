const express = require('express');
const router = express.Router();

// Import Blog model
const Blog = require('../../models/Blog');

// Helper function to create slug from title
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
};

// Get all blogs with slug generation
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ tanggal: -1 });

    // Add slug to each blog if not exists
    const blogsWithSlug = blogs.map((blog) => ({
      ...blog.toObject(),
      slug: blog.slug || createSlug(blog.judul),
    }));

    res.json({
      success: true,
      Blogs: blogsWithSlug,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
    });
  }
});

// Get single blog detail by slug (primary method)
router.get('/detail/:slug', async (req, res) => {
  try {
    const slugParam = req.params.slug;

    // Try to find by slug first
    let mainBlog = await Blog.findOne({ slug: slugParam });

    // If not found by slug, try to find by generated slug from title
    if (!mainBlog) {
      const blogs = await Blog.find();
      mainBlog = blogs.find((blog) => createSlug(blog.judul) === slugParam);
    }

    // If still not found, try by exact title match (fallback)
    if (!mainBlog) {
      const decodedTitle = decodeURIComponent(slugParam.replace(/-/g, ' '));
      mainBlog = await Blog.findOne({
        judul: { $regex: new RegExp(`^${decodedTitle}$`, 'i') },
      });
    }

    if (!mainBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog tidak ditemukan',
      });
    }

    // Add slug if not exists
    const blogWithSlug = {
      ...mainBlog.toObject(),
      slug: mainBlog.slug || createSlug(mainBlog.judul),
    };

    res.json({
      success: true,
      mainBlog: blogWithSlug,
    });
  } catch (error) {
    console.error('Error fetching blog detail:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
    });
  }
});

// Alternative route using blog ID (backup method)
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

    res.json({
      success: true,
      mainBlog: blogWithSlug,
    });
  } catch (error) {
    console.error('Error fetching blog detail:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
    });
  }
});

module.exports = router;
