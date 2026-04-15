import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, IndianRupee, MapPin, Utensils, 
  Moon, Briefcase, MessageSquare, Trash2, Loader2, Heart, Sparkles, Coffee, Smile, Users, Search
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import BASE_URL from '../api/config';

const Roommates = () => {
  const { user } = useAuth();
  const { startConversation } = useChat();
  const navigate = useNavigate();

  const [roommates, setRoommates] = useState([]);
  const [filteredRoommates, setFilteredRoommates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: '',
    gender: 'All',
  });

  const fetchRoommates = async () => {
    try {
      const config = {};
      if (user && user.token) {
        config.headers = { Authorization: `Bearer ${user.token}` };
      }
      const { data } = await axios.get(`${BASE_URL}/api/roommates`, config);
      setRoommates(data);
      setFilteredRoommates(data);
    } catch (error) {
      toast.error('Failed to load roommate profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoommates();
  }, []);

  useEffect(() => {
    let result = roommates;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(r => 
        r.user?.name?.toLowerCase().includes(q) || 
        r.university.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q)
      );
    }
    if (filters.gender !== 'All') {
      result = result.filter(r => r.gender === filters.gender);
    }
    setFilteredRoommates(result);
  }, [filters, roommates]);

  const handleChat = async (targetUserId) => {
    if (!user) {
      toast.error('Please login to chat');
      navigate('/login');
      return;
    }
    if (user._id === targetUserId) {
      toast.error("You can't message yourself!");
      return;
    }
    await startConversation(targetUserId);
    navigate('/chats');
  };

  const handleDelete = async (id, e) => {
    if (!window.confirm('Delete your roommate profile?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${BASE_URL}/api/roommates/${id}`, config);
      toast.success('Profile removed');
      setRoommates(roommates.filter(r => r._id !== id));
    } catch (error) {
      toast.error('Failed to remove profile');
    }
  };

  if (loading) {
    return (
      <div className="pt-40 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-secondary animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Matching personas...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 md:gap-8">
        <div>
          <div className="flex items-center gap-2 text-secondary font-black uppercase tracking-widest text-[10px] md:text-xs mb-2 md:mb-3">
            <Users className="w-4 h-4" />
            Vibrant Community
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-none mb-4 tracking-tighter">Find Partners.</h1>
          <p className="text-slate-500 text-base md:text-lg font-medium italic">Meet {roommates.length} students looking for a shared journey.</p>
        </div>
        <Link to="/list-roommate" className="w-full md:w-auto px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black tracking-tight hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-3">
          Join the community
          <Sparkles className="w-5 h-5" />
        </Link>
      </div>

      {user && (!user.preferences || Object.keys(user.preferences).length < 5) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12 p-6 md:p-8 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-[2.5rem] border border-secondary/20 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-secondary shadow-sm shrink-0">
              <Smile className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Want to see your Match Score?</h3>
              <p className="text-slate-500 font-medium">Set your lifestyle preferences to find the perfect roommate for you.</p>
            </div>
          </div>
          <Link to="/preferences" className="w-full md:w-auto btn-gradient !from-secondary !to-secondary-dark !px-8 text-sm text-center">
            Set Preferences
          </Link>
        </motion.div>
      )}

      {/* Modern Profile Search */}
      <div className="flex flex-col md:flex-row gap-6 mb-16">
        <div className="flex-1 relative group">
          <input 
            type="text"
            placeholder="Search by university, personality or interest..." 
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="w-full pl-16 pr-8 py-5 rounded-[2.5rem] bg-white border border-slate-100 outline-none focus:ring-4 focus:ring-secondary/10 shadow-sm transition-all text-slate-700 font-medium"
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-6 h-6 group-focus-within:text-secondary group-focus-within:scale-110 transition-all" />
        </div>
        <select 
          value={filters.gender}
          onChange={(e) => setFilters({...filters, gender: e.target.value})}
          className="appearance-none px-12 py-5 rounded-[2.5rem] bg-white border border-slate-100 outline-none cursor-pointer font-black text-slate-600 focus:ring-4 focus:ring-secondary/10 shadow-sm"
        >
          <option value="All">All Identities</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence>
          {filteredRoommates.map((person, index) => (
            <motion.div
              layout
              key={person._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="group card-premium !p-0 overflow-hidden flex flex-col"
            >
              <div className="p-8 pb-0">
                <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-secondary/20 to-secondary-light/10 flex items-center justify-center text-secondary font-black text-4xl border-4 border-white shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                      {person.user?.name?.charAt(0) || 'U'}
                    </div>
                    {person.matchScore !== null && (
                      <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black border-4 border-white shadow-lg">
                        {person.matchScore}% MATCH
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="px-3 py-1 bg-secondary/10 rounded-full text-secondary text-[10px] font-black uppercase tracking-widest mb-2">
                       {person.gender}
                    </div>
                    <div className="text-xl font-black text-slate-900 leading-none">₹{person.budget}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Budget/mo</div>
                  </div>
                </div>

                <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 group-hover:text-secondary transition-colors line-clamp-1">{person.user?.name}</h3>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold mb-6">
                  <MapPin className="w-3 h-3 text-secondary" /> {person.university}
                </div>

                <p className="text-slate-500 font-medium italic mb-8 line-clamp-3 min-h-[4.5rem] leading-relaxed">
                  "{person.bio}"
                </p>
              </div>

              <div className="mt-auto px-8 pb-8">
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <Coffee className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{person.foodHabits}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <Smile className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{person.lifestyle}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => handleChat(person.user?._id || person.user)}
                    className="flex-1 btn-gradient !from-secondary !to-secondary-dark flex items-center justify-center gap-3 shadow-secondary/30"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Chat Now
                  </button>
                  {user?._id === (person.user?._id || person.user) && (
                    <button 
                      onClick={(e) => handleDelete(person._id, e)}
                      className="w-14 h-14 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Roommates;
