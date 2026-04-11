import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, IndianRupee, MapPin, Coffee, Utensils, 
  Moon, Briefcase, Plus, Check, ArrowRight, Loader2, Calendar, Cigarette, Wine
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../api/config';

const ListRoommate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    gender: 'Any',
    budget: '',
    foodHabits: 'Both',
    lifestyle: 'Early Bird',
    city: '',
    university: '',
    occupation: 'Student',
    moveInDate: '',
    smoking: false,
    drinking: false,
  });

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login first');
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      const payload = {
        ...formData,
        habits: {
          smoking: formData.smoking,
          drinking: formData.drinking,
        }
      };

      await axios.post(`${BASE_URL}/api/roommates`, payload, config);
      toast.success('Profile created successfully!');
      navigate('/roommates');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to list profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] p-12 card-shadow border border-slate-50"
      >
        <div className="flex items-center gap-6 mb-10">
          <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900">Roommate Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Your University</label>
              <input 
                name="university"
                type="text" 
                value={formData.university}
                onChange={handleInputChange}
                placeholder="e.g. University of Mumbai"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-secondary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Target City</label>
              <input 
                name="city"
                type="text" 
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g. Mumbai"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-secondary transition-all"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Occupation</label>
              <select name="occupation" value={formData.occupation} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none">
                <option>Student</option>
                <option>Working Professional</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Move-in Date</label>
              <div className="relative">
                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  name="moveInDate"
                  type="date" 
                  value={formData.moveInDate}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">About You</label>
            <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="4"
              placeholder="Tell potential roommates about your lifestyle, hobbies, and what you're looking for..."
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-secondary transition-all"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Budget (₹)</label>
              <input 
                name="budget"
                type="number" 
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="Max Rent" 
                className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Food</label>
              <select name="foodHabits" value={formData.foodHabits} onChange={handleInputChange} className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none">
                <option>Veg</option><option>Non-Veg</option><option>Both</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none">
                <option>Male</option><option>Female</option><option>Any</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Habit</label>
              <select name="lifestyle" value={formData.lifestyle} onChange={handleInputChange} className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none">
                <option>Early Bird</option><option>Late Night</option>
              </select>
            </div>
          </div>

          <div className="flex gap-8 items-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
             <div className="flex items-center gap-3">
                <input type="checkbox" name="smoking" id="smoking" checked={formData.smoking} onChange={handleInputChange} className="w-5 h-5 accent-secondary" />
                <label htmlFor="smoking" className="flex items-center gap-2 text-slate-700 font-bold">
                  <Cigarette className="w-4 h-4" /> Smoking
                </label>
             </div>
             <div className="flex items-center gap-3">
                <input type="checkbox" name="drinking" id="drinking" checked={formData.drinking} onChange={handleInputChange} className="w-5 h-5 accent-secondary" />
                <label htmlFor="drinking" className="flex items-center gap-2 text-slate-700 font-bold">
                  <Wine className="w-4 h-4" /> Drinking
                </label>
             </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white py-5 rounded-3xl text-xl font-bold flex items-center justify-center gap-3 hover:bg-secondary-dark transition-all shadow-xl shadow-secondary/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
            {loading ? 'Listing...' : 'Find My Roommate'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ListRoommate;
