import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Shield, Star, Users, ArrowRight, Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const stats = [
    { label: 'Active Listings', value: '500+', icon: HomeIcon },
    { label: 'Happy Students', value: '2k+', icon: Users },
    { label: 'Verified Partners', value: '150+', icon: Shield },
    { label: 'Avg. Rating', value: '4.9/5', icon: Star },
  ];

  return (
    <div className="bg-slate-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 px-6">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: [0, 100, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0], y: [0, 150, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[120px]" 
          />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-sm mb-8">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              India's Premier Student Housing Platform
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
              Find Your Perfect <br />
              <span className="gradient-text italic">Second Home.</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              Skip the brokerage and the stress. RoomRadar connects you with verified student accommodations and compatible roommates in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/housing" className="btn-gradient flex items-center justify-center gap-3 group">
                Browse Housing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/roommates" className="px-8 py-4 rounded-full border-2 border-slate-200 font-bold text-slate-700 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                Find Roommates
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200" 
                alt="Modern Student Apartment" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-10 -left-10 glass p-8 rounded-[2.5rem] shadow-2xl z-20 max-w-xs border border-white/50"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary rounded-2xl text-white">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 leading-tight tracking-tight">Prime Location</h4>
                  <p className="text-xs text-slate-500">Search by university</p>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Find homes within <span className="text-primary font-bold">500m</span> of your campus. Verified by our local team.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 text-primary-light mb-6">
                  <stat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-black text-white mb-2 tracking-tight">{stat.value}</h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </section>
    </div>
  );
};

export default Home;
