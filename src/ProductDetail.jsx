import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shirt, Gem, MessageCircle, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import ProductCard from './ProductCard';
import { getProduct } from './api';
import { buildWhatsAppLink, productWhatsAppMessage } from './whatsapp';
import { WHATSAPP_NUMBER } from './config';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    setImgIndex(0);
    getProduct(id)
      .then((data) => { setProduct(data.product); setRelated(data.related || []); })
      .catch(() => setError('Could not find this piece — it may have already sold or been removed.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageShell><p className="font-body text-sm opacity-60 py-16 text-center">Loading…</p></PageShell>;
  if (error || !product) return <PageShell><p className="font-body text-sm py-16 text-center" style={{ color: 'var(--red)' }}>{error || 'Product not found.'}</p></PageShell>;

  const Icon = product.category === 'Accessories' ? Gem : Shirt;
  const images = product.images?.length ? product.images : [null]; // null = show placeholder icon

  return (
    <PageShell>
      <button onClick={() => navigate('/shop')} className="font-body text-sm font-semibold flex items-center gap-1 mb-6" style={{ color: 'var(--rose)' }}>
        <ArrowLeft size={16} /> Back to Shop
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="rounded-2xl overflow-hidden relative" style={{ height: '360px', background: 'linear-gradient(135deg,#C1685A,#CBA046)', border: '1px solid rgba(46,42,38,0.08)' }}>
            {images[imgIndex] ? (
              <img src={images[imgIndex]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon size={72} color="rgba(255,255,255,0.9)" strokeWidth={1} />
              </div>
            )}
            {product.isSold && (
              <div className="absolute flex justify-center" style={{ top: '18px', left: 0, right: 0 }}>
                <span className="stamp font-mono font-bold px-4 py-1.5 rounded-full text-sm" style={{ background: 'var(--card)' }}>SOLD</span>
              </div>
            )}
            {images.length > 1 && (
              <>
                <button onClick={() => setImgIndex((imgIndex + images.length - 1) % images.length)} className="absolute top-1/2 left-3" style={{ transform: 'translateY(-50%)' }} aria-label="Previous image">
                  <div className="rounded-full p-2" style={{ background: 'rgba(255,255,255,0.85)' }}><ChevronLeft size={18} /></div>
                </button>
                <button onClick={() => setImgIndex((imgIndex + 1) % images.length)} className="absolute top-1/2 right-3" style={{ transform: 'translateY(-50%)' }} aria-label="Next image">
                  <div className="rounded-full p-2" style={{ background: 'rgba(255,255,255,0.85)' }}><ChevronRight size={18} /></div>
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-3">
              {images.map((_, i) => (
                <button key={i} onClick={() => setImgIndex(i)} className="rounded-full" style={{ width: '8px', height: '8px', background: i === imgIndex ? 'var(--rose)' : 'rgba(46,42,38,0.2)' }} />
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--sage)' }}>{product.category} · One of One</p>
          <h1 className="font-display text-3xl md:text-4xl mb-2">{product.name}</h1>
          <p className="font-mono text-2xl mb-5" style={{ color: 'var(--red)' }}>₹{product.price}</p>

          <div className="rounded-2xl p-5 mb-6 space-y-3" style={{ background: 'var(--card)', border: '1px solid rgba(46,42,38,0.08)' }}>
            <div className="flex justify-between font-body text-sm"><span className="opacity-60">Size</span><span className="font-semibold">{product.size}</span></div>
            <div className="flex justify-between font-body text-sm"><span className="opacity-60">Material</span><span className="font-semibold">{product.material || '—'}</span></div>
            <div className="flex justify-between font-body text-sm"><span className="opacity-60">Condition</span><span className="font-semibold">{product.condition}</span></div>
            {product.description && (
              <div className="font-body text-sm opacity-80 pt-1" style={{ borderTop: '1px dashed rgba(46,42,38,0.2)' }}>{product.description}</div>
            )}
          </div>

          {product.isSold ? (
            <div className="rounded-full text-center font-body font-semibold px-6 py-3" style={{ background: 'rgba(46,42,38,0.08)' }}>
              This piece has found a home — check New Arrivals for what's next.
            </div>
          ) : (
            <a href={buildWhatsAppLink(WHATSAPP_NUMBER, productWhatsAppMessage(product))} target="_blank" rel="noopener noreferrer" className="btn-primary font-body font-semibold px-7 py-3.5 rounded-full flex items-center justify-center gap-2 w-full">
              <MessageCircle size={18} /> Order on WhatsApp
            </a>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--sage)' }}>Keep Browsing</p>
          <h2 className="font-display text-2xl mb-5">You May Also Like</h2>
          <div className="scroll-row">
            {related.map((p) => <ProductCard key={p._id} product={p} width="168px" onClick={(pid) => navigate(`/product/${pid}`)} />)}
          </div>
        </div>
      )}
    </PageShell>
  );
}

function PageShell({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">{children}</div>
      <Footer />
    </div>
  );
}
