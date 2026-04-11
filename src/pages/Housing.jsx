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
      setFavorites(data.properties.map(p => p._id));
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
    <div className="pt-24 min-h-screen bg-[#FDFDFF]">
      {/* Floating Toggle Button */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000]">
        <button 
          onClick={() => setShowMap(!showMap)}
          className="bg-slate-900 text-white px-8 py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-3 font-black tracking-tight hover:scale-105 transition-all text-lg hover:bg-black active:scale-95 border border-white/10"
        >
          {showMap ? <><List className="w-5 h-5" /> Show List</> : <><MapIcon className="w-5 h-5" /> Show Map View</>}
        </button>
      </div>

      <div className="max-w-[1700px] mx-auto px-6 py-12">
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs mb-3">
                <Sparkles className="w-4 h-4" />
                Verified Listings Only
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2">Student Housing</h1>
              <p className="text-slate-500 font-medium italic text-lg">{filteredProperties.length} active spaces waiting for you</p>
            </div>
            <Link to="/list-property" className="btn-gradient !rounded-3xl shadow-xl flex items-center gap-3">
              Post your property
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>
          
          <FilterBar 
            filters={filters} 
            onFilterChange={(key, val) => setFilters(prev => ({ ...prev, [key]: val }))} 
          />
        </div>

        {showMap ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-[calc(100vh-300px)] rounded-[3.5rem] overflow-hidden border-[12px] border-white shadow-2xl relative"
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
                      html: `<div class="bg-primary px-4 py-2 rounded-2xl shadow-2xl border-2 border-white font-black text-white transform hover:scale-110 transition-transform">₹${Math.floor(p.price/1000)}k</div>`,
                      iconSize: [80, 40],
                    })}
                  >
                    <Popup className="premium-popup">
                      <div className="p-3 w-56">
                        <img src={p.images?.[0]} className="w-full h-32 object-cover rounded-2xl mb-3 shadow-md" />
                        <h4 className="font-black text-slate-900 leading-tight mb-1">{p.title}</h4>
                        <div className="flex justify-between items-center">
                          <p className="text-primary font-black">₹{p.price}/mo</p>
                          <Link to={`/housing/${p._id}`} className="text-xs font-black text-slate-400 hover:text-slate-900 uppercase tracking-tighter">Details →</Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
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
                      
                      <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex gap-2">
                          <div className="flex-1 bg-white/20 backdrop-blur-xl rounded-2xl p-2 flex items-center justify-center gap-1 text-white border border-white/10">
                            <Bed className="w-3 h-3" /> <span className="text-[10px] font-black">{property.bedrooms} Bed</span>
                          </div>
                          <div className="flex-1 bg-white/20 backdrop-blur-xl rounded-2xl p-2 flex items-center justify-center gap-1 text-white border border-white/10">
                            <Bath className="w-3 h-3" /> <span className="text-[10px] font-black">{property.bathrooms} Bath</span>
                          </div>
                        </div>
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

                    <div className="p-8 pt-4">
                      <div className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
                        <MapPin className="w-3 h-3" />
                        {property.location?.city}
                      </div>
                      <h3 className="font-black text-slate-900 text-xl mb-4 line-clamp-2 leading-tight tracking-tight min-h-[3rem]">
                        {property.title}
                      </h3>
                      <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter mb-0.5">Rent starts at</span>
                          <span className="text-3xl font-black text-slate-900 italic">₹{property.price?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-xs font-black text-primary px-4 py-2 bg-primary/10 rounded-2xl">Per Month</div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Housing;
