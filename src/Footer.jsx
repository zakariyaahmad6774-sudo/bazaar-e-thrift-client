import React from 'react';
import { Instagram, MessageCircle } from 'lucide-react';
import { buildWhatsAppLink } from './whatsapp';
import { WHATSAPP_NUMBER, INSTAGRAM_HANDLE } from './config';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--canvas)' }}>
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="font-display text-lg">Bazaar-e-Thrift</p>
          <p className="font-body text-xs opacity-70 mt-1">One-of-a-kind finds, thrifted with love. Shipping across India.</p>
        </div>
        <div className="flex items-center gap-4">
          <a href={`https://instagram.com/${INSTAGRAM_HANDLE}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="opacity-80 hover:opacity-100">
            <Instagram size={20} />
          </a>
          <a href={buildWhatsAppLink(WHATSAPP_NUMBER, "Hi! I had a question about Bazaar-e-Thrift.")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="opacity-80 hover:opacity-100">
            <MessageCircle size={20} />
          </a>
        </div>
      </div>
      <p className="font-mono text-xs text-center opacity-50 pb-6">© 2026 Bazaar-e-Thrift</p>
    </footer>
  );
}
