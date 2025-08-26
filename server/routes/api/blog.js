const express = require('express');
const router = express.Router(); // Buat router modular untuk endpoint /dashboard

// ambil db Blog
const Blog = require('../../models/Blog');

router.get('/blog', async (req, res) => {
  try {
    const Blogs = await Blog.find().sort({ tanggal: -1 });
    res.json({
      Blogs,
    });
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

module.exports = router;
