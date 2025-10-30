const express = require('express');
const Project = require('../../../models/Project');
const requireAuth = require('../../../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

// GET /api/admin/projects
router.get('/', async (req, res) => {
  try {
    const items = await Project.find({ isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: items });
  } catch (error) {
    console.error('Error get projects(admin):', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan' });
  }
});

// POST /api/admin/projects
router.post('/', async (req, res) => {
  try {
    const payload = req.body || {};
    const created = await Project.create(payload);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error('Error create project(admin):', error);
    res.status(400).json({ success: false, message: error.message || 'Gagal membuat project' });
  }
});

// PATCH /api/admin/projects/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body || {};
    const updated = await Project.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Project tidak ditemukan' });
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error update project(admin):', error);
    res.status(400).json({ success: false, message: error.message || 'Gagal mengupdate project' });
  }
});

// DELETE /api/admin/projects/:id (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Project.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Project tidak ditemukan' });
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error delete project(admin):', error);
    res.status(400).json({ success: false, message: error.message || 'Gagal menghapus project' });
  }
});

module.exports = router;
