import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';

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
  }),
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
app.options(/.*/, cors(corsOptions));

// Logging (skip in test)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.set('trust proxy', 1); // penting di Railway / Vercel

// Session setup (single-admin auth)
const sessionSecret = process.env.SESSION_SECRET || 'change_this_secret';
const isProduction = (process.env.NODE_ENV || 'development') === 'production';

app.use(
  session({
    name: 'sid',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction, // true jika HTTPS
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 8, // 8 jam
    },
  }),
);

// Import Routes
import HomeRoute from './routes/api/home.js';
import BlogRoute from './routes/api/blog.js';
import BlogDetailRoute from './routes/api/detailBlog.js';
import ProjectRoute from './routes/api/projects.js';
import ProjectDetailRoute from './routes/api/detailProject.js';
import AuthRoute from './routes/api/auth.js';
import AdminProjectsRoute from './routes/api/admin/projects.js';
import AdminBlogsRoute from './routes/api/admin/blogs.js';

// Routes ke FrontEnd
app.use('/api', HomeRoute);
app.use('/api/blog', BlogDetailRoute);
app.use('/api', BlogRoute);
app.use('/api', ProjectRoute);
app.use('/api/project', ProjectDetailRoute);
app.use('/api/auth', AuthRoute);
app.use('/api/admin/projects', AdminProjectsRoute);
app.use('/api/admin/blogs', AdminBlogsRoute);

export default app;
