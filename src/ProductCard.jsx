import React from 'react';
import { Shirt, Gem } from 'lucide-react';

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg,#C1685A,#CBA046)', 'linear-gradient(135deg,#8B9A72,#CBA046)',
  'linear-gradient(135deg,#9A3B3B,#CBA046)', 'linear-gradient(135deg,#2E2A26,#8B9A72)',
];

function gradientFor(id) {
  const str = String(id || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash + str.charCodeAt(i)) % FALLBACK_GRADIENTS.length;
  return FALLBACK_GRADIENTS[hash];
}

export default function ProductCard({ product, onClick, width }) {
  const id = product._id || product.id;
  const Icon = product.category === 'Accessories' ? Gem : Shirt;
  const grad = gradientFor(id);

  return (
    <div className="product-card pt-3 cursor-pointer flex-shrink-0" style={width ? { width } : {}} onClick={() => onClick(id)}>
      <div className="swing-notch" />
      <div className="mx-3 rounded-2xl overflow-hidden" style={{ height: '160px', background: grad }}>
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} loading="lazy" className="w-full h-full object-cover product-img" />
        ) : (
          <div className="product-img w-full h-full flex items-center justify-center">
            <Icon size={38} color="rgba(255,255,255,0.9)" strokeWidth={1.25} />
          </div>
        )}
      </div>
      {product.isSold && (
        <div className="absolute flex justify-center" style={{ top: '68px', left: 0, right: 0 }}>
          <span className="stamp font-mono font-bold px-3 py-1 rounded-full text-xs" style={{ background: 'var(--card)' }}>SOLD</span>
        </div>
      )}
      <div className="p-3">
        <p className="font-body font-semibold text-sm leading-snug">{product.name}</p>
        <p className="font-mono text-xs opacity-70 mt-0.5">Size {product.size} · {product.category}</p>
        <p className="font-mono text-sm mt-1" style={{ color: 'var(--red)' }}>₹{product.price}</p>
      </div>
    </div>
  );
}
