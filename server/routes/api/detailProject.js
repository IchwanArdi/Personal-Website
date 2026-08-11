import express from 'express';
import Project from '../../models/Project.js';

const router = express.Router();

const toSlug = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

router.get('/detail/:slug', async (req, res) => {
  const slugParam = toSlug(req.params.slug || '');

  if (!slugParam) {
    return res.status(400).json({ message: 'Slug project tidak ditemukan' });
  }

  try {
    let project = await Project.findOne({ slug: slugParam }).select('title slug gambar images kategori deskripsi technologies liveUrl githubUrl tanggal featured status features challenges duration teamSize tags views').lean();

    if (!project) {
      const projectList = await Project.find({ isDeleted: { $ne: true } })
        .select('title slug gambar images kategori deskripsi technologies liveUrl githubUrl tanggal featured status features challenges duration teamSize tags views')
        .lean();

      project = projectList.find((item) => {
        const candidates = [item.slug, item.title].map((value) => toSlug(value)).filter(Boolean);
        return candidates.includes(slugParam);
      });
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
