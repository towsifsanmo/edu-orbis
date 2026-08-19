"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  RefreshCw,
} from "lucide-react";

interface UserProfile {
  id?: string;
  name: string;
  schoolName: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  joinDate?: string;
}

interface ActivePlan {
  id?: string;
  name: string;
  status: string;
  price: number | string;
  billingCycle: string;
  nextBillingDate?: string;
  featuresUsed: {
    students: { current: number; limit: number };
    sms: { current: number; limit: number };
  };
}

interface PaymentItem {
  _id?: string;
  id?: string;
  invoiceNo?: string;
  date: string;
  amount: number | string;
  method?: string;
  billingMethod?: string;
  status: string;
}

interface PricingPlan {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  discountPrice?: number;
  discount?: number;
  billingType?: string;
  features: string[];
}

export default function SubscriberDashboard() {
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // User State (Zero mock defaults)
  const [user, setUser] = useState<UserProfile | null>(null);

  // Active Plan State
  const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);

  // Billing State
  const [paymentHistory, setPaymentHistory] = useState<PaymentItem[]>([]);

  // Plans State
  const [availablePlans, setAvailablePlans] = useState<PricingPlan[]>([]);

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: "",
    instituteName: "",
    mobile: "",
  });

  // Change Password Form State
  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // System Password Reset Modal States
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState(["", "", "", ""]);
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Toast State
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  // Refs for OTP Inputs
  const otpRef0 = useRef<HTMLInputElement>(null);
  const otpRef1 = useRef<HTMLInputElement>(null);
  const otpRef2 = useRef<HTMLInputElement>(null);
  const otpRef3 = useRef<HTMLInputElement>(null);
  const otpRefs = [otpRef0, otpRef1, otpRef2, otpRef3];

  // Fetch Dashboard Overview
  const fetchOverview = useCallback(async () => {
    try {
      const res = await fetch("/api/user/overview");
      const data = await res.json();

      if (res.ok && data.success && data.data) {
        const u = data.data.user;
        const p = data.data.activePlan;

        if (u) {
          setUser({
            id: u.id || u._id,
            name: u.name || "ইউজার",
            schoolName: u.instituteName || "স্কুল / কলেজ",
            email: u.email,
            phone: u.mobile || "নম্বর প্রদান করা হয়নি",
            role: "Subscriber",
            avatar: u.image || `https://i.pravatar.cc/150?u=${u.email}`,
            joinDate: u.createdAt
              ? new Date(u.createdAt).toLocaleDateString("bn-BD")
              : "",
          });

          setProfileForm({
            name: u.name || "",
            instituteName: u.instituteName || "",
            mobile: u.mobile || "",
          });
        }

        if (p) {
          setActivePlan({
            id: p.id || p._id,
            name: p.name || "প্ল্যান",
            status: p.status || "Active",
            price: p.price ? p.price.toLocaleString("en-IN") : "০",
            billingCycle: p.billingCycle || "মাসিক",
            nextBillingDate: p.nextBillingDate || "১৫ সেপ্টেম্বর, ২০২৬",
            featuresUsed: p.usage || {
              students: { current: 0, limit: 1000 },
              sms: { current: 0, limit: 1000 },
            },
          });
        } else {
          setActivePlan(null);
        }
      }
    } catch (e) {
      console.error("Overview fetch error:", e);
    }
  }, []);

  // Fetch Billing History
  const fetchBilling = useCallback(async () => {
    try {
      const res = await fetch("/api/user/billing");
      const data = await res.json();
      if (res.ok && data.success) {
        setPaymentHistory(Array.isArray(data.data) ? data.data : []);
      }
    } catch (e) {
      console.error("Billing fetch error:", e);
    }
  }, []);

  // Fetch Pricing Plans
  const fetchPlans = useCallback(async () => {
    try {
      const res = await fetch("/api/user/plans");
      const data = await res.json();
      if (res.ok && data.success) {
        setAvailablePlans(Array.isArray(data.data) ? data.data : []);
      }
    } catch (e) {
      console.error("Plans fetch error:", e);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    async function initDashboard() {
      setIsLoading(true);
      await Promise.all([fetchOverview(), fetchBilling(), fetchPlans()]);
      setIsLoading(false);
    }
    initDashboard();
  }, [fetchOverview, fetchBilling, fetchPlans]);

  // Update Profile Submit
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("প্রোফাইল তথ্য সফলভাবে সেভ হয়েছে!");
        fetchOverview();
      } else {
        showToast(data.message || "প্রোফাইল আপডেট করা যায়নি।", "error");
      }
    } catch (e) {
      showToast("সার্ভার ত্রুটি।", "error");
    }
  };

  // Change Password Submit
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!");
        setPassForm({ currentPassword: "", newPassword: "" });
      } else {
        showToast(data.message || "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।", "error");
      }
    } catch (e) {
      showToast("সার্ভার ত্রুটি।", "error");
    }
  };

  // Upgrade Plan
  const handleUpgradePlan = async (packageId: string) => {
    try {
      const res = await fetch("/api/user/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("প্যাকেজ সফলভাবে আপগ্রেড করা হয়েছে!");
        fetchOverview();
        fetchBilling();
      } else {
        showToast(data.message || "আপগ্রেড ব্যর্থ হয়েছে।", "error");
      }
    } catch (e) {
      showToast("সার্ভার ত্রুটি।", "error");
    }
  };

  const closeResetModal = () => {
    setIsResetModalOpen(false);
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
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && index > 0 && resetOtp[index] === "") {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetLoading(true);
    try {
      const res = await fetch("/api/user/reset-system-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-otp", email: resetEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("OTP কোড পাঠানো হয়েছে! (ডেমো কোড: 1234)");
        setResetStep(2);
      } else {
        showToast(data.message || "ইমেইল সঠিক নয়।", "error");
      }
    } catch (e) {
      showToast("সার্ভার ত্রুটি।", "error");
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetLoading(true);
    try {
      const res = await fetch("/api/user/reset-system-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify-otp",
          otp: resetOtp.join(""),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResetStep(3);
      } else {
        showToast(data.message || "সঠিক OTP কোড দিন।", "error");
      }
    } catch (e) {
      showToast("সার্ভার ত্রুটি।", "error");
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetNewPassword !== resetConfirmPassword) {
      showToast("পাসওয়ার্ড নিশ্চিতকরণ মিলছে না!", "error");
      return;
    }
    setIsResetLoading(true);
    try {
      const res = await fetch("/api/user/reset-system-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-password",
          newPassword: resetNewPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResetStep(4);
      } else {
        showToast(data.message || "পাসওয়ার্ড আপডেট ব্যর্থ হয়েছে।", "error");
      }
    } catch (e) {
      showToast("সার্ভার ত্রুটি।", "error");
    } finally {
      setIsResetLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, [mounted]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    router.push("/login");
    router.refresh();
  };

  if (!mounted || (isLoading && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

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
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-[110] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 ${
            toast.type === "error"
              ? "bg-rose-600 text-white"
              : "bg-slate-900 text-white"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="w-5 h-5 text-white" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
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
              src={user?.avatar || "https://i.pravatar.cc/150?u=1"}
              alt={user?.name || "Profile"}
              className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-700 object-cover"
            />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">
                {user?.name || "ইউজার"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                {user?.schoolName || "প্রতিষ্ঠান"}
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
                className={`w-5 h-5 mr-3 ${
                  activeTab === item.id
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400"
                }`}
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
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">লগআউট করুন</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="mr-4 lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {navItems.find((item) => item.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-slate-500 hover:text-blue-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                  <h2 className="text-2xl font-bold mb-2">
                    স্বাগতম, {user?.name}! 👋
                  </h2>
                  <p className="text-blue-100 opacity-90 max-w-xl leading-relaxed">
                    আপনার {user?.schoolName} এর এডুস্যাস ম্যানেজমেন্ট সিস্টেম সক্রিয়
                    রয়েছে। নিচে বর্তমান সাবস্ক্রিপশন স্ট্যাটাস এবং ব্যবহার পরিসংখ্যান দেখুন।
                  </p>
                </div>

                {/* Active Plan Widget */}
                {activePlan ? (
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
                          {activePlan.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                            প্যাকেজ মূল্য
                          </p>
                          <p className="font-bold text-slate-900 dark:text-white">
                            ৳ {activePlan.price}
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
                              শিক্ষার্থী লিমিট ব্যবহার
                            </span>
                            <span className="text-slate-900 dark:text-white font-bold">
                              {activePlan.featuresUsed?.students?.current || 0} /{" "}
                              {activePlan.featuresUsed?.students?.limit || 1000}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-blue-500 h-2.5 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((activePlan.featuresUsed?.students?.current || 0) /
                                    (activePlan.featuresUsed?.students?.limit || 1000)) *
                                    100
                                )}%`,
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
                        প্যাকেজ পরিবর্তন করবেন?
                      </h3>
                      <p className="text-slate-400 text-sm mb-6">
                        আরও বেশি শিক্ষার্থী ও প্রিমিয়াম ফিচার আনলক করতে উপযুক্ত প্ল্যানে আপগ্রেড করুন।
                      </p>
                      <button
                        onClick={() => setActiveTab("pricing")}
                        className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        প্যাকেজসমূহ দেখুন
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      কোনো অ্যাক্টিভ প্যাকেজ পাওয়া যায়নি
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                      আপনার অ্যাকাউন্টে বর্তমানে কোনো প্যাকেজ সক্রিয় নেই। অনুগ্রহ করে একটি প্যাকেজ নির্বাচন করুন।
                    </p>
                    <button
                      onClick={() => setActiveTab("pricing")}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all"
                    >
                      প্যাকেজ নির্বাচন করুন
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Personal Info Form */}
                  <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                      প্রোফাইল ইনফরমেশন
                    </h3>

                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                      <div className="flex items-center space-x-6 mb-6">
                        <img
                          src={user?.avatar || "https://i.pravatar.cc/150?u=1"}
                          alt="Profile"
                          className="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-slate-800 object-cover"
                        />
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                          {user?.email}
                        </p>
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
                              value={profileForm.name}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  name: e.target.value,
                                })
                              }
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
                              value={profileForm.mobile}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  mobile: e.target.value,
                                })
                              }
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
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
                              value={profileForm.instituteName}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  instituteName: e.target.value,
                                })
                              }
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 text-right">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                        >
                          সেভ করুন
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Password Change Column */}
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        ড্যাশবোর্ড পাসওয়ার্ড পরিবর্তন
                      </h3>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            বর্তমান পাসওয়ার্ড
                          </label>
                          <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                            <input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={passForm.currentPassword}
                              onChange={(e) =>
                                setPassForm({
                                  ...passForm,
                                  currentPassword: e.target.value,
                                })
                              }
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
                              value={passForm.newPassword}
                              onChange={(e) =>
                                setPassForm({
                                  ...passForm,
                                  newPassword: e.target.value,
                                })
                              }
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
                            type="submit"
                            className="w-full py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all"
                          >
                            পাসওয়ার্ড আপডেট
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-3xl p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                        স্কুল পোর্টাল পাসওয়ার্ড
                      </h3>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-4">
                        মূল স্কুল ম্যানেজমেন্ট পোর্টাল পাসওয়ার্ড রিসেট করতে চান?
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsResetModalOpen(true)}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
                      >
                        পাসওয়ার্ড রিসেট করুন
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BILLING TAB */}
            {activeTab === "billing" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      পেমেন্ট ও ইনভয়েস হিস্ট্রি
                    </h3>
                  </div>

                  {paymentHistory.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                      কোনো পেমেন্ট ও ইনভয়েস হিস্ট্রি পাওয়া যায়নি।
                    </div>
                  ) : (
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
                          {paymentHistory.map((payment) => (
                            <tr
                              key={payment._id || payment.id || payment.invoiceNo}
                              className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                              <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">
                                {payment.invoiceNo || payment.id}
                              </td>
                              <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                                {payment.date
                                  ? new Date(payment.date).toLocaleDateString("bn-BD")
                                  : "প্রযোজ্য নয়"}
                              </td>
                              <td className="py-4 px-6 font-bold text-blue-600 dark:text-blue-400">
                                ৳ {payment.amount}
                              </td>
                              <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                                {payment.billingMethod || payment.method || "SSLCommerz"}
                              </td>
                              <td className="py-4 px-6">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                  {payment.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  onClick={() =>
                                    showToast(
                                      `ইনভয়েস ${
                                        payment.invoiceNo || payment.id
                                      } সফলভাবে ডাউনলোড হয়েছে!`
                                    )
                                  }
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
                  )}
                </div>
              </div>
            )}

            {/* PRICING / UPGRADE TAB */}
            {activeTab === "pricing" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    আপনার প্যাকেজ আপগ্রেড করুন
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    আপনার প্রতিষ্ঠানের শিক্ষার্থী সংখ্যা বাড়লে তাৎক্ষণিকভাবে উপযুক্ত
                    প্যাকেজ নির্বাচন করে আপগ্রেড করুন।
                  </p>
                </div>

                {availablePlans.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    বর্তমানে কোনো প্যাকেজ উপলব্ধ নেই।
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {availablePlans.map((plan) => {
                      const isCurrent =
                        activePlan?.id === plan._id ||
                        activePlan?.name === plan.name;
                      const finalPrice = plan.discountPrice || plan.price;

                      return (
                        <div
                          key={plan._id || plan.id}
                          className={`rounded-3xl p-8 transition-all flex flex-col relative ${
                            isCurrent
                              ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 shadow-xl"
                              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                          }`}
                        >
                          {isCurrent && (
                            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                              বর্তমান প্ল্যান
                            </div>
                          )}
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {plan.name}
                          </h3>
                          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-6">
                            ৳ {finalPrice.toLocaleString("en-IN")}{" "}
                            <span className="text-sm font-medium text-slate-500">
                              /{plan.billingType || "মাসিক"}
                            </span>
                          </div>
                          <ul className="space-y-3 mb-8 text-sm text-slate-600 dark:text-slate-300 flex-1">
                            {plan.features?.map((f, idx) => (
                              <li key={idx} className="flex items-center">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                                {f}
                              </li>
                            ))}
                          </ul>
                          <button
                            disabled={isCurrent}
                            onClick={() => handleUpgradePlan(plan._id || plan.id!)}
                            className={`w-full py-3 font-bold rounded-xl transition-all ${
                              isCurrent
                                ? "bg-emerald-600 text-white cursor-default"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 active:scale-95"
                            }`}
                          >
                            {isCurrent ? "সক্রিয় রয়েছে" : "আপগ্রেড করুন"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
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
                <form onSubmit={handleSendOtp} className="space-y-4">
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
                    আমরা {resetEmail}-এ একটি কোড পাঠিয়েছি (ডেমো: 1234)।
                  </p>
                </div>
                <form onSubmit={handleVerifyOtp} className="space-y-6">
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
                </div>
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
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
                        className="absolute right-3 top-3 text-slate-400"
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
                  </div>
                  <button
                    type="submit"
                    disabled={isResetLoading}
                    className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex justify-center items-center transition-all"
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
                  আপনার এডুকেশন সিস্টেমের পাসওয়ার্ডটি সফলভাবে পরিবর্তন করা হয়েছে।
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
