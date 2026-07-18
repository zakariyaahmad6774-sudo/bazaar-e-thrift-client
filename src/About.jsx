import React from 'react';
import { MessageCircle, Instagram, Sparkles, Hand, Ban } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { buildWhatsAppLink } from './whatsapp';
import { WHATSAPP_NUMBER, INSTAGRAM_HANDLE } from './config';

const chikanMotif = "<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44'><g fill='none' stroke='%23C1685A' stroke-width='1' opacity='0.45'><circle cx='22' cy='22' r='2'/><ellipse cx='22' cy='11' rx='3' ry='7'/><ellipse cx='22' cy='33' rx='3' ry='7'/><ellipse cx='11' cy='22' rx='7' ry='3'/><ellipse cx='33' cy='22' rx='7' ry='3'/></g></svg>";
const motifBg = 'url("data:image/svg+xml,' + chikanMotif + '")';

const values = [
  { icon: Sparkles, title: 'One-of-One', body: 'Every piece is unique. What you see is the only one that exists.' },
  { icon: Hand, title: 'Hand-Picked', body: 'Nothing here is mass-sourced — we choose every single piece ourselves.' },
  { icon: Ban, title: 'No Restocks', body: "Once it sells, it's gone. That's not a bug, that's the whole vibe." },
];

export default function About() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg,#2E2A26,#4a3f35)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: motifBg, backgroundRepeat: 'repeat', opacity: 0.5 }} />
        <div className="relative max-w-3xl mx-auto px-5 pt-16 pb-16 md:pt-20 md:pb-20 text-center" style={{ color: '#FBFAF7' }}>
          <p className="font-mono text-xs tracking-widest uppercase mb-4 opacity-80">Our Story</p>
          <h1 className="font-display text-3xl md:text-5xl font-semibold leading-tight">Every hanger tells a story.</h1>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-5 py-14 md:py-16">
        <div className="rounded-3xl p-8 md:p-10 space-y-5" style={{ background: 'var(--card)', border: '1px solid rgba(46,42,38,0.08)' }}>
          <p className="font-body text-base leading-relaxed opacity-90">Bazaar-e-Thrift started as a wardrobe clear-out between friends and turned into something way bigger than we expected. We posted a few pieces online, and before we knew it, strangers were messaging us at 2 AM asking if a jacket was still available.</p>
          <p className="font-body text-base leading-relaxed opacity-90">Now we spend our weekends digging through flea markets, family trunks, and forgotten cupboards for pieces worth a second chance. Everything gets cleaned, checked, and photographed exactly as it is — flaws included, because that's part of the story too.</p>
          <p className="font-body text-base leading-relaxed opacity-90">Every single item is one of exactly one. No restocks, no "we'll get more in your size." Once it's gone, it's gone for good — that's kind of the whole point.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="value-card p-6 text-center">
                <div className="rounded-full p-3 inline-flex mb-3" style={{ background: 'rgba(193,104,90,0.12)' }}>
                  <Icon size={20} color="var(--rose)" />
                </div>
                <p className="font-display text-lg mb-1">{v.title}</p>
                <p className="font-body text-sm opacity-75 leading-snug">{v.body}</p>
              </div>
            );
          })}
        </div>
      </div>

      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-5">
          <div className="rounded-3xl p-8 md:p-12 text-center" style={{ background: 'var(--ink)', color: 'var(--canvas)' }}>
            <p className="font-mono text-xs tracking-widest uppercase mb-2 opacity-70">Get In Touch</p>
            <h2 className="font-display text-2xl md:text-3xl mb-3">Let's talk drip.</h2>
            <p className="font-body text-sm opacity-80 max-w-md mx-auto mb-7">Got a question about a piece, sizing, or just want to say hi? We're way more active on WhatsApp and Instagram than email.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href={buildWhatsAppLink(WHATSAPP_NUMBER, 'Hi! I had a question about Bazaar-e-Thrift.')} target="_blank" rel="noopener noreferrer" className="btn-primary font-body font-semibold px-6 py-3 rounded-full flex items-center gap-2">
                <MessageCircle size={18} /> Message on WhatsApp
              </a>
              <a href={`https://instagram.com/${INSTAGRAM_HANDLE}`} target="_blank" rel="noopener noreferrer" className="font-body font-semibold px-6 py-3 rounded-full flex items-center gap-2" style={{ border: '1.5px solid rgba(251,250,247,0.5)' }}>
                <Instagram size={18} /> Follow @{INSTAGRAM_HANDLE}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
