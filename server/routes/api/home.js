import express from 'express';
import Project from '../../models/Project.js';
import Images from '../../models/Images.js';
import Blog from '../../models/Blog.js';

const router = express.Router();

router.get('/home', async (req, res) => {
  try {
    const latestProject = await Project.findOne().sort({ _id: -1 }).select('title gambar tanggal liveUrl').lean();
    const latestBlog = await Blog.findOne().sort({ _id: -1 }).select('judul slug gambar tanggal ringkasan').lean();
    const latestUpdate = await Images.findOne().sort({ _id: -1 }).select('gambar').lean();

    const responseData = {
      latestProject,
      latestBlog,
      latestUpdate,
    };

    res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.json(responseData);
  } catch (error) {
    console.error('Error loading home:', error);
    res.status(500).json({ message: 'Gagal memuat home' });
  }
});

export default router;
