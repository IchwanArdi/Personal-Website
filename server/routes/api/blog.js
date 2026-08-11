import express from 'express';
import Blog from '../../models/Blog.js';

const router = express.Router();

router.get('/blog', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const skip = (page - 1) * limit;

    const [total, Blogs] = await Promise.all([Blog.countDocuments({}), Blog.find({}, 'judul slug gambar ringkasan tanggal kategori').sort({ tanggal: -1 }).skip(skip).limit(limit).lean()]);

    const responseData = {
      success: true,
      data: Blogs,
      Blogs,
      total,
      page,
      limit,
    };

    res.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

export default router;
