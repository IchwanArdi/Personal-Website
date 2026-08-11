import mongoose from 'mongoose';

const generateSlug = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'project';

// Schema dan Model (Project) - Enhanced Version untuk UI Baru
const projectSchema = new mongoose.Schema(
  {
    // === FIELD UTAMA (REQUIRED) ===
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },

    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    // Mapping dari field lama ke baru
    kategori: {
      type: String,
      enum: ['FULLSTACK', 'FRONTEND', 'BACKEND', 'MOBILE', 'DESKTOP', 'DESIGN'],
      required: true,
      // Ini akan dimapping ke 'category' di frontend
    },

    deskripsi: {
      type: String,
      required: true,
      maxLength: 500,
      // Ini akan dimapping ke 'description' di frontend
    },

    // === DESKRIPSI TAMBAHAN (OPSIONAL) ===
    shortDescription: {
      type: String,
      maxLength: 150,
      // Jika kosong, akan menggunakan 150 karakter pertama dari deskripsi
    },

    detailedDescription: {
      type: String,
      maxLength: 2000,
      // Untuk halaman detail, deskripsi yang lebih panjang
    },

    // === TEKNOLOGI ===
    technologies: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    // === GAMBAR ===
    gambar: {
      type: String,
      required: true,
      // Gambar utama untuk card dan featured
    },

    images: [
      {
        type: String,
        // Array gambar untuk gallery di halaman detail
        // Jika kosong, akan menggunakan 'gambar' sebagai default
      },
    ],

    // === LINKS ===
    githubUrl: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^https:\/\/github\.com\/.+/.test(v);
        },
        message: 'GitHub URL harus valid (https://github.com/...)',
      },
    },

    liveUrl: {
      type: String,
      // Mapping dari field 'link' yang lama
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Live URL harus valid (http:// atau https://)',
      },
    },

    // === STATUS & METADATA ===
    featured: {
      type: Boolean,
      default: false,
      index: true, // Index untuk query featured projects
    },

    status: {
      type: String,
      enum: ['Completed', 'In Progress', 'Planning', 'Archived'],
      default: 'Completed',
    },

    // === TANGGAL ===
    tanggal: {
      type: Date,
      default: Date.now,
      // Mapping ke 'date' di frontend
    },

    // === PROJECT DETAILS (OPSIONAL - UNTUK HALAMAN DETAIL) ===
    features: [
      {
        type: String,
        trim: true,
      },
    ],

    challenges: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          required: true,
        },
        solution: {
          type: String,
          required: true,
        },
      },
    ],

    // === PROJECT INFO ===
    duration: {
      type: String,
      // Contoh: "3 months", "2 weeks", "1 year"
    },

    teamSize: {
      type: String,
      // Contoh: "Solo project", "2 developers", "Team of 5"
    },

    // === SEO & SEARCH ===
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // === ANALYTICS (OPSIONAL) ===
    views: {
      type: Number,
      default: 0,
    },

    // === SOFT DELETE ===
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true, // Otomatis menambahkan createdAt dan updatedAt

    // Virtual fields untuk compatibility
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// === VIRTUAL FIELDS (untuk mapping field lama ke baru) ===
projectSchema.virtual('category').get(function () {
  return this.kategori;
});

projectSchema.virtual('description').get(function () {
  return this.deskripsi;
});

