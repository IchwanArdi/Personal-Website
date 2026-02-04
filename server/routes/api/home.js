const express = require('express');
const router = express.Router(); // Buat router modular untuk endpoint /dashboard
const redis = require('../../config/redis'); // Import Redis client

const Project = require('../../models/Project');
const Images = require('../../models/Images');
const Blog = require('../../models/Blog');

router.get('/home', async (req, res) => {
  try {
    const CACHE_KEY = 'home:data';
    
    // 1. Cek Cache
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      console.log('⚡ Cache Hit using Redis: /home');
      return res.json(JSON.parse(cachedData));
    }

    console.log('🐢 Cache Miss: Fetching /home from DB');
    
    // 2. Jika tidak ada di cache, ambil dari DB
    const latestProject = await Project.findOne().sort({ _id: -1 }).select('title gambar tanggal liveUrl').lean();
    const latestBlog = await Blog.findOne().sort({ _id: -1 }).select('judul slug gambar tanggal ringkasan').lean();
    const latestUpdate = await Images.findOne().sort({ _id: -1 }).select('gambar').lean();

    const responseData = {
      latestProject,
      latestBlog,
      latestUpdate,
    };

    // 3. Simpan ke Cache (TTL: 10 menit = 600 detik)
    // Gunakan 'ex' untuk expiration in seconds
    await redis.set(CACHE_KEY, JSON.stringify(responseData), 'EX', 600);

    res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.json(responseData);
  } catch (error) {
    console.error('Error loading home:', error);
    res.status(500).json({ message: 'Gagal memuat home' });
  }
});

module.exports = router; // Ekspor router supaya bisa dipakai di app utama
