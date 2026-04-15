import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Moon, Sun, Coffee, Wind, Shield, 
  Trash2, Save, Info, CheckCircle2 
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import BASE_URL from '../api/config';

const Preferences = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [preferences, setPreferences] = useState({
    gender: 'Any',
    budget: '',
    foodHabits: 'Any',
    lifestyle: '',
    cleanliness: 5,
    sleepSchedule: 'Flexible',
    smoking: 'No',
    drinking: 'No',
    guestPolicy: 'Occasional',
  });

  useEffect(() => {
    if (user && user.preferences) {
      setPreferences(prev => ({
        ...prev,
        ...user.preferences
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      const payload = {
        ...preferences,
        budget: Number(preferences.budget),
        cleanliness: Number(preferences.cleanliness)
      };

      await axios.put(`${BASE_URL}/api/users/preferences`, payload, config);
      toast.success('Lifestlye preferences saved!');
      
      // Optionally update user in context if needed, but for now we trust the DB
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const options = {
    foodHabits: ['Any', 'Veg', 'Non-Veg'],
    sleepSchedule: ['Early Bird', 'Night Owl', 'Flexible'],
    smoking: ['Yes', 'No', 'Social'],
    drinking: ['Yes', 'No', 'Social'],
    guestPolicy: ['None', 'Occasional', 'Frequent'],
  };

  if (!user) return (
    <div className="pt-40 text-center">
      <h2 className="text-2xl font-bold">Please login to set preferences</h2>
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Your Lifestyle</h1>
        <p className="text-slate-500 text-lg">
          Set your preferences to find the perfect roommate 
          match! Your compatibility score will appear on listings.
        </p>
      </div>

      <div className="bg-white rounded-[3rem] p-12 card-shadow border border-slate-50">
        <form onSubmit={handleSave} className="space-y-12">
          
          {/* Daily Habits Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Coffee className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Daily Habits</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Cleanliness Score (1-10)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="1" max="10" 
                    name="cleanliness"
                    value={preferences.cleanliness}
                    onChange={handleInputChange}
                    className="flex-1 accent-primary h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                    {preferences.cleanliness}
                  </span>
                </div>
                <p className="text-xs text-slate-400">1 = Messy, 10 = Organizing Freak</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Sleep Schedule</label>
                <div className="flex gap-2">
                  {options.sleepSchedule.map(opt => (
                    <button
                      key={opt} type="button"
                      onClick={() => setPreferences(prev => ({ ...prev, sleepSchedule: opt }))}
                      className={`flex-1 py-3 px-2 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-tighter ${preferences.sleepSchedule === opt ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                    >
                      {opt === 'Early Bird' && <Sun className="w-3 h-3 inline mr-1" />}
                      {opt === 'Night Owl' && <Moon className="w-3 h-3 inline mr-1" />}
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Lifestyle Preferences */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                <Wind className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Lifestyle Choice</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {['smoking', 'drinking', 'foodHabits'].map(key => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block capitalize">{key.replace('Habits', ' Habits')}</label>
                  <select 
                    name={key}
                    value={preferences[key]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-primary font-medium"
                  >
                    {options[key].map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                </div>
              ))}
            </div>

             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Guest Policy</label>
                <div className="flex gap-4">
                  {options.guestPolicy.map(opt => (
                    <button
                      key={opt} type="button"
                      onClick={() => setPreferences(prev => ({ ...prev, guestPolicy: opt }))}
                      className={`flex-1 py-4 rounded-xl border-2 transition-all font-bold text-sm uppercase ${preferences.guestPolicy === opt ? 'border-primary bg-primary/5 text-primary' : 'border-slate-50 bg-slate-50 text-slate-400'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
          </div>

          <hr className="border-slate-100" />

          {/* Budget & Bio Section */}
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Monthly Budget (Max)</label>
                  <input 
                    name="budget"
                    type="number" 
                    value={preferences.budget}
                    onChange={handleInputChange}
                    placeholder="e.g. 15000"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Preferred Gender for Roommate</label>
                  <select 
                    name="gender"
                    value={preferences.gender}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none"
                  >
                    <option>Any</option><option>Male</option><option>Female</option>
                  </select>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Something about you</label>
              <textarea 
                name="lifestyle"
                value={preferences.lifestyle}
                onChange={handleInputChange}
                rows="3"
                placeholder="Talk about your hobbies, favorite music, or what kind of vibe you want..."
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={saving}
            className="w-full bg-slate-900 text-white py-5 rounded-3xl text-xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            {saving ? 'Saving...' : 'Save My Lifestyle Profile'}
          </button>
        </form>
      </div>

      <div className="mt-8 flex items-center gap-3 p-6 bg-blue-50 text-blue-700 rounded-3xl border border-blue-100">
         <Info className="w-6 h-6 shrink-0" />
         <p className="text-sm font-medium">
           Your lifestyle data is used to calculate private compatibility scores. 
           Other users only see your percentage match, not your specific answers.
         </p>
      </div>
    </div>
  );
};

const Loader2 = ({ className }) => <Shield className={className + " animate-spin"} />;

export default Preferences;
