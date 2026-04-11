import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Bed, Bath, IndianRupee, Wifi, Shield, 
  Car, Home, Phone, Share2, Heart, MessageCircle, Loader2 
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import BASE_URL from '../api/config';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { startConversation } = useChat();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/properties/${id}`);
        console.log('Property Data Fetched:', data);
        setProperty(data);
      } catch (error) {
        toast.error('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleContact = async () => {
    if (!user) {
      toast.error('Please login to chat with owner');
      navigate('/login');
      return;
    }
    if (user._id === property.owner._id) {
       toast.error("You can't message yourself!");
       return;
    }
    await startConversation(property.owner._id);
    navigate('/chats');
  };

  if (loading) {
    return (
      <div className="pt-40 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Fetching details...</p>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[16/10] rounded-[2.5rem] overflow-hidden card-shadow"
          >
            <img src={property.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200'} alt="main" className="w-full h-full object-cover" />
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {property.images?.slice(1, 3).map((img, i) => (
              <div key={i} className="aspect-[16/10] rounded-[1.5rem] overflow-hidden border border-slate-100">
                <img src={img} alt="sub" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-4 py-1 bg-primary/10 rounded-full text-primary text-sm font-bold uppercase tracking-wider">
                {property.category} • Available
              </span>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                  <Share2 className="w-4 h-4 text-slate-600" />
                </button>
                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                  <Heart className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{property.title}</h1>
            <div className="flex items-center gap-2 text-slate-500 text-lg">
              <MapPin className="w-5 h-5 text-primary" />
              {property.location?.address}, {property.location?.city}
            </div>
          </div>

          <div className="flex items-center gap-12 py-8 border-y border-slate-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
                {property.price?.toLocaleString('en-IN')}
              </div>
              <div className="text-slate-500 text-sm">Monthly Rent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">{property.bedrooms}</div>
              <div className="text-slate-500 text-sm">Bedrooms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">{property.bathrooms}</div>
              <div className="text-slate-500 text-sm">Bathrooms</div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Description</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              {property.description}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Amenities</h3>
            <div className="flex flex-wrap gap-4">
              {property.amenities?.map(item => (
                <div key={item} className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 font-medium text-slate-700">
                  {item === 'WiFi' && <Wifi className="w-4 h-4 text-primary" />}
                  {item === 'Security' && <Shield className="w-4 h-4 text-primary" />}
                  {item === 'Parking' && <Car className="w-4 h-4 text-primary" />}
                  {item === 'Furnished' && <Home className="w-4 h-4 text-primary" />}
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Location</h3>
            <div className="h-[250px] rounded-3xl overflow-hidden border-2 border-slate-50 shadow-inner group mb-8">
              {(() => {
                const coords = property.location?.coordinates;
                let position = null;
                
                if (Array.isArray(coords) && coords.length === 2) {
                  position = [Number(coords[0]), Number(coords[1])];
                } else if (coords && typeof coords === 'object') {
                  const lat = coords.lat || coords.latitude;
                  const lng = coords.lng || coords.longitude;
                  if (lat != null && lng != null) {
                    position = [Number(lat), Number(lng)];
                  }
                }

                if (position && !isNaN(position[0]) && !isNaN(position[1])) {
                  return (
                    <MapContainer 
                      center={position} 
                      zoom={15} 
                      style={{ height: '100%', width: '100%' }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={position} />
                    </MapContainer>
                  );
                }

                return (
                  <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <MapPin className="w-6 h-6" />
                    <span className="text-sm font-medium">Map currently unavailable for this listing</span>
                    {/* Debug data in hidden tag */}
                    <span className="hidden">{JSON.stringify(property.location?.coordinates)}</span>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-xl border-2 border-white/20">
                {property.owner?.name?.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-lg">Posted by {property.owner?.name}</div>
                <div className="text-slate-400 text-sm">Verified Owner</div>
              </div>
            </div>
            <button 
              onClick={handleContact}
              className="flex-1 btn-gradient !py-4 w-full md:w-auto flex items-center justify-center gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              Chat with Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
