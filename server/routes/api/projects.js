const express = require('express');
const router = express.Router(); // Buat router modular untuk endpoint /dashboard

// ambil db Project
const Project = require('../../models/Project');

router.get('/project', async (req, res) => {
  try {
    const Projects = await Project.find().sort({ tanggal: -1 });
    res.json({
      Projects,
    });
  } catch (error) {
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

module.exports = router;
