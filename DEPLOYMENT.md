# Deployment Guide

## Environment Variables

### Required Variables

- `MONGO_URI`: MongoDB connection string
- `NODE_ENV`: Set to `production` for production deployment

### Optional Variables

- `CORS_ORIGIN`: Comma-separated list of allowed origins (defaults to localhost and Vercel)
- `PORT`: Server port (defaults to 3000)

## Performance Optimizations

### 1. Platform Configuration

- Ensure `NODE_ENV=production` is set
- Enable gzip/brotli compression at platform edge (Vercel, Railway, etc.)
- Use CDN for static assets when possible

### 2. Database Optimization

- MongoDB indexes are already configured in models
- Consider MongoDB Atlas for production with proper cluster sizing
- Monitor query performance with MongoDB Compass or Atlas

### 3. Image Optimization

- Convert images to WebP/AVIF format
- Use responsive images with proper sizing
- Consider CDN for image delivery (Cloudinary, AWS CloudFront, etc.)

### 4. Client-Side Optimizations

- Route-level code splitting implemented
- Lazy loading for images
- Reduced motion support for accessibility
- React.memo for layout components

### 5. Server-Side Optimizations

- Compression middleware enabled
- Security headers with Helmet
- Lean MongoDB queries with field selection
- HTTP caching headers
- Graceful shutdown handling

## Deployment Platforms

### Vercel (Recommended for Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Railway/Render (Backend)

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Environment Setup

```bash
# Copy example environment file
cp server/.env.example server/.env

# Edit with your values
nano server/.env
```

## Monitoring

### Performance Metrics to Track

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- API response times
- Database query performance

### Tools

- Vercel Analytics for frontend
- MongoDB Atlas monitoring
- Platform-specific monitoring (Railway, Render)

## Security Checklist

- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Security headers enabled
- [ ] Database access restricted
- [ ] HTTPS enforced in production
