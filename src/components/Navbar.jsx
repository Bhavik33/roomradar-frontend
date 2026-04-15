import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Menu, MessageSquare, LogOut, Heart, X, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';
import BASE_URL from '../api/config';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useChat();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Housing', path: '/housing' },
    { name: 'Roommates', path: '/roommates' },
    { name: 'Lifestyle', path: '/preferences' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[5000] transition-all duration-500 px-6 py-4 ${
      isScrolled ? 'top-2' : 'top-0'
    }`}>
      <div className={`max-w-7xl mx-auto rounded-[2rem] transition-all duration-500 ${
        isScrolled 
          ? 'glass shadow-2xl py-3 px-8 border border-white/50' 
          : 'bg-transparent py-4 px-4'
      }`}>
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white font-black text-xl italic">R</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Room<span className="gradient-text">Radar</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={`text-sm font-bold transition-all relative py-2 ${
                  location.pathname === link.path ? 'text-primary' : 'text-slate-600 hover:text-primary'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <AnimatePresence>
              {user ? (
                <div className="flex items-center gap-2 lg:gap-6">
                  <Link to="/saved" className="p-2 text-slate-600 hover:text-red-500 transition-colors relative group">
                    <Heart className="w-5 h-5 group-hover:fill-current" />
                  </Link>
                  
                  <Link to="/chats" className="p-2 text-slate-600 hover:text-primary transition-colors relative">
                    <MessageSquare className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  <div className="h-8 w-[1px] bg-slate-200 hidden lg:block" />

                  <div className="hidden lg:flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Welcome</span>
                    <span className="text-sm font-black text-slate-900 leading-none">{user.name}</span>
                  </div>

                  <button 
                    onClick={logout}
                    className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors font-bold text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn-gradient !py-2.5 !px-6 !text-sm flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}
            </AnimatePresence>

            <button 
              className="md:hidden p-2 text-slate-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[-1]"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="md:hidden absolute top-full left-6 right-6 mt-4 glass rounded-[2.5rem] p-8 shadow-2xl border border-white/50 z-50 overflow-hidden"
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-black text-slate-800 hover:text-primary transition-colors flex items-center justify-between group"
                  >
                    {link.name}
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4" />
                    </div>
                  </Link>
                ))}
                
                <hr className="border-slate-100" />
                
                {!user ? (
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-gradient text-center py-4 text-lg font-black"
                  >
                    Sign In
                  </Link>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-black text-slate-900">{user.name}</span>
                    </div>
                    <button 
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="w-full py-4 rounded-2xl bg-red-50 text-red-500 font-black text-center"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
