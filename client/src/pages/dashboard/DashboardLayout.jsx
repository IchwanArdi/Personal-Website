import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

const DashboardLayout = () => {
  const { logout } = useAuth();
  const { isDarkMode } = useApp();

  return (
    <div className={`${isDarkMode ? 'bg-black text-white' : 'bg-white text-slate-800'} min-h-[calc(100vh-5rem)]`}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <button onClick={logout} className={`${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-800 hover:bg-slate-700'} text-white px-3 py-2 rounded`}>
            Logout
          </button>
        </div>
        <div className="flex gap-4 mb-6">
          <NavLink to="/dashboard/projects" className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-yellow-500 text-black' : isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-800'}`}>
            Projects
          </NavLink>
          <NavLink to="/dashboard/blogs" className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-yellow-500 text-black' : isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-800'}`}>
            Blogs
          </NavLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
