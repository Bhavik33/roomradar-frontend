import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Camera, MapPin, IndianRupee, Home, Wifi, Shield, Car, 
  Coffee, ArrowLeft, ArrowRight, Check, Loader2, Info
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import BASE_URL from '../api/config';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position === null ? null : <Marker position={position} />;
};

const MapFlyTo = ({ position }) => {
  const map = useMapEvents({});
  React.useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);
  return null;
};

const ListProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [position, setPosition] = useState([28.6139, 77.2090]); // Delhi default
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    address: '',
    price: '',
    deposit: '',
    bedrooms: '1',
    bathrooms: '1',
    category: 'Flat',
    furnishing: 'Unfurnished',
    preferredTenant: 'Any',
    amenities: [],
  });

  const amenitiesList = [
    { label: 'WiFi', icon: <Wifi className="w-4 h-4" /> },
    { label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { label: 'Parking', icon: <Car className="w-4 h-4" /> },
    { label: 'Furnished', icon: <Home className="w-4 h-4" /> },
    { label: 'Food included', icon: <Coffee className="w-4 h-4" /> },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const mockImageUrls = files.map(() => `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop`);
    setImages(prev => [...prev, ...mockImageUrls]);
    toast.success(`${files.length} images added (simulated)`);
  };

  const toggleAmenity = (label) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(label) 
        ? prev.amenities.filter(a => a !== label)
        : [...prev.amenities, label]
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=1`);
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const newPos = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPos);
        toast.success(`Found: ${response.data[0].display_name.split(',')[0]}`);
      } else {
        toast.error('Location not found');
      }
    } catch (error) {
      toast.error('Error searching location');
    } finally {
      setSearchLoading(false);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to publish');
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      const payload = {
        ...formData,
        location: {
          city: formData.city,
          address: formData.address,
          universityNearBy: "Nearby University",
          coordinates: { lat: position[0], lng: position[1] }
        },
        price: Number(formData.price),
        deposit: Number(formData.deposit),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
        availableDate: new Date(),
      };

      await axios.post(`${BASE_URL}/api/properties`, payload, config);
      toast.success('Property published successfully!');
      navigate('/housing');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to publish property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold text-slate-900">List Your Property</h1>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 w-12 rounded-full transition-all ${step >= i ? 'bg-primary' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-[3rem] p-12 card-shadow border border-slate-50">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold text-slate-800">Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Title</label>
                  <input 
                    name="title"
                    type="text" 
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Luxury 1BHK near DU"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Property Type</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-primary transition-all"
                  >
                    <option>Flat</option><option>PG</option><option>Hostel</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Furnishing</label>
                  <select 
                    name="furnishing"
                    value={formData.furnishing}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-primary transition-all"
                  >
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Fully Furnished</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Preferred Tenant</label>
                  <select 
                    name="preferredTenant"
                    value={formData.preferredTenant}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-primary transition-all"
                  >
                    <option>Any</option>
                    <option>Boys</option>
                    <option>Girls</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell students about your place..."
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-primary transition-all"
                />
              </div>
              <button onClick={nextStep} className="btn-gradient w-full py-4 flex items-center justify-center gap-2">
                Continue to Location
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <button onClick={prevStep} className="p-2 hover:bg-slate-100 rounded-full">
                  <ArrowLeft className="w-6 h-6 text-slate-600" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800">Set Location</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">City</label>
                    <input 
                      name="city"
                      type="text" 
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Delhi"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Exact Address</label>
                    <input 
                      name="address"
                      type="text" 
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. House No. 24, GTB Nagar"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100"
                    />
                 </div>
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation()}
                  placeholder="Search university, area or city..."
                  className="w-full pl-12 pr-24 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-primary transition-all"
                />
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <button 
                  type="button"
                  onClick={handleSearchLocation}
                  disabled={searchLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center gap-2"
                >
                  {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                </button>
              </div>

              <div className="h-[300px] rounded-3xl overflow-hidden shadow-inner border-4 border-slate-50 relative group">
                <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker position={position} setPosition={setPosition} />
                  <MapFlyTo position={position} />
                </MapContainer>
              </div>
              <p className="text-xs text-slate-500 italic flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Click on the map to pin the exact geo-location for students to find you easily.
              </p>

              <button onClick={nextStep} className="btn-gradient w-full py-4 flex items-center justify-center gap-2">
                Continue to Details
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <button onClick={prevStep} className="p-2 hover:bg-slate-100 rounded-full">
                  <ArrowLeft className="w-6 h-6 text-slate-600" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800">Final Details & Images</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Price per Month</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      name="price"
                      type="number" 
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00" 
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Security Deposit</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      name="deposit"
                      type="number" 
                      value={formData.deposit}
                      onChange={handleInputChange}
                      placeholder="Refundable Amount" 
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Room Config</label>
                  <div className="flex gap-4">
                     <input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleInputChange} placeholder="Beds" className="w-1/2 px-4 py-4 rounded-2xl bg-slate-50 border border-slate-100" />
                     <input name="bathrooms" type="number" value={formData.bathrooms} onChange={handleInputChange} placeholder="Baths" className="w-1/2 px-4 py-4 rounded-2xl bg-slate-50 border border-slate-100" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {amenitiesList.map(a => (
                      <button 
                        key={a.label}
                        type="button"
                        onClick={() => toggleAmenity(a.label)}
                        className={`px-3 py-2 rounded-xl border-2 flex items-center gap-2 transition-all ${formData.amenities.includes(a.label) ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                      >
                        {a.icon}
                        <span className="text-[10px] uppercase font-bold">{a.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Upload Photos</label>
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Camera className="w-8 h-8 text-slate-300" />
                    <input type="file" multiple className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              <button 
                onClick={handlePublish}
                disabled={loading}
                className="w-full bg-slate-900 text-white py-5 rounded-3xl text-xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
                {loading ? 'Publishing...' : 'Publish Property'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ListProperty;
