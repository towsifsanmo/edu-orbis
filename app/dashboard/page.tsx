"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  User,
  CreditCard,
  Package,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Clock,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Building2,
  Mail,
  Phone,
  BadgeCheck,
  Zap,
  Loader2,
  KeyRound,
  ShieldAlert,
} from "lucide-react";

export default function SubscriberDashboard() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSystemPassword, setShowSystemPassword] = useState(false);

  // System Password Reset Modal States
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState(["", "", "", ""]);
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Refs for OTP Inputs
  const otpRef0 = useRef<HTMLInputElement>(null);
  const otpRef1 = useRef<HTMLInputElement>(null);
  const otpRef2 = useRef<HTMLInputElement>(null);
  const otpRef3 = useRef<HTMLInputElement>(null);
  const otpRefs = [otpRef0, otpRef1, otpRef2, otpRef3];

  const closeResetModal = () => {
    setIsResetModalOpen(false);
    // Reset states after modal closing animation
    setTimeout(() => {
      setResetStep(1);
      setResetEmail("");
      setResetOtp(["", "", "", ""]);
      setResetNewPassword("");
      setResetConfirmPassword("");
    }, 300);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...resetOtp];
    newOtp[index] = value;
    setResetOtp(newOtp);

    if (value !== "" && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && index > 0 && resetOtp[index] === "") {
      otpRefs[index - 1].current?.focus();
    }
  };

  const simulateApiCall = (nextStep: number) => {
    setIsResetLoading(true);
    setTimeout(() => {
      setIsResetLoading(false);
      setResetStep(nextStep);
    }, 1500);
  };

  // Mock User Data
  const user = {
    name: "আহমেদ জুবায়ের",
    schoolName: "ঢাকা পাবলিক স্কুল এন্ড কলেজ",
    email: "ahmed.zubayer@dps.edu.bd",
    phone: "+880 1711-223344",
    role: "Principal / Admin",
    avatar: "https://i.pravatar.cc/150?img=11",
    joinDate: "১৫ জানুয়ারী, ২০২৪",
  };

  // Mock Active Plan
  const activePlan = {
    name: "প্রফেশনাল প্ল্যান",
    status: "Active",
    price: "২,৪০০",
    billingCycle: "মাসিক",
    nextBillingDate: "১৫ সেপ্টেম্বর, ২০২৬",
    featuresUsed: {
      students: { current: 1850, limit: 2000 },
      sms: { current: 4500, limit: 5000 },
    },
  };

  // Mock Payment History
  const paymentHistory = [
    {
      id: "INV-2026-008",
      date: "১৫ আগস্ট, ২০২৬",
      amount: "২,৪০০ ৳",
      method: "SSLCommerz (bKash)",
      status: "Paid",
    },
    {
      id: "INV-2026-007",
      date: "১৫ জুলাই, ২০২৬",
      amount: "২,৪০০ ৳",
      method: "SSLCommerz (Card)",
      status: "Paid",
    },
    {
      id: "INV-2026-006",
      date: "১৫ জুন, ২০২৬",
      amount: "২,৪০০ ৳",
      method: "IBBL iBanking",
      status: "Paid",
    },
    {
      id: "INV-2026-005",
      date: "১৫ মে, ২০২৬",
      amount: "২,৪০০ ৳",
      method: "SSLCommerz (Nagad)",
      status: "Paid",
    },
  ];

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme, mounted]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  if (!mounted)
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950"></div>;

  // Navigation Items
  const navItems = [
    { id: "overview", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
    { id: "profile", label: "প্রোফাইল ও সেটিংস", icon: User },
    { id: "billing", label: "পেমেন্ট ও অর্ডার", icon: CreditCard },
    { id: "pricing", label: "প্যাকেজ আপগ্রেড", icon: Package },
  ];

  return (
    <div
      className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"
      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap');
      `,
        }}
      />

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} flex flex-col`}
      >
        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mr-3">
            <BadgeCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            এডুস্যাস ক্লায়েন্ট
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="ml-auto lg:hidden text-slate-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Mini Profile */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-700"
            />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">
                {user.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                {user.schoolName}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <item.icon
                className={`w-5 h-5 mr-3 ${activeTab === item.id ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`}
              />
              {item.label}
              {activeTab === item.id && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button className="w-full flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">লগআউট করুন</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="mr-4 lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {navItems.find((item) => item.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-slate-500 hover:text-blue-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </header>

        {/* Tab Contents */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            {}
            {activeTab === "overview" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                  <h2 className="text-2xl font-bold mb-2">
                    স্বাগতম, {user.name}! 👋
                  </h2>
                  <p className="text-blue-100 opacity-90 max-w-xl leading-relaxed">
                    আপনার স্কুল ম্যানেজমেন্ট সিস্টেমটি সফলভাবে চলছে। আপনার
                    বর্তমান সাবস্ক্রিপশন এবং আপডেটগুলো নিচে দেখে নিন।
                  </p>
                </div>

                {/* Active Plan Widget */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <ShieldCheck className="w-6 h-6 text-emerald-500" />
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            বর্তমান প্যাকেজ
                          </h3>
                        </div>
                        <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                          {activePlan.name}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                        অ্যাক্টিভ
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                          পরবর্তী রিনিউ ডেট
                        </p>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {activePlan.nextBillingDate}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                          বিলিং সাইকেল
                        </p>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {activePlan.billingCycle}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">
                            শিক্ষার্থী কোটা
                          </span>
                          <span className="text-slate-900 dark:text-white font-bold">
                            {activePlan.featuresUsed.students.current} /{" "}
                            {activePlan.featuresUsed.students.limit}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{
                              width: `${(activePlan.featuresUsed.students.current / activePlan.featuresUsed.students.limit) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action */}
                  <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-sm flex flex-col justify-center text-center">
                    <Zap className="w-12 h-12 mx-auto text-amber-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">
                      আরও সুবিধা প্রয়োজন?
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">
                      লিমিট শেষ হওয়ার আগেই এন্টারপ্রাইজ প্ল্যানে আপগ্রেড করুন
                      এবং উপভোগ করুন আনলিমিটেড এক্সেস।
                    </p>
                    <button
                      onClick={() => setActiveTab("pricing")}
                      className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      আপগ্রেড করুন
                    </button>
                  </div>
                </div>
              </div>
            )}

            {}
            {activeTab === "profile" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Personal Info Form */}
                  <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                      প্রোফাইল ইনফরমেশন
                    </h3>

                    <form className="space-y-5">
                      <div className="flex items-center space-x-6 mb-6">
                        <img
                          src={user.avatar}
                          alt="Profile"
                          className="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-slate-800"
                        />
                        <button
                          type="button"
                          className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          ছবি পরিবর্তন করুন
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            আপনার নাম
                          </label>
                          <div className="relative">
                            <User className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                            <input
                              type="text"
                              defaultValue={user.name}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            ইমেইল এড্রেস
                          </label>
                          <div className="relative">
                            <Mail className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                            <input
                              type="email"
                              defaultValue={user.email}
                              disabled
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-500 opacity-70 cursor-not-allowed"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            প্রতিষ্ঠানের নাম
                          </label>
                          <div className="relative">
                            <Building2 className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                            <input
                              type="text"
                              defaultValue={user.schoolName}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            মোবাইল নম্বর
                          </label>
                          <div className="relative">
                            <Phone className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                            <input
                              type="tel"
                              defaultValue={user.phone}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 text-right">
                        <button
                          type="button"
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                        >
                          সেভ করুন
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Right Column - Password Forms */}
                  <div className="space-y-6">
                    {/* Dashboard Password Reset Form */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm h-fit">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        ড্যাশবোর্ড পাসওয়ার্ড
                      </h3>
                      <form className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            বর্তমান পাসওয়ার্ড
                          </label>
                          <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                            <input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            নতুন পাসওয়ার্ড
                          </label>
                          <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                            <input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-slate-400"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="pt-2">
                          <button
                            type="button"
                            className="w-full py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all"
                          >
                            আপডেট পাসওয়ার্ড
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Education System Password Reset Form */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-3xl p-6 shadow-sm h-fit">
                      <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                        এডুকেশন সিস্টেম পাসওয়ার্ড
                      </h3>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-6 border-b border-blue-200 dark:border-blue-800/50 pb-4">
                        আপনার মূল স্কুল ম্যানেজমেন্ট সফটওয়্যারের প্যানেল
                        পাসওয়ার্ড পরিবর্তন করুন।
                      </p>
                      <form className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            বর্তমান পাসওয়ার্ড
                          </label>
                          <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                            <input
                              type={showSystemPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-950 border border-blue-200 dark:border-blue-800/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            নতুন পাসওয়ার্ড
                          </label>
                          <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                            <input
                              type={showSystemPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-950 border border-blue-200 dark:border-blue-800/50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowSystemPassword(!showSystemPassword)
                              }
                              className="absolute right-3 top-3 text-slate-400"
                            >
                              {showSystemPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                          <button
                            type="button"
                            className="w-full sm:flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                          >
                            সিস্টেম পাসওয়ার্ড আপডেট
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsResetModalOpen(true)}
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline text-left"
                          >
                            পাসওয়ার্ড ভুলে গেছেন?
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {}
            {activeTab === "billing" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      পেমেন্ট হিস্ট্রি
                    </h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      সর্বশেষ ৪টি পেমেন্ট
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-4 px-6 font-semibold">
                            ইনভয়েস আইডি
                          </th>
                          <th className="py-4 px-6 font-semibold">তারিখ</th>
                          <th className="py-4 px-6 font-semibold">পরিমাণ</th>
                          <th className="py-4 px-6 font-semibold">মেথড</th>
                          <th className="py-4 px-6 font-semibold">স্ট্যাটাস</th>
                          <th className="py-4 px-6 text-right font-semibold">
                            অ্যাকশন
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map((payment, i) => (
                          <tr
                            key={payment.id}
                            className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">
                              {payment.id}
                            </td>
                            <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                              {payment.date}
                            </td>
                            <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                              {payment.amount}
                            </td>
                            <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                              {payment.method}
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                {payment.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                className="p-2 text-slate-400 hover:text-blue-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-colors"
                                title="Download Invoice"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {}
            {activeTab === "pricing" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    আপনার প্যাকেজ আপগ্রেড করুন
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    আপনার প্রতিষ্ঠানের পরিধি বাড়ার সাথে সাথে প্রয়োজন অনুযায়ী
                    প্ল্যান পরিবর্তন করুন। আপগ্রেড করলে নতুন ফিচারগুলো
                    তাৎক্ষণিকভাবে আনলক হয়ে যাবে।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Starter */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 opacity-70">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      স্টার্টার
                    </h3>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                      ১,৫০০ ৳{" "}
                      <span className="text-sm font-medium text-slate-500">
                        / মাস
                      </span>
                    </div>
                    <ul className="space-y-3 mb-8 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />{" "}
                        ৫০০ শিক্ষার্থী লিমিট
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />{" "}
                        বেসিক রিপোর্ট
                      </li>
                    </ul>
                    <button
                      disabled
                      className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold rounded-xl cursor-not-allowed"
                    >
                      ডাউনগ্রেড সম্ভব নয়
                    </button>
                  </div>

                  {/* Professional (Current) */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-3xl p-8 relative">
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                      বর্তমান প্ল্যান
                    </div>
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                      প্রফেশনাল
                    </h3>
                    <div className="text-3xl font-extrabold text-blue-900 dark:text-white mb-6">
                      ৩,০০০ ৳{" "}
                      <span className="text-sm font-medium text-blue-600/70 dark:text-blue-400/70">
                        / মাস
                      </span>
                    </div>
                    <ul className="space-y-3 mb-8 text-sm text-blue-800 dark:text-blue-200">
                      <li className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2" />{" "}
                        ২,০০০ শিক্ষার্থী লিমিট
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2" />{" "}
                        অনলাইন পেমেন্ট গেটওয়ে
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2" />{" "}
                        এসএমএস ইন্টিগ্রেশন
                      </li>
                    </ul>
                    <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30">
                      রিনিউ করুন
                    </button>
                  </div>

                  {/* Enterprise */}
                  <div className="bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 opacity-20 rounded-full blur-xl"></div>
                    <h3 className="text-lg font-bold mb-2 flex items-center">
                      এন্টারপ্রাইজ{" "}
                      <Zap className="w-4 h-4 text-amber-400 ml-2" />
                    </h3>
                    <div className="text-3xl font-extrabold mb-6">কাস্টম</div>
                    <ul className="space-y-3 mb-8 text-sm text-slate-300">
                      <li className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 mr-2" />{" "}
                        আনলিমিটেড শিক্ষার্থী
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 mr-2" />{" "}
                        মাল্টি-ব্রাঞ্চ সাপোর্ট
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 mr-2" />{" "}
                        ডেডিকেটেড একাউন্ট ম্যানেজার
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 mr-2" />{" "}
                        কাস্টম ডোমেইন (White-label)
                      </li>
                    </ul>
                    <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all">
                      যোগাযোগ করুন
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* System Password Reset Modal Flow */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl relative border border-slate-200 dark:border-slate-800">
            <button
              onClick={closeResetModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step 1: Email Input */}
            {resetStep === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    পাসওয়ার্ড ভুলে গেছেন?
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    আপনার ইমেইল এড্রেসটি দিন, আমরা একটি OTP কোড পাঠাবো।
                  </p>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    simulateApiCall(2);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      আপনার ইমেইল
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                        placeholder="example@school.com"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isResetLoading || !resetEmail}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex justify-center items-center transition-all disabled:opacity-70"
                  >
                    {isResetLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "OTP কোড পাঠান"
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {resetStep === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    OTP যাচাই করুন
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    আমরা {resetEmail}-এ একটি কোড পাঠিয়েছি।
                  </p>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    simulateApiCall(3);
                  }}
                  className="space-y-6"
                >
                  <div className="flex justify-center gap-3">
                    {resetOtp.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpRefs[index]}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                      />
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={isResetLoading || resetOtp.join("").length !== 4}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex justify-center items-center transition-all disabled:opacity-70"
                  >
                    {isResetLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "যাচাই করুন"
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Step 3: Set New Password */}
            {resetStep === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    নতুন পাসওয়ার্ড সেট করুন
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    আপনার সিস্টেমের জন্য একটি নতুন পাসওয়ার্ড দিন।
                  </p>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    simulateApiCall(4);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      নতুন পাসওয়ার্ড
                    </label>
                    <div className="relative">
                      <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type={showResetPassword ? "text" : "password"}
                        required
                        value={resetNewPassword}
                        onChange={(e) => setResetNewPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowResetPassword(!showResetPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showResetPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      পাসওয়ার্ড কনফার্ম করুন
                    </label>
                    <div className="relative">
                      <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type={showResetPassword ? "text" : "password"}
                        required
                        value={resetConfirmPassword}
                        onChange={(e) =>
                          setResetConfirmPassword(e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                        placeholder="••••••••"
                      />
                    </div>
                    {resetConfirmPassword &&
                      resetNewPassword !== resetConfirmPassword && (
                        <p className="text-xs text-red-500 mt-1 font-medium">
                          পাসওয়ার্ড মিলছে না!
                        </p>
                      )}
                  </div>
                  <button
                    type="submit"
                    disabled={
                      isResetLoading ||
                      !resetNewPassword ||
                      resetNewPassword !== resetConfirmPassword
                    }
                    className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex justify-center items-center transition-all disabled:opacity-70"
                  >
                    {isResetLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "আপডেট করুন"
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Step 4: Success Message */}
            {resetStep === 4 && (
              <div className="animate-in zoom-in-95 duration-500 text-center py-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  সফলভাবে পরিবর্তিত হয়েছে!
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  আপনার এডুকেশন সিস্টেমের পাসওয়ার্ডটি পরিবর্তন করা হয়েছে। নতুন
                  পাসওয়ার্ড দিয়ে এখন সিস্টেমে প্রবেশ করতে পারবেন।
                </p>
                <button
                  onClick={closeResetModal}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 font-bold rounded-xl transition-all"
                >
                  ড্যাশবোর্ডে ফিরে যান
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
