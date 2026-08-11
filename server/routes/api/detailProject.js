import express from 'express';
import Project from '../../models/Project.js';

const router = express.Router();

const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

router.get('/detail/:slug', async (req, res) => {
  try {
    const slugParam = req.params.slug;

    if (!slugParam) {
      return res.status(400).json({ message: 'Slug project tidak ditemukan' });
    }

    let project = await Project.findOne({ slug: slugParam }).select('title slug gambar images kategori deskripsi technologies liveUrl githubUrl tanggal featured status features challenges duration teamSize tags views').lean();

    if (!project) {
      const projectList = await Project.find().select('title slug gambar images kategori deskripsi technologies liveUrl githubUrl tanggal featured status features challenges duration teamSize tags views').lean();

      project = projectList.find((project) => createSlug(project.title) === slugParam);
    }

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
