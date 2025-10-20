const express = require('express');
const router = express.Router(); // Buat router modular untuk endpoint /dashboard

// ambil db Project
const Project = require('../../models/Project');

router.get('/project', async (req, res) => {
  try {
    // Check if pagination is requested
    const usePagination = req.query.page || req.query.limit;

    if (usePagination) {
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.min(parseInt(req.query.limit) || 50, 100);
      const skip = (page - 1) * limit;

      const [total, Projects] = await Promise.all([
        Project.countDocuments({ isDeleted: { $ne: true } }),
        Project.find({ isDeleted: { $ne: true } })
          .select('title gambar kategori deskripsi technologies liveUrl githubUrl tanggal featured status')
          .sort({ tanggal: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
      ]);

      res.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
      res.json({
        success: true,
        data: Projects,
        Projects, // legacy key for backward compatibility
        total,
        page,
        limit,
      });
    } else {
      // Return all projects without pagination
      const Projects = await Project.find({ isDeleted: { $ne: true } })
        .select('title gambar kategori deskripsi technologies liveUrl githubUrl tanggal featured status')
        .sort({ tanggal: -1 })
        .lean();

      res.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
      res.json({
        success: true,
        data: Projects,
        Projects, // legacy key for backward compatibility
        total: Projects.length,
      });
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

module.exports = router;
