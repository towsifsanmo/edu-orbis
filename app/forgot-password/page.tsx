"use client";

import React, { useState, useEffect, useRef } from 'react';
// ✅ আপনার রিয়েল Next.js প্রজেক্টে ব্যবহারের জন্য নিচের লাইনটি আনকমেন্ট (Uncomment) করুন:
 import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, CheckCircle2, ShieldAlert, KeyRound } from 'lucide-react';

// ⚠️ শুধুমাত্র এই লাইভ প্রিভিউ পরিবেশের জন্য কাস্টম রাউটার (আপনার আসল প্রজেক্টে এটি মুছে ফেলবেন):
// const useRouter = () => ({
//   push: (url: string) => console.log('Redirecting to:', url)
// });

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  // TypeScript Types for states
  const [step, setStep] = useState<number>(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  
  // Message state for API responses
  const [message, setMessage] = useState<{ type: string; text: string }>({ type: '', text: '' });

  // Refs for OTP inputs with proper HTML element types
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  useEffect(() => setMounted(true), []);

  /* =======================================
     STEP 1: SEND OTP (API CALL)
     ======================================= */
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-otp', email })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStep(2);
      } else {
        setMessage({ type: 'error', text: data.error || 'ইমেইলটি সঠিক নয়।' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'সার্ভার এরর। আবার চেষ্টা করুন।' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value !== '' && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Auto focus previous input on backspace
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      otpRefs[index - 1].current?.focus();
    }
  };

  /* =======================================
     STEP 2: VERIFY OTP (API CALL)
     ======================================= */
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    const enteredOtp = otp.join('');

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-otp', email, otp: enteredOtp })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStep(3);
      } else {
        setMessage({ type: 'error', text: data.error || 'ভুল OTP প্রদান করেছেন।' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'সার্ভার এরর। আবার চেষ্টা করুন।' });
    } finally {
      setIsLoading(false);
    }
  };

  /* =======================================
     STEP 3: RESET PASSWORD (API CALL)
     ======================================= */
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'পাসওয়ার্ড মিলছে না!' });
      setIsLoading(false);
      return;
    }

    const enteredOtp = otp.join('');

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset-password', email, otp: enteredOtp, newPassword })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStep(4);
        // ২ সেকেন্ড পর স্বয়ংক্রিয়ভাবে ড্যাশবোর্ডে রিডাইরেক্ট করবে
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'সার্ভার এরর। আবার চেষ্টা করুন।' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-slate-50 dark:bg-slate-950"></div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap');
      `}} />

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-500/10 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Back to Login Link (Show on steps 1, 2, 3) */}
        {step < 4 && (
          <a href="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            লগইন পেজে ফিরে যান
          </a>
        )}

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full z-0 transition-all duration-500"
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            ></div>
            
            <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300 ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>1</div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300 ${step >= 2 ? 'bg-blue-600 text-white shadow-[0_0_0_4px_rgba(37,99,235,0.2)]' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}`}>2</div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300 ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}`}>3</div>
          </div>

          {/* Global Error Message Display */}
          {message.type === 'error' && (
            <div className="mb-6 p-3 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 border border-red-100 dark:border-red-800/50 rounded-lg flex items-center">
              <ShieldAlert className="w-4 h-4 mr-2" />
              {message.text}
            </div>
          )}

          {}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">পাসওয়ার্ড ভুলে গেছেন?</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  চিন্তা করবেন না! আপনার অ্যাকাউন্টের ইমেইল এড্রেসটি দিন, আমরা পাসওয়ার্ড রিসেট করার জন্য একটি OTP কোড পাঠিয়ে দেবো।
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">আপনার ইমেইল</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white outline-none transition-all shadow-sm"
                      placeholder="example@school.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'OTP কোড পাঠান'}
                </button>
              </form>
            </div>
          )}

          {}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">OTP যাচাই করুন</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  আমরা <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span> ঠিকানায় একটি ৪-ডিজিটের কোড পাঠিয়েছি।
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-8">
                <div className="flex justify-center gap-3 sm:gap-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-14 h-14 text-center text-2xl font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-all shadow-sm"
                    />
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    কোড পাননি? <button type="button" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline ml-1">আবার পাঠান</button>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.join('').length !== 4}
                  className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'যাচাই করুন'}
                </button>
              </form>
            </div>
          )}

          {}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">নতুন পাসওয়ার্ড সেট করুন</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  আপনার অ্যাকাউন্টের সুরক্ষার জন্য একটি শক্তিশালী পাসওয়ার্ড তৈরি করুন।
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">নতুন পাসওয়ার্ড</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-all shadow-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">পাসওয়ার্ড কনফার্ম করুন</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-all shadow-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !newPassword || newPassword !== confirmPassword}
                  className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 mt-4"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'পাসওয়ার্ড আপডেট করুন'}
                </button>
              </form>
            </div>
          )}

          {}
          {step === 4 && (
            <div className="animate-in zoom-in-95 duration-500 text-center py-6">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">পাসওয়ার্ড আপডেট সফল!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
                আপনার অ্যাকাউন্টের পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে। আপনাকে ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...
              </p>
              
              <button 
                disabled
                className="w-full inline-flex items-center justify-center py-3.5 px-4 rounded-xl font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 transition-all shadow-sm opacity-80 cursor-not-allowed"
              >
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                রিডাইরেক্ট করা হচ্ছে...
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}