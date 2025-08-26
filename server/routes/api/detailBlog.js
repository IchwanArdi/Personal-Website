const express = require('express');
const router = express.Router();

// Import Blog model
const Blog = require('../../models/Blog');

// Get single blog detail by judul
router.get('/detail/:judul', async (req, res) => {
  try {
    // Decode URL parameter to handle special characters and spaces
    const judulParam = decodeURIComponent(req.params.judul);

    // Find blog by exact judul match (case-insensitive)
    const mainBlog = await Blog.findOne({
      judul: { $regex: new RegExp(`^${judulParam}$`, 'i') },
    });

    if (!mainBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog tidak ditemukan',
      });
    }

    // Return JSON response instead of render (for API)
    res.json({
      success: true,
      mainBlog: mainBlog,
    });
  } catch (error) {
    console.error('Error fetching blog detail:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
    });
  }
});

// Alternative route using blog ID (more reliable)
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

    res.json({
      success: true,
      mainBlog: mainBlog,
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
