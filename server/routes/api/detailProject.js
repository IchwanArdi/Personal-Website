import express from 'express';
import Project from '../../models/Project.js';

const router = express.Router();

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

export default router;
