const express = require('express');
const router = express.Router();
const redis = require('../../config/redis');

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
    const CACHE_KEY = `project:${id}`;
    
    // 1. Check Cache
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      console.log(`⚡ Cache Hit using Redis: PROJECT ${id}`);
      return res.json(JSON.parse(cachedData));
    }

    console.log(`🐢 Cache Miss: Fetching PROJECT ${id} from DB`);

    const project = await Project.findById(id).select('title gambar images kategori deskripsi technologies liveUrl githubUrl tanggal featured status features challenges duration teamSize tags views').lean();

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // 2. Save to Cache (TTL: 1 hour = 3600 seconds)
    await redis.set(CACHE_KEY, JSON.stringify(project), 'EX', 3600);

    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=1800');
    res.json(project);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
