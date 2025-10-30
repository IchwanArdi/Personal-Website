import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import SEO from '../components/SEO';

const LoginPage = () => {
  const { isDarkMode } = useApp();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (submitting) return;
      setSubmitting(true);
      try {
        await login(email, password);
        toast.success('Berhasil login');
        navigate('/dashboard/projects', { replace: true });
      } catch (err) {
        toast.error(err.message || 'Login gagal');
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, email, password, login, navigate]
  );

  return (
    <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} min-h-[calc(100vh-5rem)] flex items-center justify-center px-4`}>
      <SEO pageKey="login" />
      <form onSubmit={handleSubmit} className={`${isDarkMode ? 'bg-slate-900' : 'bg-white'} w-full max-w-md p-6 rounded-lg border ${isDarkMode ? 'border-slate-800' : 'border-slate-200 shadow'}`}>
        <h1 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Admin Login</h1>
        <div className="mb-3">
          <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`} required />
        </div>
        <div className="mb-4">
          <label className={`block text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
            required
          />
        </div>
        <button type="submit" disabled={submitting} className={`w-full py-2 rounded ${isDarkMode ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-yellow-600 hover:bg-yellow-700 text-white'}`}>
          {submitting ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
