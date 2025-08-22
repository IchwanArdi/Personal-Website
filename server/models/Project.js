const mongoose = require('mongoose');

// Schema dan Model (Project) - Updated Version
const projectSchema = new mongoose.Schema(
  {
    // Field yang sudah ada sebelumnya (dipertahankan untuk kompatibilitas)
    kategori: {
      type: String,
      enum: ['FULLSTACK', 'FRONTEND', 'BACKEND'],
      required: true,
    },
    link: String, // ini akan jadi liveUrl
    deskripsi: {
      type: String,
      required: true,
    },
    tanggal: {
      type: Date,
      default: Date.now,
    },
    gambar: {
      type: String,
      required: true,
    },

    // Field baru yang dibutuhkan
    title: {
      type: String,
      required: true,
    },
    technologies: [
      {
        type: String,
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ['COMPLETED', 'IN PROGRESS'],
      default: 'COMPLETED',
    },
    githubUrl: {
      type: String,
      required: true,
    },
    liveUrl: String, // optional, bisa null
    featured: {
      type: Boolean,
      default: false,
    },
    stars: {
      type: Number,
      default: 0,
    },
    commits: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Otomatis menambahkan createdAt dan updatedAt
  }
);

module.exports = mongoose.model('Project', projectSchema);
