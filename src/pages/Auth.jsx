import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup';
  const [isLogin, setIsLogin] = useState(!initialMode);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp: ''
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { login, register, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back to RoomRadar!');
        navigate('/housing');
      } else {
        if (step === 1) {
          await register(formData.name, formData.email, formData.password);
          toast.success('Secure OTP sent to your email');
          setStep(2);
        } else {
          await verifyOtp(formData.email, formData.otp);
          toast.success('Account verified successfully!');
          navigate('/housing');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-6 bg-[#F8FAFC]">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Branding/Visual */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block relative"
        >
          <div className="relative z-10 bg-slate-900 rounded-[3rem] p-16 overflow-hidden shadow-2xl border-8 border-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]" />
            
            <div className="relative z-20">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-12 shadow-xl">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-5xl font-black text-white leading-tight mb-8 tracking-tighter">
                Secure your <br />
                <span className="gradient-text">Future Space</span> <br />
                with trust.
              </h2>
              <p className="text-slate-400 text-lg mb-12 font-medium">Verify your student identity once, access thousands of safe homes across India's top university hubs.</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-white font-bold group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">1</div>
                  Zero Brokerage Fees
                </div>
                <div className="flex items-center gap-4 text-white font-bold group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">2</div>
                  Verified Student Community
                </div>
                <div className="flex items-center gap-4 text-white font-bold group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">3</div>
                  Real-time Secure Chat
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
              {isLogin ? 'Welcome Back.' : step === 1 ? 'Join RoomRadar.' : 'Verify Account.'}
            </h1>
            <p className="text-slate-500 font-medium">
              {isLogin ? "Continue your journey to the perfect home." : step === 1 ? "Create an account to start your search." : "Enter the code we just sent your email."}
            </p>
          </div>

          <div className="bg-white rounded-[3rem] p-10 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.1)] border border-slate-50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {!isLogin && (
                      <div className="relative">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                        <input
                          type="text"
                          required
                          placeholder="Your Full Name"
                          className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                    )}

                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                      <input
                        type="password"
                        required
                        placeholder="Secret Password"
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest">Type OTP below</p>
                    <input
                      type="text"
                      required
                      placeholder="XXXXXX"
                      className="w-full text-center text-4xl font-black py-8 bg-slate-50 rounded-3xl border-none outline-none focus:ring-4 focus:ring-primary/10 tracking-[1em]"
                      maxLength={6}
                      value={formData.otp}
                      onChange={(e) => setFormData({...formData, otp: e.target.value})}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gradient !py-5 flex items-center justify-center gap-3 font-black tracking-tight"
              >
                {loading ? <Loader2 className="animate-spin" /> : isLogin ? 'Access Account' : step === 1 ? 'Continue Securely' : 'Verify & Launch'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            <div className="mt-10 text-center">
              <button
                onClick={() => { setIsLogin(!isLogin); setStep(1); }}
                className="text-slate-400 font-bold hover:text-primary transition-colors text-sm"
              >
                {isLogin ? "Don't have an account? Create one" : "Already registered? Sign In"}
              </button>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            Military-grade Encryption
            <Sparkles className="w-3 h-3" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
