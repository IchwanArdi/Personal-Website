import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './index.css';
import App from './App.jsx';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const BlogsPage = lazy(() => import('./pages/BlogsPage.jsx'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage.jsx'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage.jsx'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'blogs', element: <BlogsPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'blog/:slug', element: <BlogDetailPage /> },
      { path: 'project/:id', element: <ProjectDetailPage /> },
    ],
  },
]);

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
    <ToastContainer position="top-right" autoClose={3000} theme="dark" />
  </StrictMode>
);
