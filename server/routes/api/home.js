const express = require('express');
const router = express.Router(); // Buat router modular untuk endpoint /dashboard

const Project = require('../../models/Project');
const Images = require('../../models/Images');
const Blog = require('../../models/Blog');

router.get('/home', async (req, res) => {
  try {
    const latestProject = await Project.findOne().sort({ _id: -1 }).select('title gambar tanggal liveUrl').lean();
    const latestBlog = await Blog.findOne().sort({ _id: -1 }).select('judul slug gambar tanggal ringkasan').lean();
    const latestUpdate = await Images.findOne().sort({ _id: -1 }).select('gambar').lean();

    res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.json({
      latestProject,
      latestBlog,
      latestUpdate,
    });
  } catch (error) {
    console.error('Error loading home:', error);
    res.status(500).json({ message: 'Gagal memuat home' });
  }
});

module.exports = router; // Ekspor router supaya bisa dipakai di app utama
