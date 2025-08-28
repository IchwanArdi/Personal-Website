const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');

// Create Express app
const app = express();

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://personal-website-plum-nine-53.vercel.app'], // frontend
    credentials: true,
  })
);

app.set('trust proxy', 1); // penting di Railway / Vercel

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 hari
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // ✅ JANGAN pakai array
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // agar bisa lintas domain di Vercel, tapi tetap aman saat lokal
    },
  })
);

// Import Routes
const HomeRoute = require('./routes/api/home');
const BlogRoute = require('./routes/api/blog');
const BlogDetailRoute = require('./routes/api/detailBlog');

// Routes ke FrontEnd
app.use('/api', HomeRoute);
app.use('/api', BlogRoute);
app.use('/api/blog', BlogDetailRoute);

module.exports = app;
