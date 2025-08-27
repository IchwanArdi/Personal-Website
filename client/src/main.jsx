import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './index.css';
import App from './App.jsx';

import HomePage from './pages/HomePage.jsx';
import BlogsPage from './pages/BlogsPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import BlogDetailPage from './pages/BlogDetailPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'blogs', element: <BlogsPage /> },
      { path: 'about', element: <AboutPage /> },
      // Updated routing for blog details using slug parameter
      { path: 'blog/:slug', element: <BlogDetailPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer position="top-right" autoClose={3000} theme="dark" />
  </StrictMode>
);
