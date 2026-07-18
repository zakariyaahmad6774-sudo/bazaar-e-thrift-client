import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gem, Shirt, ArrowRight, Instagram } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import Reveal from './Reveal';
import ProductCard from './ProductCard';
import { getProducts } from './api';

const chikanMotif = "<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44'><g fill='none' stroke='%23C1685A' stroke-width='1' opacity='0.45'><circle cx='22' cy='22' r='2'/><ellipse cx='22' cy='11' rx='3' ry='7'/><ellipse cx='22' cy='33' rx='3' ry='7'/><ellipse cx='11' cy='22' rx='7' ry='3'/><ellipse cx='33' cy='22' rx='7' ry='3'/></g></svg>";
const motifBg = 'url("data:image/svg+xml,' + chikanMotif + '")';

const featured = [
  { name: 'The Monsoon Edit', tag: 'Curated Edit', icon: Gem, grad: 'linear-gradient(135deg,#8B9A72,#2E2A26)' },
  { name: 'Worn-in Denim', tag: '5 pieces', icon: Shirt, grad: 'linear-gradient(135deg,#C1685A,#CBA046)' },
  { name: 'Festive Brocade', tag: '3 pieces', icon: Gem, grad: 'linear-gradient(135deg,#9A3B3B,#CBA046)' },
];

const igSquares = [
  'linear-gradient(135deg,#C1685A,#CBA046)', 'linear-gradient(135deg,#8B9A72,#CBA046)',
  'linear-gradient(135deg,#2E2A26,#8B9A72)', 'linear-gradient(135deg,#9A3B3B,#C1685A)',
  'linear-gradient(135deg,#CBA046,#8B9A72)', 'linear-gradient(135deg,#C1685A,#2E2A26)',
];

export default function Home() {
  const navigate = useNavigate();
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    getProducts({ sort: 'newest' })
      .then((data) => setNewArrivals(data.slice(0, 6)))
      .catch(() => setNewArrivals([]));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg,#2E2A26,#4a3f35)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: motifBg, backgroundRepeat: 'repeat', opacity: 0.5 }} />
        <div className="relative max-w-6xl mx-auto px-5 pt-16 pb-20 md:pt-24 md:pb-28 text-center" style={{ color: '#FBFAF7' }}>
          <Reveal>
            <p className="font-mono text-xs tracking-widest uppercase mb-4 opacity-80">One-of-One Vintage Drops</p>
            <h1 className="font-display text-4xl md:text-6xl font-semibold leading-tight max-w-3xl mx-auto">One-of-a-kind finds,<br />thrifted with love.</h1>
            <p className="font-body text-base md:text-lg mt-5 max-w-md mx-auto opacity-85">Every piece is pre-loved, hand-picked, and one of exactly one. Once it's gone, it's gone for good.</p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <button onClick={() => navigate('/shop')} className="btn-primary font-body font-semibold px-7 py-3 rounded-full flex items-center gap-2">
                Shop the Collection <ArrowRight size={16} />
              </button>
              <a href="#new" className="btn-ghost-light font-body font-semibold px-7 py-3 rounded-full">See New Arrivals</a>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5">
        <section id="new" className="pt-16 pb-4">
          <Reveal>
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--sage)' }}>Just In</p>
                <h2 className="font-display text-2xl md:text-3xl">New Arrivals</h2>
              </div>
              <button onClick={() => navigate('/shop')} className="font-body text-sm font-semibold hidden md:flex items-center gap-1" style={{ color: 'var(--rose)' }}>
                View all <ArrowRight size={14} />
              </button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            {newArrivals.length === 0 ? (
              <p className="font-body text-sm opacity-60">New pieces are on their way — check back soon.</p>
            ) : (
              <div className="scroll-row">
                {newArrivals.map((p) => <ProductCard key={p._id} product={p} width="168px" onClick={(id) => navigate(`/product/${id}`)} />)}
              </div>
            )}
          </Reveal>
        </section>

        <section id="edit" className="pt-16 pb-4">
          <Reveal>
            <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--sage)' }}>Curated Edit</p>
            <h2 className="font-display text-2xl md:text-3xl mb-6">The Monsoon Edit</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Reveal>
              <div className="feature-card" style={{ background: featured[0].grad, height: '280px' }}>
                <div className="absolute inset-0 flex flex-col justify-end p-6" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.45))' }}>
                  <Gem size={28} className="mb-3 opacity-90" />
                  <p className="font-mono text-xs uppercase tracking-widest opacity-85">{featured[0].tag}</p>
                  <h3 className="font-display text-2xl mt-1">{featured[0].name}</h3>
                  <button onClick={() => navigate('/shop')} className="btn-ghost-light font-body text-sm font-semibold px-4 py-2 rounded-full mt-3 self-start">View the Edit</button>
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 gap-4">
              {featured.slice(1).map((f, i) => {
                const Icon = f.icon;
                return (
                  <Reveal key={f.name} delay={0.1 + i * 0.08}>
                    <div className="feature-card" style={{ background: f.grad, height: '132px' }}>
                      <div className="absolute inset-0 flex flex-col justify-end p-5" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.4))' }}>
                        <Icon size={20} className="mb-1 opacity-90" />
                        <p className="font-mono text-xs uppercase tracking-widest opacity-80">{f.tag}</p>
                        <h3 className="font-display text-lg">{f.name}</h3>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="story" className="pt-20 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-3xl p-8 md:p-12" style={{ background: 'var(--card)', border: '1px solid rgba(46,42,38,0.08)' }}>
            <Reveal>
              <div className="rounded-2xl overflow-hidden" style={{ height: '220px', background: 'linear-gradient(135deg,#8B9A72,#2E2A26)' }} />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--sage)' }}>Our Story</p>
              <h2 className="font-display text-2xl md:text-3xl leading-snug mb-4">Every piece has already lived a life.</h2>
              <p className="font-body text-base leading-relaxed opacity-90">Bazaar-e-Thrift began as a wardrobe clear-out between friends and slowly turned into something bigger. We hunt through flea markets, family trunks, and forgotten cupboards for pieces worth a second chance — then photograph them exactly as they are, flaws included. No two hangers here ever look the same.</p>
              <button onClick={() => navigate('/about')} className="font-body font-semibold text-sm mt-4 inline-flex items-center gap-1" style={{ color: 'var(--rose)' }}>
                Read our full story <ArrowRight size={14} />
              </button>
            </Reveal>
          </div>
        </section>

        <section className="pb-20">
          <Reveal>
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--sage)' }}>Follow Along</p>
                <h2 className="font-display text-2xl md:text-3xl">@baza.e.thrift</h2>
              </div>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="font-body text-sm font-semibold hidden md:flex items-center gap-1" style={{ color: 'var(--rose)' }}>
                <Instagram size={15} /> Follow
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {igSquares.map((g, i) => (
                <div key={i} className="ig-square" style={{ background: g, aspectRatio: '1/1' }}>
                  <div className="ig-overlay absolute inset-0 flex items-center justify-center">
                    <Instagram size={20} color="#fff" />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </div>

      <Footer />
    </div>
  );
}
