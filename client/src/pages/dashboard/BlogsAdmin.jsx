import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useApp } from '../../contexts/AppContext';

const emptyForm = {
  kategori: 'GENERAL',
  judul: '',
  slug: '',
  konten: '',
  ringkasan: '',
  gambar: '',
  author: 'Admin',
  status: 'published',
  tags: '',
};

const BlogsAdmin = () => {
  const { isDarkMode } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const contentRef = useRef(null);

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
      const res = await fetch(`${apiBase}/api/admin/blogs`, { credentials: 'include' });
      const data = await res.json();
      setItems(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.log(e);
      toast.error('Gagal memuat blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-generate slug saat judul diubah (jika slug kosong / user belum ubah manual)
  useEffect(() => {
    if (!editingId) {
      // untuk create baru
      setForm((prev) => ({
        ...prev,
        slug: prev.slug
          ? prev.slug
          : prev.judul
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .trim()
              .replace(/\s+/g, '-'),
      }));
    }
  }, [form.judul, editingId]);

  // Validasi sederhana
  const validate = () => {
    const next = {};
    if (!form.judul.trim()) next.judul = 'Wajib diisi';
    if (!form.konten.trim()) next.konten = 'Wajib diisi';
    if (!form.gambar.trim()) next.gambar = 'Wajib diisi';
    if (!form.slug.trim()) next.slug = 'Wajib diisi';
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
      tags: form.tags
        ? form.tags
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    };
    try {
      const url = editingId ? `${apiBase}/api/admin/blogs/${editingId}` : `${apiBase}/api/admin/blogs`;
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
      kategori: it.kategori || 'GENERAL',
      judul: it.judul || '',
      slug: it.slug || '',
      konten: it.konten || '',
      ringkasan: it.ringkasan || '',
      gambar: it.gambar || '',
      author: it.author || 'Admin',
      status: it.status || 'published',
      tags: Array.isArray(it.tags) ? it.tags.join(', ') : '',
    });
    setErrors({});
  };

  // Helpers: sisip teks/HTML pada posisi kursor
  const insertAroundSelection = (before, after = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const value = form.konten;
    const selected = value.slice(start, end);
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    setForm((prev) => ({ ...prev, konten: next }));
    // restore cursor roughly after inserted
    requestAnimationFrame(() => {
      const pos = start + before.length + selected.length + after.length;
      textarea.focus();
      textarea.setSelectionRange(pos, pos);
    });
  };

  const insertAtCursor = (snippet) => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const value = form.konten;
    const next = value.slice(0, start) + snippet + value.slice(end);
    setForm((prev) => ({ ...prev, konten: next }));
    requestAnimationFrame(() => {
      const pos = start + snippet.length;
      textarea.focus();
      textarea.setSelectionRange(pos, pos);
    });
  };

  // Toolbar actions
  const onBold = () => insertAroundSelection('<strong>', '</strong>');
  const onItalic = () => insertAroundSelection('<em>', '</em>');
  const onH2 = () => insertAroundSelection('<h2>', '</h2>');
  const onH3 = () => insertAroundSelection('<h3>', '</h3>');
  const onLink = () => {
    const url = prompt('Masukkan URL');
    if (!url) return;
    insertAroundSelection(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>');
  };
  const onImage = () => {
    const url = prompt('Masukkan URL gambar');
    if (!url) return;
    const alt = prompt('Masukkan alt text (opsional)') || '';
    insertAtCursor(`<img src="${url}" alt="${alt}" />`);
  };
  const onUl = () => insertAtCursor('<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>');
  const onOl = () => insertAtCursor('<ol>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ol>');
  const onCode = () => insertAroundSelection('<pre><code>', '</code></pre>');

  const onConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      const res = await fetch(`${apiBase}/api/admin/blogs/${pendingDelete}`, { method: 'DELETE', credentials: 'include' });
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
    return items.filter((it) => (it.judul || '').toLowerCase().includes(q) || (it.kategori || '').toLowerCase().includes(q) || (it.status || '').toLowerCase().includes(q) || (it.slug || '').toLowerCase().includes(q));
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
      <h2 className="text-xl font-semibold mb-4">Blogs</h2>

      {/* Toolbar: Search */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul/kategori/status/slug"
          className={`px-3 py-2 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
        />
        <div className="text-sm opacity-70">{filtered.length} item</div>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select className="px-3 py-2 rounded border border-slate-300" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
          <option>GENERAL</option>
          <option>PROJECTS</option>
        </select>
        <div>
          <input className={`w-full px-3 py-2 rounded border ${errors.judul ? 'border-red-500' : 'border-slate-300'}`} placeholder="Judul" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} required />
          {errors.judul && <p className="text-red-500 text-xs mt-1">{errors.judul}</p>}
        </div>
        <div>
          <input className={`w-full px-3 py-2 rounded border ${errors.slug ? 'border-red-500' : 'border-slate-300'}`} placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
        </div>
        <div>
          <input className={`w-full px-3 py-2 rounded border ${errors.gambar ? 'border-red-500' : 'border-slate-300'}`} placeholder="URL Gambar" value={form.gambar} onChange={(e) => setForm({ ...form, gambar: e.target.value })} required />
          {errors.gambar && <p className="text-red-500 text-xs mt-1">{errors.gambar}</p>}
          {/* Preview gambar */}
          {form.gambar && <img src={form.gambar} alt="preview" className="mt-2 h-24 w-auto rounded border border-slate-200 object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />}
        </div>
        <input className="px-3 py-2 rounded border border-slate-300" placeholder="Tags (pisahkan koma)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        <select className="px-3 py-2 rounded border border-slate-300" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option>published</option>
          <option>draft</option>
        </select>
        <textarea className="px-3 py-2 rounded border border-slate-300 md:col-span-2" rows="6" placeholder="Ringkasan" value={form.ringkasan} onChange={(e) => setForm({ ...form, ringkasan: e.target.value })} />
        {/* Toolbar untuk konten */}
        <div className="md:col-span-2 flex flex-wrap gap-2">
          <button type="button" onClick={onBold} className={`px-2 py-1 rounded border ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
            Bold
          </button>
          <button type="button" onClick={onItalic} className={`px-2 py-1 rounded border ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
            Italic
          </button>
          <button type="button" onClick={onH2} className={`px-2 py-1 rounded border ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
            H2
          </button>
          <button type="button" onClick={onH3} className={`px-2 py-1 rounded border ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
            H3
          </button>
          <button type="button" onClick={onLink} className={`px-2 py-1 rounded border ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
            Link
          </button>
          <button type="button" onClick={onImage} className={`px-2 py-1 rounded border ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
            Gambar
          </button>
          <button type="button" onClick={onUl} className={`px-2 py-1 rounded border ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
            UL
          </button>
          <button type="button" onClick={onOl} className={`px-2 py-1 rounded border ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
            OL
          </button>
          <button type="button" onClick={onCode} className={`px-2 py-1 rounded border ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
            Code
          </button>
        </div>
        <textarea
          ref={contentRef}
          className="px-3 py-2 rounded border border-slate-300 md:col-span-2"
          rows="14"
          placeholder="Konten (HTML). Gunakan toolbar untuk format/gambar."
          value={form.konten}
          onChange={(e) => setForm({ ...form, konten: e.target.value })}
          required
        />
        {/* Live preview */}
        <div className={`md:col-span-2 p-4 rounded border ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''}`} dangerouslySetInnerHTML={{ __html: form.konten || '<p class="opacity-60">Preview akan muncul di sini...</p>' }} />
        </div>
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
                <th className="text-left p-2">Judul</th>
                <th className="text-left p-2">Kategori</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {current.map((it) => (
                <tr key={it._id} className={`${isDarkMode ? 'border-slate-800' : 'border-slate-200'} border-t`}>
                  <td className="p-2">{it.judul}</td>
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
            <h3 className="text-lg font-semibold mb-3">Hapus Blog</h3>
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

export default BlogsAdmin;
