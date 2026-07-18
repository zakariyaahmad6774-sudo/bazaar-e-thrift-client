import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import ProductCard from './ProductCard';
import { getProducts } from './api';

const CATEGORIES = ['Denim', 'Dresses', 'Outerwear', 'Ethnic Wear', 'Accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];
const CONDITIONS = ['Like New', 'Gently Loved', 'Well-Loved'];
const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500–1000', min: 500, max: 1000 },
  { label: '₹1000–2000', min: 1000, max: 2000 },
  { label: '₹2000+', min: 2000, max: undefined },
];

function toggle(arr, val) {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="font-mono text-xs px-3 py-1.5 rounded-full border"
      style={{
        borderColor: active ? 'var(--rose)' : 'rgba(46,42,38,0.2)',
        background: active ? 'var(--rose)' : 'transparent',
        color: active ? '#fff' : 'var(--ink)',
        transition: 'all .2s ease',
      }}
    >
      {children}
    </button>
  );
}

export default function Shop() {
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [conds, setConds] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getProducts({ category: cats, size: sizes, condition: conds, minPrice: priceRange?.min, maxPrice: priceRange?.max, sort: sortBy })
      .then(setProducts)
      .catch(() => setError('Could not load products — check the API is running.'))
      .finally(() => setLoading(false));
  }, [cats, sizes, conds, priceRange, sortBy]);

  const activeCount = cats.length + sizes.length + conds.length + (priceRange ? 1 : 0);
  const clearAll = () => { setCats([]); setSizes([]); setConds([]); setPriceRange(null); };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
        <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--sage)' }}>The Full Rack</p>
        <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
          <h1 className="font-display text-3xl md:text-4xl">Shop the Collection</h1>
          <p className="font-body text-sm opacity-70">{products.length} piece{products.length !== 1 && 's'}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="btn-ghost font-body font-semibold text-sm px-4 py-2 rounded-full flex items-center gap-2">
            <SlidersHorizontal size={15} /> Filters {activeCount > 0 && `(${activeCount})`}
          </button>
          {activeCount > 0 && (
            <button onClick={clearAll} className="font-body text-sm font-semibold flex items-center gap-1" style={{ color: 'var(--red)' }}>
              <X size={14} /> Clear
            </button>
          )}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="font-mono text-xs px-3 py-2 rounded-full ml-auto" style={{ border: '1px solid rgba(46,42,38,0.2)', background: 'var(--card)' }}>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {filtersOpen && (
          <div className="rounded-2xl p-5 mb-8 space-y-4" style={{ background: 'var(--card)', border: '1px solid rgba(46,42,38,0.08)' }}>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--sage)' }}>Category</p>
              <div className="flex flex-wrap gap-2">{CATEGORIES.map((c) => <Chip key={c} active={cats.includes(c)} onClick={() => setCats(toggle(cats, c))}>{c}</Chip>)}</div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--sage)' }}>Size</p>
              <div className="flex flex-wrap gap-2">{SIZES.map((s) => <Chip key={s} active={sizes.includes(s)} onClick={() => setSizes(toggle(sizes, s))}>{s}</Chip>)}</div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--sage)' }}>Condition</p>
              <div className="flex flex-wrap gap-2">{CONDITIONS.map((c) => <Chip key={c} active={conds.includes(c)} onClick={() => setConds(toggle(conds, c))}>{c}</Chip>)}</div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--sage)' }}>Price</p>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map((r) => (
                  <Chip key={r.label} active={priceRange?.label === r.label} onClick={() => setPriceRange(priceRange?.label === r.label ? null : r)}>{r.label}</Chip>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p className="font-body text-sm opacity-60 py-10 text-center">Loading pieces…</p>
        ) : error ? (
          <p className="font-body text-sm py-10 text-center" style={{ color: 'var(--red)' }}>{error}</p>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl mb-2">Nothing matches these filters.</p>
            <p className="font-body text-sm opacity-70 mb-5">Try loosening a filter — new pieces get added often.</p>
            <button onClick={clearAll} className="btn-primary font-body font-semibold px-6 py-3 rounded-full">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => <ProductCard key={p._id} product={p} onClick={(id) => navigate(`/product/${id}`)} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
