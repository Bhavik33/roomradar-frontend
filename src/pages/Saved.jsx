import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Bed, Bath, Trash2, Loader2, Home, Sparkles, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import BASE_URL from '../api/config';

const Saved = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchSaved = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${BASE_URL}/api/users/favorites`, config);
        setSavedProperties(data.favoriteProperties || []);
      } catch (error) {
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [user, navigate]);

  const removeFavorite = async (id, e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${BASE_URL}/api/users/favorites/property/${id}`, {}, config);
      setSavedProperties(savedProperties.filter(p => p._id !== id));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  if (loading) {
    return (
      <div className="pt-40 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="mt-4 text-slate-500 font-medium italic">Fetching your favorite spots...</p>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-16">
        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs mb-3">
          <Heart className="w-4 h-4 fill-current" />
          Personal Collection
        </div>
        <h1 className="text-6xl font-black text-slate-900 leading-none mb-4 tracking-tighter">My Wishlist.</h1>
        <p className="text-slate-500 text-lg font-medium italic">You've shortlisted {savedProperties.length} dream spaces</p>
      </div>

      {savedProperties.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center border border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
          <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 relative z-10 transition-transform hover:scale-110">
            <Heart className="w-12 h-12 text-primary/40" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight relative z-10">Quiet around here.</h2>
          <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium relative z-10">Your next home is just a heart-click away. Start exploring our verified student hubs.</p>
          <Link to="/housing" className="btn-gradient !flex items-center gap-3 group relative z-10">
            Browse Housing
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          <AnimatePresence>
            {savedProperties.map((property, index) => (
              <motion.div
                key={property._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group card-premium relative flex flex-col"
              >
                <Link to={`/housing/${property._id}`} className="flex-1 flex flex-col p-2">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-4">
                    <img 
                      src={property.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'} 
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <button 
                      onClick={(e) => removeFavorite(property._id, e)}
                      className="absolute top-4 right-4 w-11 h-11 bg-white/20 backdrop-blur-xl border border-white/20 text-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all hover:bg-red-500 group/btn"
                    >
                      <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <div className="absolute top-4 left-4 bg-white/30 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest">
                      {property.category}
                    </div>
                  </div>

                  <div className="p-6 pt-2">
                    <h3 className="font-black text-slate-900 text-xl mb-3 line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
                      <MapPin className="w-3 h-3 text-primary" />
                      {property.location?.city}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-0.5">Monthly Rent</span>
                        <span className="text-2xl font-black text-slate-900 italic">₹{property.price?.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex gap-3 text-slate-400">
                        <div className="flex items-center gap-1 text-[10px] font-black"><Bed className="w-4 h-4" />{property.bedrooms}</div>
                        <div className="flex items-center gap-1 text-[10px] font-black"><Bath className="w-4 h-4" />{property.bathrooms}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Saved;
