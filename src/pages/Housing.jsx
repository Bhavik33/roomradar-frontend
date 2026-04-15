import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bed, Bath, Heart, Trash2, Loader2, Map as MapIcon, List, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import toast from 'react-hot-toast';
import FilterBar from '../components/FilterBar';
import BASE_URL from '../api/config';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const Housing = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false); 
  const [favorites, setFavorites] = useState([]);
  
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    priceRange: 'All'
  });

  const fetchProperties = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/properties`);
      setProperties(data);
      setFilteredProperties(data);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFavorites = async () => {
    if (!user) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${BASE_URL}/api/users/favorites`, config);
      setFavorites(data.favoriteProperties.map(p => p._id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchUserFavorites();
  }, [user]);

  useEffect(() => {
    let result = properties;

    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.location.city.toLowerCase().includes(query) ||
        p.location.address.toLowerCase().includes(query)
      );
    }

    if (filters.category !== 'All') {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters.priceRange !== 'All') {
      if (filters.priceRange === '0-10000') result = result.filter(p => p.price < 10000);
      else if (filters.priceRange === '10000-20000') result = result.filter(p => p.price >= 10000 && p.price <= 20000);
      else if (filters.priceRange === '20000-50000') result = result.filter(p => p.price >= 20000 && p.price <= 50000);
      else if (filters.priceRange === '50000+') result = result.filter(p => p.price >= 50000);
    }

    setFilteredProperties(result);
  }, [filters, properties]);

  const toggleFavorite = async (id, e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${BASE_URL}/api/users/favorites/property/${id}`, {}, config);
      
      const isFav = favorites.includes(id);
      if (isFav) {
        setFavorites(favorites.filter(favId => favId !== id));
        toast.success('Removed from favorites');
      } else {
        setFavorites([...favorites, id]);
        toast.success('Saved to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${BASE_URL}/api/properties/${id}`, config);
      toast.success('Property deleted');
      setProperties(properties.filter(p => p._id !== id));
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  if (loading) {
    return (
      <div className="pt-40 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Curating best homes for you...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-32 min-h-screen bg-[#FDFDFF]">
      {/* Floating Toggle Button (Mobile Only) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] md:hidden">
        <button 
          onClick={() => setShowMap(!showMap)}
          className="bg-slate-900 text-white px-8 py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-3 font-black tracking-tight active:scale-95 border border-white/10"
        >
          {showMap ? <><List className="w-5 h-5" /> Show List</> : <><MapIcon className="w-5 h-5" /> Show Map View</>}
        </button>
      </div>

      <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-12">
        <div className="mb-8 md:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8 mb-8 md:mb-12">
            <div>
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] md:text-xs mb-2 md:mb-3">
                <Sparkles className="w-4 h-4" />
                Verified Listings Only
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">Student Housing</h1>
              <p className="text-slate-500 font-medium italic text-base md:text-lg">{filteredProperties.length} active spaces available</p>
            </div>
            <Link to="/list-property" className="btn-gradient !rounded-3xl shadow-xl flex items-center justify-center gap-3 w-full lg:w-auto">
              Post your property
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>
          
          <FilterBar 
            filters={filters} 
            onFilterChange={(key, val) => setFilters(prev => ({ ...prev, [key]: val }))} 
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8 min-h-[calc(100vh-400px)]">
          {/* Property List */}
          <div className={`flex-1 ${showMap ? 'hidden md:block' : 'block'}`}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property._id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group card-premium relative flex flex-col"
                  >
                    <Link to={`/housing/${property._id}`} className="flex-1 flex flex-col">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] m-2">
                        <img 
                          src={property.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'} 
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="absolute top-4 left-4 bg-white/30 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest">
                          {property.category}
                        </div>
                        
                        <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
                          <button 
                            onClick={(e) => toggleFavorite(property._id, e)}
                            className={`w-11 h-11 backdrop-blur-xl rounded-full flex items-center justify-center transition-all shadow-xl border border-white/20 ${
                              favorites.includes(property._id) ? 'bg-red-500 text-white' : 'bg-white/30 text-white hover:bg-white hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${favorites.includes(property._id) ? 'fill-current' : ''}`} />
                          </button>
                          {user?._id === (property.owner?._id || property.owner) && (
                            <button onClick={(e) => handleDelete(property._id, e)} className="w-11 h-11 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-red-500 shadow-xl border border-white/10 backdrop-blur-md">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-6 pt-2">
                        <div className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                          <MapPin className="w-3 h-3" />
                          {property.location?.city}
                        </div>
                        <h3 className="font-black text-slate-900 text-lg mb-3 line-clamp-2 leading-tight tracking-tight min-h-[2.5rem]">
                          {property.title}
                        </h3>
                        <div className="flex items-end justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Rent starts at</span>
                            <span className="text-2xl font-black text-slate-900 italic">₹{property.price?.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="text-[10px] font-black text-primary px-3 py-1 bg-primary/10 rounded-xl">Month</div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Map Section */}
          <div className={`md:w-[400px] lg:w-[600px] xl:w-[800px] sticky top-32 h-[calc(100vh-160px)] z-10 ${!showMap ? 'hidden md:block' : 'block fixed inset-0 md:relative md:inset-auto z-[3000] md:z-10 pt-20 md:pt-0 pb-20 md:pb-0 px-4 md:px-0 bg-white md:bg-transparent'}`}>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border-[6px] md:border-[12px] border-white shadow-2xl relative"
            >
              <MapContainer center={[28.6139, 77.2090]} zoom={11} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {filteredProperties.map(p => (
                  p.location?.coordinates && (
                    <Marker 
                      key={p._id}
                      position={[p.location.coordinates.lat, p.location.coordinates.lng]}
                      icon={L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div class="bg-primary px-3 py-1.5 rounded-xl shadow-2xl border-2 border-white font-black text-white transform hover:scale-110 transition-transform text-xs">₹${Math.floor(p.price/1000)}k</div>`,
                        iconSize: [60, 30],
                      })}
                    >
                      <Popup className="premium-popup">
                        <div className="p-2 w-48">
                          <img src={p.images?.[0]} className="w-full h-24 object-cover rounded-xl mb-2 shadow-sm" />
                          <h4 className="font-black text-slate-900 text-sm leading-tight mb-1">{p.title}</h4>
                          <Link to={`/housing/${p._id}`} className="text-xs font-black text-primary uppercase">Details →</Link>
                        </div>
                      </Popup>
                    </Marker>
                  )
                ))}
              </MapContainer>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Housing;
