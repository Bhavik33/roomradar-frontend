import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Globe, Share2, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 pt-16 pb-8 px-6 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto border-b border-white/5 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Vision */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center font-black italic">R</div>
              <span className="text-2xl font-black tracking-tighter">Room<span className="text-primary-light">Radar</span></span>
            </Link>
            <p className="text-slate-400 max-w-sm mb-8 font-medium leading-relaxed">
              India's first student-first housing marketplace. No brokers, no hidden fees. Just amazing homes for modern students.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary transition-colors"><Share2 className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary transition-colors"><Send className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-primary-light">Explore</h4>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li><Link to="/housing" className="hover:text-white transition-colors">Find Housing</Link></li>
              <li><Link to="/roommates" className="hover:text-white transition-colors">Find Roommates</Link></li>
              <li><Link to="/saved" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link to="/list-property" className="hover:text-white transition-colors">Post Property</Link></li>
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-primary-light">Trust & Safety</h4>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
              <ShieldCheck className="w-8 h-8 text-primary-light mb-4" />
              <p className="text-xs text-slate-400 leading-relaxed font-medium">Every listing on RoomRadar is manually verified by our team. Zero tolerance for fake listings.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
        <p>© 2026 RoomRadar. All rights Reserved.</p>
        <div className="flex items-center gap-2">
          Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> by the Student Community
        </div>
      </div>
    </footer>
  );
};

export default Footer;