projectSchema.virtual('date').get(function () {
  // Format tanggal untuk frontend (contoh: "2/1/25")
  const date = new Date(this.tanggal);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)}`;
});

projectSchema.virtual('image').get(function () {
  return this.gambar;
});

projectSchema.virtual('allImages').get(function () {
  // Jika ada images array, gunakan itu. Jika tidak, gunakan gambar utama
  return this.images && this.images.length > 0 ? this.images : [this.gambar, this.gambar, this.gambar]; // Duplicate untuk demo
});

projectSchema.virtual('displayDescription').get(function () {
  // Untuk halaman detail, gunakan detailedDescription jika ada
  return this.detailedDescription || this.deskripsi;
});

projectSchema.virtual('displayShortDescription').get(function () {
  // Untuk card, gunakan shortDescription atau potong deskripsi
  return this.shortDescription || this.deskripsi.substring(0, 150) + '...';
});

// === INDEXES untuk performa ===
projectSchema.index({ kategori: 1, featured: -1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ featured: -1, createdAt: -1 });
projectSchema.index({ isDeleted: 1, kategori: 1 });

// === METHODS ===
projectSchema.methods.toFrontendFormat = function () {
  return {
    id: this._id,
    slug: this.slug || generateSlug(this.title),
    shortDescription: this.displayShortDescription,
    image: this.image,
    images: this.allImages,
    technologies: this.technologies,
    category: this.category,
    date: this.date,
    githubUrl: this.githubUrl,
    liveUrl: this.liveUrl,
    featured: this.featured,
    status: this.status,
    features: this.features,
    challenges: this.challenges,
    duration: this.duration,
    teamSize: this.teamSize,
    views: this.views,
  };
};

projectSchema.statics.ensureSlugs = async function () {
  const projects = await this.find({ isDeleted: { $ne: true } })
    .select('_id title slug')
    .lean();

  for (const project of projects) {
    const nextSlug = generateSlug(project.title);
    if (!project.slug || project.slug !== nextSlug) {
      await this.updateOne({ _id: project._id }, { $set: { slug: nextSlug } });
    }
  }

  return this.countDocuments({ slug: { $exists: true } });
};

// === STATIC METHODS ===
projectSchema.statics.getFeaturedProjects = function () {
  return this.find({
    featured: true,
    isDeleted: false,
  }).sort({ createdAt: -1 });
};

projectSchema.statics.getProjectsByCategory = function (category) {
  const query = category === 'ALL' ? { isDeleted: false } : { kategori: category, isDeleted: false };

  return this.find(query).sort({ featured: -1, createdAt: -1 });
};

projectSchema.statics.searchProjects = function (searchTerm, category = 'ALL') {
  const matchStage = {
    isDeleted: false,
    $or: [{ title: { $regex: searchTerm, $options: 'i' } }, { deskripsi: { $regex: searchTerm, $options: 'i' } }, { technologies: { $in: [new RegExp(searchTerm, 'i')] } }, { tags: { $in: [new RegExp(searchTerm, 'i')] } }],
  };

  if (category !== 'ALL') {
    matchStage.kategori = category;
  }

  return this.find(matchStage).sort({ featured: -1, createdAt: -1 });
};

// === MIDDLEWARE ===
// Auto-increment views ketika project dilihat
projectSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Validasi sebelum save
projectSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = generateSlug(this.title);
  }

  if (this.isModified('title') && !this.isModified('slug') && this.title) {
    this.slug = generateSlug(this.title);
  }

  // Auto-generate shortDescription jika belum ada
  if (!this.shortDescription && this.deskripsi) {
    this.shortDescription = this.deskripsi.substring(0, 147) + '...';
  }

  // Auto-populate images jika kosong
  if (!this.images || this.images.length === 0) {
    this.images = [this.gambar];
  }

  next();
});

projectSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  if (!update) return next();

  const target = update.$set || update;

  if (!target.slug && target.title) {
    target.slug = generateSlug(target.title);
  }

  if (update.$set) {
    update.$set = target;
  }

  next();
});

export default mongoose.model('Project', projectSchema);

// === CONTOH PENGGUNAAN ===
/*

// 1. Get all projects untuk halaman utama
const projects = await Project.getProjectsByCategory('ALL');
const frontendProjects = projects.map(p => p.toFrontendFormat());

// 2. Search projects
const searchResults = await Project.searchProjects('react', 'FRONTEND');

// 3. Get project detail
const project = await Project.findById(projectId);
if (project) {
  await project.incrementViews(); // Increment view count
  const projectDetail = project.toFrontendFormat();
}

// 4. Get featured projects
const featured = await Project.getFeaturedProjects();

*/
