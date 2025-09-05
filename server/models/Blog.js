const mongoose = require('mongoose');

// Schema dan Model (Blog) - Enhanced version
const blogSchema = new mongoose.Schema(
  {
    kategori: {
      type: String,
      required: true,
      enum: ['GENERAL', 'PROJECTS'], // Bisa disesuaikan
    },
    judul: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    konten: {
      type: String,
      required: true,
    },
    ringkasan: {
      type: String,
      maxlength: 300,
    },
    gambar: {
      type: String,
      required: true, // Jadikan required untuk konsistensi UI
    },
    author: {
      type: String,
      required: true,
      default: 'Admin',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tanggal: {
      type: Date,
      default: Date.now,
    },
    tanggalUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Otomatis menambah createdAt dan updatedAt
  }
);

// Middleware untuk membuat slug otomatis
blogSchema.pre('save', function (next) {
  if (this.isModified('judul')) {
    this.slug = this.judul
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter khusus
      .replace(/\s+/g, '-') // Ganti spasi dengan dash
      .trim();
  }

  // Update tanggalUpdate jika bukan dokumen baru
  if (!this.isNew) {
    this.tanggalUpdate = new Date();
  }

  next();
});

// Index untuk pencarian dan performa
blogSchema.index({ judul: 'text', konten: 'text', tags: 'text' });
blogSchema.index({ kategori: 1, status: 1 });
blogSchema.index({ tanggal: -1 });
blogSchema.index({ slug: 1 });

module.exports = mongoose.model('Blog', blogSchema);

// Tambahkan data baru ke database
// const project1 = new Blog({
//   judul: 'Membuat Website menggunakan Tailwind',
//   konten: 'Dolorem, fugit! Lorem ipsum, dolor sit amet consectetur adipisicing.',
//   tanggal: '2024-08-08T00:00:00.000+00:00',
// });

// // Simpan data ke database
// project1
//   .save()
//   .then((result) => {
//     console.log('Project berhasil disimpan:', result);
//     mongoose.connection.close(); // Tutup koneksi setelah selesai
//   })
//   .catch((err) => {
//     console.error('Gagal menyimpan project ❌:', err);
//   });
