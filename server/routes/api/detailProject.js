const express = require('express');
const router = express.Router();

// Import Project Model - Fixed syntax error
const Project = require('../../models/Project');

// Helper function to create slug from title
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
};

router.get('/detail/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id).select('title gambar images kategori deskripsi technologies liveUrl githubUrl tanggal featured status features challenges duration teamSize tags views').lean();

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=1800');
    res.json(project);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
