import React, { useState, useEffect } from 'react';
import { Shirt, Gem, Plus, Pencil, Trash2, Check, X, LogOut, Package, CheckCircle2, Circle, Lock } from 'lucide-react';
import * as api from './api';
import ImageDropzone from './ImageDropzone';

const CATEGORIES = ['Denim', 'Dresses', 'Outerwear', 'Ethnic Wear', 'Accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];
const CONDITIONS = ['Like New', 'Gently Loved', 'Well-Loved'];
const emptyForm = { name: '', price: '', size: SIZES[0], category: CATEGORIES[0], condition: CONDITIONS[0], material: '', description: '', images: [] };

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: 'var(--card)', border: '1px solid rgba(46,42,38,0.08)' }}>
      <div className="rounded-full p-3" style={{ background: color + '20' }}><Icon size={20} color={color} /></div>
      <div>
        <p className="font-display text-2xl leading-none">{value}</p>
        <p className="font-mono text-xs opacity-60 mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(api.isLoggedIn());
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total: 0, sold: 0, available: 0 });
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [actionError, setActionError] = useState('');

  async function loadData() {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([api.getProducts(), api.getStats()]);
      setProducts(list);
      setStats(s);
    } catch (e) {
      setActionError('Could not load inventory. Is the API running and reachable?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (authed) loadData(); }, [authed]);

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPwLoading(true);
    setPwError('');
    try {
      await api.login(pw);
      setAuthed(true);
    } catch (err) {
      setPwError(err.message || 'Incorrect password.');
    } finally {
      setPwLoading(false);
    }
  }

  function logout() {
    api.logout();
    setAuthed(false);
  }

  function openAddForm() { setForm(emptyForm); setEditingId(null); setFormOpen(true); }

  function openEditForm(p) {
    setForm({
      name: p.name, price: String(p.price), size: p.size, category: p.category,
      condition: p.condition, material: p.material || '', description: p.description || '',
      images: p.images || [],
    });
    setEditingId(p._id);
    setFormOpen(true);
  }

  async function saveForm() {
    if (!form.name.trim() || !form.price) return;
    const payload = {
      name: form.name, price: Number(form.price), size: form.size, category: form.category,
      condition: form.condition, material: form.material, description: form.description,
      images: form.images,
    };
    try {
      if (editingId) await api.updateProduct(editingId, payload);
      else await api.createProduct(payload);
      setFormOpen(false);
      await loadData();
    } catch (err) {
      setActionError(err.message || 'Could not save this piece.');
    }
  }

  async function handleToggleSold(id) {
    try { await api.toggleSold(id); await loadData(); }
    catch (err) { setActionError(err.message || 'Could not update sold status.'); }
  }

  async function handleDelete(id) {
    try { await api.deleteProduct(id); setConfirmDeleteId(null); await loadData(); }
    catch (err) { setActionError(err.message || 'Could not delete this piece.'); }
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <form onSubmit={handlePasswordSubmit} className="rounded-2xl p-8 w-full" style={{ maxWidth: '360px', background: 'var(--card)', border: '1px solid rgba(46,42,38,0.08)' }}>
          <div className="flex justify-center mb-4">
            <div className="rounded-full p-3" style={{ background: 'rgba(193,104,90,0.15)' }}><Lock size={20} color="var(--rose)" /></div>
          </div>
          <h1 className="font-display text-2xl text-center mb-1">Admin Access</h1>
          <p className="font-body text-sm text-center opacity-60 mb-6">Bazaar-e-Thrift inventory</p>
          <input
            type="password" value={pw} onChange={(e) => { setPw(e.target.value); setPwError(''); }}
            placeholder="Password" autoFocus
            className="w-full px-4 py-2.5 rounded-full mb-2 font-body text-sm"
            style={{ border: `1.5px solid ${pwError ? 'var(--red)' : 'rgba(46,42,38,0.2)'}`, background: 'var(--canvas)' }}
          />
          {pwError && <p className="font-mono text-xs mb-3" style={{ color: 'var(--red)' }}>{pwError}</p>}
          <button type="submit" disabled={pwLoading} className="btn-primary w-full font-body font-semibold py-2.5 rounded-full mt-3">
            {pwLoading ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-5 py-10 md:py-14">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--sage)' }}>Admin</p>
            <h1 className="font-display text-3xl md:text-4xl">Bazaar-e-Thrift</h1>
          </div>
          <button onClick={logout} className="font-body text-sm font-semibold flex items-center gap-1 opacity-70 hover:opacity-100">
            <LogOut size={15} /> Log Out
          </button>
        </div>

        {loading ? (
          <p className="font-body text-sm opacity-60">Loading inventory…</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <StatCard label="Total Pieces" value={stats.total} icon={Package} color="#2E2A26" />
              <StatCard label="Available" value={stats.available} icon={Circle} color="#8B9A72" />
              <StatCard label="Sold" value={stats.sold} icon={CheckCircle2} color="#9A3B3B" />
            </div>

            {actionError && <p className="font-mono text-xs mb-4" style={{ color: 'var(--red)' }}>{actionError}</p>}

            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl">Inventory</h2>
              <button onClick={openAddForm} className="btn-primary font-body font-semibold text-sm px-4 py-2 rounded-full flex items-center gap-1">
                <Plus size={16} /> Add New Piece
              </button>
            </div>

            <div className="space-y-3">
              {products.map((p) => {
                const Icon = p.category === 'Accessories' ? Gem : Shirt;
                return (
                  <div key={p._id} className="rounded-2xl p-3 flex items-center gap-4 flex-wrap" style={{ background: 'var(--card)', border: '1px solid rgba(46,42,38,0.08)' }}>
                    <div className="rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg,#C1685A,#CBA046)' }}>
                      {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <Icon size={22} color="rgba(255,255,255,0.9)" strokeWidth={1.25} />}
                    </div>
                    <div className="flex-1" style={{ minWidth: '140px' }}>
                      <p className="font-body font-semibold text-sm">{p.name}</p>
                      <p className="font-mono text-xs opacity-60 mt-0.5">{p.category} · Size {p.size} · ₹{p.price}</p>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-full" style={{ background: p.isSold ? 'rgba(154,59,59,0.12)' : 'rgba(139,154,114,0.15)', color: p.isSold ? 'var(--red)' : 'var(--sage)' }}>
                      {p.isSold ? 'Sold' : 'Available'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleToggleSold(p._id)} className="btn-ghost text-xs font-semibold px-3 py-1.5 rounded-full">
                        Mark {p.isSold ? 'Available' : 'Sold'}
                      </button>
                      <button onClick={() => openEditForm(p)} aria-label="Edit" className="p-2 rounded-full hover:opacity-70"><Pencil size={15} /></button>
                      <button onClick={() => setConfirmDeleteId(p._id)} aria-label="Delete" className="p-2 rounded-full hover:opacity-70"><Trash2 size={15} color="var(--red)" /></button>
                    </div>
                    {confirmDeleteId === p._id && (
                      <div className="w-full flex items-center gap-3 pt-2" style={{ borderTop: '1px dashed rgba(46,42,38,0.2)' }}>
                        <p className="font-body text-sm">Delete "{p.name}" for good?</p>
                        <button onClick={() => handleDelete(p._id)} className="font-body text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'var(--red)', color: '#fff' }}>Delete</button>
                        <button onClick={() => setConfirmDeleteId(null)} className="font-body text-xs font-semibold px-3 py-1 rounded-full btn-ghost">Cancel</button>
                      </div>
                    )}
                  </div>
                );
              })}
              {products.length === 0 && <p className="font-body text-sm opacity-60 text-center py-10">No pieces yet — add your first one above.</p>}
            </div>
          </>
        )}

        {formOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-5 z-30" style={{ background: 'rgba(46,42,38,0.5)' }}>
            <div className="rounded-2xl p-6 w-full overflow-y-auto" style={{ maxWidth: '480px', maxHeight: '90vh', background: 'var(--card)' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-xl">{editingId ? 'Edit Piece' : 'Add New Piece'}</h3>
                <button onClick={() => setFormOpen(false)} aria-label="Close"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="font-mono text-xs opacity-60 block mb-1">Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ border: '1px solid rgba(46,42,38,0.2)' }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-xs opacity-60 block mb-1">Price (₹)</label>
                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ border: '1px solid rgba(46,42,38,0.2)' }} />
                  </div>
                  <div>
                    <label className="font-mono text-xs opacity-60 block mb-1">Size</label>
                    <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ border: '1px solid rgba(46,42,38,0.2)' }}>
                      {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-xs opacity-60 block mb-1">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ border: '1px solid rgba(46,42,38,0.2)' }}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-xs opacity-60 block mb-1">Condition</label>
                    <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ border: '1px solid rgba(46,42,38,0.2)' }}>
                      {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-mono text-xs opacity-60 block mb-1">Material</label>
                  <input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} placeholder="e.g. Cotton Denim" className="w-full px-3 py-2 rounded-lg text-sm" style={{ border: '1px solid rgba(46,42,38,0.2)' }} />
                </div>
                <div>
                  <label className="font-mono text-xs opacity-60 block mb-1">Description / Condition Note</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg text-sm" style={{ border: '1px solid rgba(46,42,38,0.2)' }} />
                </div>
                <div>
                  <label className="font-mono text-xs opacity-60 block mb-1">Photos</label>
                  <ImageDropzone images={form.images} onChange={(imgs) => setForm({ ...form, images: imgs })} />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={saveForm} className="btn-primary flex-1 font-body font-semibold py-2.5 rounded-full flex items-center justify-center gap-1"><Check size={16} /> Save</button>
                <button onClick={() => setFormOpen(false)} className="btn-ghost flex-1 font-body font-semibold py-2.5 rounded-full">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
