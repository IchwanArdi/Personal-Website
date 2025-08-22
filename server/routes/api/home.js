const express = require('express');
const router = express.Router(); // Buat router modular untuk endpoint /dashboard

const Project = require('../../models/Project');
const Images = require('../../models/Images');
const Blog = require('../../models/Blog');

router.get('/home', async (req, res) => {
  try {
    const latestProject = await Project.findOne().sort({ _id: -1 }); // Mengambil proyek terbaru berdasarkan ID terbaru
    const latestBlog = await Blog.findOne().sort({ _id: -1 }); // Mengambil Blog terbaru berdasarkan ID terbaru
    const latestPicture = await Images.findOne().sort({ _id: -1 }); // Mengambil Picture terbaru berdasarkan ID terbaru

    res.json({
      latestProject,
      latestBlog,
      latestPicture,
    });
  } catch (error) {
    console.error('Error loading home:', error);
    res.status(500).json({ message: 'Gagal memuat home' });
  }
});

module.exports = router; // Ekspor router supaya bisa dipakai di app utama
