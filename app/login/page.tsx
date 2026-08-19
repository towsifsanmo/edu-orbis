"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle,CheckCircle2, XCircle,GraduationCap,AlertCircle , Loader2 } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [loginType, setLoginType] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({ email: '', password: '' });
 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: data.message || 'সফলভাবে লগইন হয়েছে! রিডাইরেক্ট করা হচ্ছে...' });
        const targetUrl = data.data?.role === 'admin' ? '/admin' : '/dashboard';
        setTimeout(() => {
          router.push(targetUrl);
          router.refresh();
        }, 1000);
      } else {
        setMessage({ type: 'error', text: data.message || data.error || 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' });
        setIsLoading(false);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'সার্ভার এরর! দয়া করে একটু পর আবার চেষ্টা করুন।' });
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 selection:bg-blue-500/30" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Hind Siliguri', sans-serif; }
      `}} />

      {/* Left Side - Branding (Hidden on small mobile screens) */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] relative overflow-hidden bg-blue-600 flex-col justify-between p-12 lg:p-16 text-white">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white opacity-10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400 opacity-20 blur-3xl rounded-full"></div>

        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-wide">এডুস্যাস প্রো</span>
        </div>

        <div className="relative z-10 max-w-xl mt-12 mb-auto">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            স্কুল ম্যানেজমেন্ট এখন <br/> আরও সহজ ও স্মার্ট
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            এক ক্লিকে হাজিরা, স্বয়ংক্রিয় একাউন্টিং, রেজাল্ট প্রসেসিং এবং আরও অনেক কিছু। আপনার শিক্ষাপ্রতিষ্ঠানকে সম্পূর্ণ ডিজিটাল করতে এডুস্যাস প্রো-এর সাথে যুক্ত হোন।
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-4">
          <div className="flex -space-x-3">
            {['11', '47', '14', '32'].map((img, i) => (
              <img key={i} src={`https://i.pravatar.cc/100?img=${img}`} alt="User" className="w-10 h-10 rounded-full border-2 border-blue-600 shadow-md" />
            ))}
          </div>
          <p className="text-sm font-medium text-blue-100">
            ৫০০০+ স্কুল ও মাদ্রাসার আস্থার প্রতীক
          </p>
        </div>
      </div>

      {}
      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="absolute top-8 left-6 md:hidden flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">এডুস্যাস প্রো</span>
        </div>

        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center md:text-left mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">স্বাগতম! লগইন করুন</h2>
            <p className="text-slate-500 dark:text-slate-400">আপনার ড্যাশবোর্ডে প্রবেশ করতে ক্রেডেনশিয়াল প্রদান করুন।</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Message */}
            {message.type === 'error' && message.text && (
              <div className="flex items-start p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-xl bg-red-50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                <span>{message.text}</span>
              </div>
            )}
            {message.type === 'success' && message.text && (
              <div className="flex items-start p-4 mb-4 text-sm text-emerald-800 border border-emerald-300 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                <CheckCircle2 className="w-5 h-5 mr-2 shrink-0" />
                <span>{message.text}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ইমেইল এড্রেস</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white outline-none transition-all shadow-sm"
                  placeholder="example@school.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">পাসওয়ার্ড</label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
                  পাসওয়ার্ড ভুলে গেছেন?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-11 pr-12 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white outline-none transition-all shadow-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                আমাকে মনে রাখুন
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  প্রবেশ করা হচ্ছে...
                </>
              ) : (
                <>
                  লগইন করুন
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Demo Hint */}
          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              ডেমো চেক করার জন্য ব্যবহার করুন:<br/>
              <span className="font-semibold text-slate-700 dark:text-slate-300 mt-1 inline-block bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">admin@edusaas.com / 123456</span>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}