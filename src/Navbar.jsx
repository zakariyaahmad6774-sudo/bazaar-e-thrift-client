import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Menu, X } from 'lucide-react';
import { buildWhatsAppLink } from './whatsapp';
import { WHATSAPP_NUMBER } from './config';

const links = [
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const waLink = buildWhatsAppLink(WHATSAPP_NUMBER, "Hi! I had a question about Bazaar-e-Thrift.");

  return (
    <header className="sticky top-0 z-20" style={{ background: 'rgba(251,250,247,0.9)', backdropFilter: 'blur(6px)', borderBottom: '1px solid rgba(46,42,38,0.08)' }}>
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-semibold">Bazaar-e-Thrift</Link>
        <nav className="hidden md:flex items-center gap-6 font-body text-sm">
          {links.map((l) => (
            <Link key={l.to} to={l.to} style={{ opacity: pathname === l.to ? 1 : 0.75, fontWeight: pathname === l.to ? 600 : 400 }}>
              {l.label}
            </Link>
          ))}
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-primary font-semibold px-4 py-2 rounded-full flex items-center gap-2 text-sm">
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {open && (
        <div className="md:hidden px-5 pb-4 flex flex-col gap-3 font-body text-sm">
          {links.map((l) => <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label}</Link>)}
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-primary font-semibold px-4 py-2 rounded-full flex items-center gap-2 text-sm w-fit">
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
