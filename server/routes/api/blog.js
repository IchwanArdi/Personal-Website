const express = require('express');
const router = express.Router(); // Buat router modular untuk endpoint /dashboard
const redis = require('../../config/redis');

// ambil db Blog
const Blog = require('../../models/Blog');

router.get('/blog', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    
    // Generate Cache Key
    const CACHE_KEY = `blogs:page:${page}:limit:${limit}`;
    
    // 1. Check Cache
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      console.log(`⚡ Cache Hit using Redis: ${CACHE_KEY}`);
      return res.json(JSON.parse(cachedData));
    }

    console.log(`🐢 Cache Miss: Fetching ${CACHE_KEY} from DB`);

    const skip = (page - 1) * limit;

    const [total, Blogs] = await Promise.all([Blog.countDocuments({}), Blog.find({}, 'judul slug gambar ringkasan tanggal kategori').sort({ tanggal: -1 }).skip(skip).limit(limit).lean()]);

    const responseData = {
      success: true,
      data: Blogs,
      Blogs, // legacy key for backward compatibility
      total,
      page,
      limit,
    };

    // 2. Save to Cache (TTL: 30 minutes = 1800 seconds)
    await redis.set(CACHE_KEY, JSON.stringify(responseData), 'EX', 1800);

    res.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

module.exports = router;
