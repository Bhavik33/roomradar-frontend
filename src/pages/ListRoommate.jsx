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
    foodHabits: 'Any',
    city: '',
    university: '',
    occupation: 'Student',
    moveInDate: '',
    smoking: 'No',
    drinking: 'No',
    cleanliness: 5,
    sleepSchedule: 'Flexible',
    guestPolicy: 'Occasional',
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
          cleanliness: Number(formData.cleanliness),
          sleepSchedule: formData.sleepSchedule,
          guestPolicy: formData.guestPolicy,
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
    <div className="pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 card-shadow border border-slate-50"
      >
        <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
            <User className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Roommate Profile</h1>
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
                <option>Veg</option><option>Non-Veg</option><option>Any</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Smoking</label>
              <select name="smoking" value={formData.smoking} onChange={handleInputChange} className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none">
                <option>No</option><option>Yes</option><option>Social</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Drinking</label>
              <select name="drinking" value={formData.drinking} onChange={handleInputChange} className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none">
                <option>No</option><option>Yes</option><option>Social</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-3xl border border-slate-100">
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Cleanliness (1-10)</label>
                <input type="number" name="cleanliness" min="1" max="10" value={formData.cleanliness} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200" />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Sleep Schedule</label>
                <select name="sleepSchedule" value={formData.sleepSchedule} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200">
                   <option>Early Bird</option><option>Night Owl</option><option>Flexible</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Guest Policy</label>
                <select name="guestPolicy" value={formData.guestPolicy} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200">
                   <option>None</option><option>Occasional</option><option>Frequent</option>
                </select>
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
