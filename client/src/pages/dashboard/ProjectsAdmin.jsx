import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useApp } from '../../contexts/AppContext';

const emptyForm = {
  title: '',
  kategori: 'FULLSTACK',
  deskripsi: '',
  technologies: '',
  gambar: '',
  images: '',
  githubUrl: '',
  liveUrl: '',
  featured: false,
  status: 'Completed',
};

const ProjectsAdmin = () => {
  const { isDarkMode } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  // UX: pencarian & pagination
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // UX: konfirmasi hapus
  const [pendingDelete, setPendingDelete] = useState(null);

  const apiBase = import.meta.env.VITE_API_URL;

  const tableClass = useMemo(() => `${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'} w-full border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} rounded`, [isDarkMode]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/admin/projects`, { credentials: 'include' });
      const data = await res.json();
      setItems(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      toast.error('Gagal memuat projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validasi sederhana
  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Wajib diisi';
    if (!form.deskripsi.trim()) next.deskripsi = 'Wajib diisi';
    if (!form.gambar.trim()) next.gambar = 'Wajib diisi';
    if (!/^https:\/\/github\.com\/.+/.test(form.githubUrl.trim())) next.githubUrl = 'GitHub URL harus https://github.com/...';
    if (form.liveUrl && !/^https?:\/\/.+/.test(form.liveUrl.trim())) next.liveUrl = 'Live URL harus http(s)';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Periksa kembali input');
      return;
    }
    const payload = {
      ...form,
      technologies: form.technologies
        ? form.technologies
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      images: form.images
        ? form.images
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    };
    try {
      const url = editingId ? `${apiBase}/api/admin/projects/${editingId}` : `${apiBase}/api/admin/projects`;
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Gagal menyimpan');
      toast.success('Tersimpan');
      setForm(emptyForm);
      setEditingId(null);
      setErrors({});
      fetchItems();
    } catch (e) {
      toast.error(e.message || 'Gagal menyimpan');
    }
  };

  const onEdit = (it) => {
    setEditingId(it._id);
    setForm({
      title: it.title || '',
      kategori: it.kategori || 'FULLSTACK',
      deskripsi: it.deskripsi || '',
      technologies: Array.isArray(it.technologies) ? it.technologies.join(', ') : '',
      gambar: it.gambar || '',
      images: Array.isArray(it.images) ? it.images.join(', ') : '',
      githubUrl: it.githubUrl || '',
      liveUrl: it.liveUrl || '',
      featured: !!it.featured,
      status: it.status || 'Completed',
    });
    setErrors({});
  };

  const onConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      const res = await fetch(`${apiBase}/api/admin/projects/${pendingDelete}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Gagal menghapus');
      toast.success('Terhapus');
      setPendingDelete(null);
      fetchItems();
    } catch (e) {
      toast.error(e.message || 'Gagal menghapus');
    }
  };

  // Data terfilter & pagination
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => (it.title || '').toLowerCase().includes(q) || (it.kategori || '').toLowerCase().includes(q) || (it.status || '').toLowerCase().includes(q));
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Projects</h2>

      {/* Toolbar: Search */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari title/kategori/status"
          className={`px-3 py-2 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
        />
        <div className="text-sm opacity-70">{filtered.length} item</div>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <input className={`w-full px-3 py-2 rounded border ${errors.title ? 'border-red-500' : 'border-slate-300'}`} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
        <select className="px-3 py-2 rounded border border-slate-300" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
          <option>FULLSTACK</option>
          <option>FRONTEND</option>
          <option>BACKEND</option>
          <option>MOBILE</option>
          <option>DESKTOP</option>
          <option>DESIGN</option>
        </select>
        <div>
          <input
            className={`w-full px-3 py-2 rounded border ${errors.githubUrl ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="GitHub URL"
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            required
          />
          {errors.githubUrl && <p className="text-red-500 text-xs mt-1">{errors.githubUrl}</p>}
        </div>
        <div>
          <input
            className={`w-full px-3 py-2 rounded border ${errors.liveUrl ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="Live URL (opsional)"
            value={form.liveUrl}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
          />
          {errors.liveUrl && <p className="text-red-500 text-xs mt-1">{errors.liveUrl}</p>}
        </div>
        <div>
          <input
            className={`w-full px-3 py-2 rounded border ${errors.gambar ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="URL Gambar (utama)"
            value={form.gambar}
            onChange={(e) => setForm({ ...form, gambar: e.target.value })}
            required
          />
          {errors.gambar && <p className="text-red-500 text-xs mt-1">{errors.gambar}</p>}
          {/* Preview gambar utama */}
          {form.gambar && <img src={form.gambar} alt="preview" className="mt-2 h-24 w-auto rounded border border-slate-200 object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />}
        </div>
        <input className="px-3 py-2 rounded border border-slate-300" placeholder="URL Images (pisahkan koma)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
        <input className="px-3 py-2 rounded border border-slate-300" placeholder="Technologies (pisahkan koma)" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} />
        <select className="px-3 py-2 rounded border border-slate-300" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option>Completed</option>
          <option>In Progress</option>
          <option>Planning</option>
          <option>Archived</option>
        </select>
        <textarea className="px-3 py-2 rounded border border-slate-300 md:col-span-2" placeholder="Deskripsi" value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} required />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Featured
        </label>
        <div className="md:col-span-2">
          <button className="px-4 py-2 rounded bg-yellow-500 text-black">{editingId ? 'Update' : 'Create'}</button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setErrors({});
              }}
              className="ml-2 px-4 py-2 rounded bg-slate-700 text-white"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={tableClass}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">Kategori</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {current.map((it) => (
                <tr key={it._id} className={`${isDarkMode ? 'border-slate-800' : 'border-slate-200'} border-t`}>
                  <td className="p-2">{it.title}</td>
                  <td className="p-2">{it.kategori}</td>
                  <td className="p-2">{it.status}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => onEdit(it)} className="px-3 py-1 rounded bg-slate-700 text-white">
                      Edit
                    </button>
                    <button onClick={() => setPendingDelete(it._id)} className="px-3 py-1 rounded bg-red-600 text-white">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {current.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-3 opacity-70">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex items-center justify-end gap-2 p-3">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className={`px-3 py-1 rounded ${page <= 1 ? 'opacity-50 cursor-not-allowed' : 'bg-slate-700 text-white'}`}>
              Prev
            </button>
            <span className="text-sm">
              {page} / {totalPages}
            </span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className={`px-3 py-1 rounded ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : 'bg-slate-700 text-white'}`}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {pendingDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'} w-full max-w-sm p-5 rounded-lg border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <h3 className="text-lg font-semibold mb-3">Hapus Project</h3>
            <p className="mb-5 opacity-80">Anda yakin ingin menghapus item ini?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setPendingDelete(null)} className="px-4 py-2 rounded border border-slate-300">
                Batal
              </button>
              <button onClick={onConfirmDelete} className="px-4 py-2 rounded bg-red-600 text-white">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsAdmin;
