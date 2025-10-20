const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');

// Create Express app
const app = express();

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Compression
app.use(compression());

// CORS with env override (support comma-separated list)
const rawCorsOrigin = process.env.CORS_ORIGIN;
const defaultOrigins = ['http://localhost:5173', 'https://ichwanardi.vercel.app'];
const allowedOrigins = Array.isArray(rawCorsOrigin)
  ? rawCorsOrigin
  : typeof rawCorsOrigin === 'string'
  ? rawCorsOrigin
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean)
  : defaultOrigins;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests or same-origin (no origin header)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Logging (skip in test)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.set('trust proxy', 1); // penting di Railway / Vercel

// Import Routes
const HomeRoute = require('./routes/api/home');
const BlogRoute = require('./routes/api/blog');
const BlogDetailRoute = require('./routes/api/detailBlog');
const ProjectRoute = require('./routes/api/projects');
const ProjectDetailRoute = require('./routes/api/detailProject');

// Routes ke FrontEnd
app.use('/api', HomeRoute);
app.use('/api', BlogRoute);
app.use('/api/blog', BlogDetailRoute);
app.use('/api', ProjectRoute);
app.use('/api/project', ProjectDetailRoute);

module.exports = app;
