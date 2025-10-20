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

// CORS with env override
const allowedOrigin = process.env.CORS_ORIGIN || ['http://localhost:5173', 'https://ichwanardi.vercel.app'];
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    optionsSuccessStatus: 204,
    maxAge: 86400,
  })
);

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
