import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import App from './App.jsx';

import HomePage from './pages/HomePage.jsx';
import BlogsPage from './pages/BlogsPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'blogs', element: <BlogsPage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
