const express = require('express');
const Blog = require('../../../models/Blog');
const requireAuth = require('../../../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

// GET /api/admin/blogs
router.get('/', async (req, res) => {
  try {
    const items = await Blog.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: items });
  } catch (error) {
    console.error('Error get blogs(admin):', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan' });
  }
});

// POST /api/admin/blogs
router.post('/', async (req, res) => {
  try {
    const payload = req.body || {};
    const created = await Blog.create(payload);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error('Error create blog(admin):', error);
    res.status(400).json({ success: false, message: error.message || 'Gagal membuat blog' });
  }
});

// PATCH /api/admin/blogs/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body || {};
    const updated = await Blog.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Blog tidak ditemukan' });
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error update blog(admin):', error);
    res.status(400).json({ success: false, message: error.message || 'Gagal mengupdate blog' });
  }
});

// DELETE /api/admin/blogs/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Blog tidak ditemukan' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error delete blog(admin):', error);
    res.status(400).json({ success: false, message: error.message || 'Gagal menghapus blog' });
  }
});

module.exports = router;
