"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Users,
  DollarSign,
  Calendar,
  MessageSquare,
  Shield,
  ChevronRight,
  CheckCircle2,
  Menu,
  X,
  ArrowRight,
  PlayCircle,
  Star,
  BarChart3,
  Globe,
  LayoutDashboard,
  Zap,
  CreditCard,
  ShieldCheck,
  Landmark,
  UserPlus,
  CalendarCheck,
  ClipboardList,
  Library,
  Badge,
  CalendarDays,
  Briefcase,
  Activity,
  FileBarChart,
  Clock,
  Contact,
  FileText,
  Fingerprint,
  Smartphone,
  Calculator,
  MonitorCheck,
  MessageSquareText,
  ClipboardCheck,
  Check,
  Sun,
  Moon,
  Search,
  ChevronDown,
  ChevronUp,
  Award,
  Building2,
  Presentation,
  PhoneCall,
  Mail,
  HelpCircle,
  MapPin,
  Send,
  Loader2,
} from "lucide-react";

type Theme = "light" | "dark";

type NavbarProps = {
  theme: Theme;
  toggleTheme: () => void;
};
const Navbar = ({ theme, toggleTheme }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
              এডুস্যাস প্রো
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              ফিচারসমূহ
            </a>
            <a
              href="#solutions"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              সমাধান
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              গ্রাহকদের মতামত
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              মূল্যতালিকা
            </a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              aria-label="Toggle Dark Mode"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              লগইন
            </Link>
            <button className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center">
              ডেমো বুক করুন
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-1 shadow-lg">
          <a
            href="#features"
            className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
          >
            ফিচারসমূহ
          </a>
          <a
            href="#solutions"
            className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
          >
            সমাধান
          </a>
          <a
            href="#testimonials"
            className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
          >
            গ্রাহকদের মতামত
          </a>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-3">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-center px-5 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 mr-2" /> লাইট মোড
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 mr-2" /> ডার্ক মোড
                </>
              )}
            </button>
            <Link
              href="/login"
              className="w-full block px-5 py-3 text-center text-sm font-medium text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-xl"
            >
              লগইন
            </Link>
            <button className="w-full px-5 py-3 text-center text-sm font-medium text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
              ডেমো বুক করুন
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-950 min-h-[90vh] flex items-center">
      {/* Background glowing blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl mx-auto h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-[28rem] h-[28rem] bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
          <SparkleIcon className="w-4 h-4 mr-2" />
          সংস্করণ ২.০ এখন উপলব্ধ: স্কুল ম্যানেজমেন্টের ভবিষ্যৎ
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]">
          একটি মাত্র প্ল্যাটফর্ম থেকে <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            আপনার পুরো স্কুল পরিচালনা করুন।
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
          এডুস্যাস প্রো ভর্তি, শিক্ষা, মানবসম্পদ এবং হিসাবরক্ষণকে একটি আধুনিক
          ড্যাশবোর্ডে একত্রিত করে। আপনি শিক্ষায় মনোযোগ দিন, প্রশাসনিক কাজ আমরা
          সামলাবো।
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 flex items-center justify-center">
            ফ্রি ট্রায়াল শুরু করুন
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          <button className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-700 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl shadow-sm transition-all hover:-translate-y-1 flex items-center justify-center">
            <PlayCircle className="w-5 h-5 mr-2 text-slate-400" />
            প্রোডাক্ট ট্যুর দেখুন
          </button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> ক্রেডিট
            কার্ডের প্রয়োজন নেই
          </div>
          <div className="flex items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> ১৪ দিনের
            ফ্রি ট্রায়াল
          </div>
          <div className="hidden sm:flex items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> ফ্রি
            সেটআপ সহায়তা
          </div>
        </div>
      </div>
    </div>
  );
};

const SparkleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

const DashboardMockup = () => {
  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 lg:-mt-20 z-20">
      <div className="rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-900/40 p-2 backdrop-blur-xl shadow-2xl">
        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col">
          {/* Mockup Header */}
          <div className="h-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 space-x-2">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="mx-auto bg-slate-100 dark:bg-slate-800 rounded-md py-1 px-32 text-xs text-slate-400 hidden sm:block font-mono">
              dashboard.edusaas.com.bd
            </div>
          </div>

          {/* Mockup Body */}
          <div className="flex flex-1 min-h-[400px]">
            {/* Sidebar Mock */}
            <div className="w-16 sm:w-48 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 hidden md:flex flex-col space-y-4">
              <div className="h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center px-2 mb-4">
                <LayoutDashboard className="w-4 h-4 text-blue-600 dark:text-blue-400 sm:mr-2" />
                <div className="h-2 w-16 bg-blue-600/20 rounded hidden sm:block"></div>
              </div>
              {[Users, BookOpen, DollarSign, Calendar, MessageSquare].map(
                (Icon, i) => (
                  <div key={i} className="flex items-center px-2">
                    <Icon className="w-4 h-4 text-slate-400 sm:mr-2" />
                    <div
                      className={`h-2 rounded hidden sm:block bg-slate-200 dark:bg-slate-700 ${i % 2 === 0 ? "w-20" : "w-16"}`}
                    ></div>
                  </div>
                ),
              )}
            </div>

            {/* Main Content Mock */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="h-5 w-48 bg-slate-800 dark:bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 w-32 bg-slate-300 dark:bg-slate-600 rounded"></div>
                </div>
                <div className="h-8 w-24 bg-blue-600 rounded-lg"></div>
              </div>

              {/* Stats Grid Mock */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm"
                  >
                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 mb-3"></div>
                    <div className="h-3 w-16 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
                    <div className="h-6 w-24 bg-slate-800 dark:bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>

              {/* Chart Mock */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm h-48 flex items-end space-x-2">
                {[40, 70, 45, 90, 65, 85, 100, 60].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-t-sm relative group cursor-pointer transition-all hover:bg-blue-200 dark:hover:bg-blue-800/50"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent to-blue-500/20 rounded-t-sm"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logos Section below mockup */}
      <div className="mt-20 mb-12 text-center">
        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-8">
          বাংলাদেশের শীর্ষস্থানীয় শিক্ষাপ্রতিষ্ঠানগুলোর আস্থার প্রতীক
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {[
            "ঢাকা পাবলিক স্কুল",
            "রাজশাহী কলেজিয়েট",
            "গ্রিনফিল্ড মডেল",
            "চিটাগাং গ্রামার",
            "আদর্শ বিদ্যানিকেতন",
          ].map((name, i) => (
            <div
              key={i}
              className="flex items-center space-x-2 text-lg md:text-xl font-bold text-slate-800 dark:text-slate-300 whitespace-nowrap"
            >
              <Globe className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatsBanner = () => {
  const stats = [
    {
      icon: Award,
      title: "১০ বছরের অভিজ্ঞতা",
      subtitle: "শিক্ষা খাতের উন্নয়নের অভিজ্ঞতা",
      colors: {
        bg: "bg-amber-100 dark:bg-amber-500/20",
        icon: "text-amber-600 dark:text-amber-400",
        border: "hover:border-amber-400 dark:hover:border-amber-500/50",
      },
    },
    {
      icon: Building2,
      title: "৫০০০ শিক্ষা প্রতিষ্ঠান",
      subtitle: "প্রযুক্তি সেবা প্রদানের অভিজ্ঞতা",
      colors: {
        bg: "bg-indigo-100 dark:bg-indigo-500/20",
        icon: "text-indigo-600 dark:text-indigo-400",
        border: "hover:border-indigo-400 dark:hover:border-indigo-500/50",
      },
    },
    {
      icon: Presentation,
      title: "৬০ হাজার শিক্ষক",
      subtitle: "ব্যবহারকারী তৈরীর অভিজ্ঞতা",
      colors: {
        bg: "bg-emerald-100 dark:bg-emerald-500/20",
        icon: "text-emerald-600 dark:text-emerald-400",
        border: "hover:border-emerald-400 dark:hover:border-emerald-500/50",
      },
    },
    {
      icon: GraduationCap,
      title: "৩০ লক্ষ শিক্ষার্থী",
      subtitle: "শিক্ষার্থী ও অভিভাবকের আস্থা",
      colors: {
        bg: "bg-cyan-100 dark:bg-cyan-500/20",
        icon: "text-cyan-600 dark:text-cyan-400",
        border: "hover:border-cyan-400 dark:hover:border-cyan-500/50",
      },
    },
  ];

  return (
    <section className="relative w-full mt-10">
      {/* Top Banner */}
      <div className="bg-slate-50/50 dark:bg-slate-900/50 pt-20 pb-28 px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
          বাংলাদেশের সেরা শিক্ষা প্রতিষ্ঠান ব্যবস্থাপনা{" "}
          <br className="hidden md:block" />
          সফটওয়্যার{" "}
          <span className="relative inline-block mt-2 md:mt-0 text-slate-900 dark:text-white">
            এডুস্যাস প্রো
            {/* Green underline matching the image */}
            <span className="absolute -bottom-2.5 left-0 w-full h-1.5 bg-[#00d04c] rounded-full"></span>
          </span>
        </h2>
      </div>

      {/* Bottom Section with Cards */}
      <div className="bg-slate-50/50 dark:bg-slate-900/50 pb-16 px-4 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto -mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`group bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-[0_4px_20px_rgb(0,0,0,0.05)] dark:shadow-none border-2 border-slate-200 dark:border-slate-700 transition-all hover:-translate-y-1.5 duration-300 ${stat.colors.border}`}
              >
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${stat.colors.bg}`}
                >
                  <stat.icon
                    className={`w-8 h-8 ${stat.colors.icon}`}
                    strokeWidth={2}
                  />
                </div>
                <h3 className="text-xl font-bold text-[#110e3d] dark:text-white mb-2">
                  {stat.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const DetailedFeatures = () => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const features = [
    {
      title: "ডিজিটাল অ্যাটেনডেন্স",
      icon: Fingerprint,
      items: [
        "শিক্ষক-শিক্ষার্থীদের বায়োমেট্রিক হাজিরা",
        "তাৎক্ষণিক সার্ভারে আপডেট",
        "উপস্থিতি-অনুপস্থিতির এসএমএস",
        "এক্সট্রা অ্যাটেনডেন্স",
        "ক্যাটাগরি ভিত্তিক ড্যাশবোর্ড রিপোর্ট",
      ],
    },
    {
      title: "ডিজিটাল ফি'স কালেকশন",
      icon: Smartphone,
      items: [
        "ক্লাস ও স্টুডেন্ট ক্যাটাগরি ভিত্তিক ফিস ও পে স্লিপ জেনারেট",
        "অনলাইন চ্যানেলে ফিস কালেকশন",
        "কালেকশন ফান্ডে স্বয়ংক্রিয়ভাবে",
        "এসএমএসে বকেয়ার তাগাদা",
        "মানি রিসিট ব্যাংক রিকনসিলিয়েশন",
      ],
    },
    {
      title: "অটোমেটেড একাউন্টিং",
      icon: Calculator,
      items: [
        "ইচ্ছামত চার্ট অব একাউন্টস ও লেজার সেটআপ",
        "পেমেন্ট-রিসিপ্ট, কন্ট্রা, জার্নাল ভাউচার তৈরি",
        "অটো ডেবিট-ক্রেডিট (স্ট্যান্ডার্ড একাউন্টিং সিস্টেম)",
        "ক্যাশবুক, ব্যাংকবুক, লেজারবুক সুবিধা",
        "ক্যাশ ফ্লো ও সামারি, ইনকাম স্টেটমেন্ট, ব্যালেন্স শীট তৈরি",
      ],
    },
    {
      title: "লে আউট এন্ড সার্টিফিকেট",
      icon: MonitorCheck,
      items: [
        "শিক্ষক ও শিক্ষার্থীর আইডি কার্ড তৈরি সুবিধা",
        "এডমিট কার্ড ও সিট প্ল্যান প্রস্তুত ও ব্যবস্থাপনা",
        "স্টুডেন্ট ট্যাগ, ট্রান্সফার সার্টিফিকেট (TC) ও টেস্টিমোনিয়াল প্রস্তুতকরণ",
        "টেবুলেশন, প্রগ্রেস রিপোর্ট ও ইনভয়েস- নিজস্ব টেমপ্লেট স্বয়ংক্রিয় প্রস্তুত",
        "প্রয়োজন অনুযায়ী প্রিন্ট ও ডাউনলোড সুবিধা",
      ],
    },
    {
      title: "বাল্ক SMS সার্ভিস ও নোটিফিকেশন",
      icon: MessageSquareText,
      items: [
        "ক্লাস, শিফট ও সেকশনভিত্তিক সকল ধরনের নোটিশ প্রকাশ ও ব্যবস্থাপনা",
        "শিক্ষকদের জন্য জরুরি মিটিং নোটিশ প্রেরণের সুবিধা",
        "শিক্ষার্থীদের জন্মদিন উপলক্ষে স্বয়ংক্রিয় শুভেচ্ছা বার্তা প্রেরণ",
        "প্রতিষ্ঠানভিত্তিক নোটিশ সংরক্ষণ ও ইতিহাস ব্যবস্থাপনা",
        "নির্ধারিত নোটিশ দ্রুত প্রকাশ ও তাৎক্ষণিক যোগাযোগ সুবিধা",
      ],
    },
    {
      title: "রেজাল্ট প্রসেসিং ও পাবলিশিং",
      icon: ClipboardCheck,
      items: [
        "প্রতিটি ক্লাস, সেকশন ও বিষয়ভিত্তিক মার্কস ও জিপিএ কনফিগারেশন সুবিধা",
        "সহজ ইনপুটে ক্লাস টেস্ট, সেমিস্টার ও গ্র্যান্ড ফাইনাল ফলাফল প্রস্তুত",
        "এসএমএসের মাধ্যমে তাৎক্ষণিক ফলাফল প্রকাশ সুবিধা",
        "স্বয়ংক্রিয়ভাবে ওয়েবসাইটে ফলাফল প্রকাশ ব্যবস্থা",
        "নির্ভুল ও সময়োপযোগী ফলাফল ব্যবস্থাপনায় সম্পূর্ণ স্বয়ংক্রিয়তা",
      ],
    },
    {
      title: "ডায়নামিক রুটিন ম্যানেজমেন্ট",
      icon: CalendarDays,
      items: [
        "ক্লাস ও পরীক্ষা রুটিন প্রস্তুত ও প্রয়োজন অনুযায়ী পরিবর্তনের সুবিধা",
        "ক্লাসভিত্তিক রুটিন পরিকল্পনা ও ব্যবস্থাপনা ব্যবস্থা",
        "শিক্ষকভিত্তিক রুটিন নির্ধারণ ও সমন্বয় ব্যবস্থা",
        "রুটিন পরিবর্তনের ক্ষেত্রে দ্রুত আপডেট ও নিয়ন্ত্রণ সুবিধা",
        "স্বয়ংক্রিয়ভাবে ওয়েবসাইটে রুটিন প্রকাশ ও হালনাগাদ ব্যবস্থা",
      ],
    },
    {
      title: "কুইক ইনফরমেশন সিস্টেম",
      icon: Search,
      items: [
        "শিক্ষক ও শিক্ষার্থীদের প্রয়োজনীয় তথ্য দ্রুত অনুসন্ধান সুবিধা",
        "ঘন্টার পর ঘন্টা সময় নষ্ট না করে ১ মিনিটেই তথ্য প্রাপ্তির সক্ষমতা",
        "যেকোনো তথ্য সহজে পিডিএফ ও এক্সেল ফরম্যাটে ডাউনলোড সুবিধা",
        "প্রয়োজন অনুযায়ী তাৎক্ষণিক প্রিন্ট ও ডিজিটাল আর্কাইভ ব্যবস্থা",
        "দ্রুত, নির্ভুল ও সুশৃঙ্খল তথ্য ব্যবস্থাপনার মাধ্যমে সময় সাশ্রয়",
      ],
    },
    {
      title: "স্টুডেন্ট ও টিচার প্রোফাইল",
      icon: Contact,
      items: [
        "প্রতিষ্ঠানের সকল প্রয়োজনীয় ও গুরুত্বপূর্ণ তথ্যের কেন্দ্রীয় ডিজিটাল ভাণ্ডার",
        "প্রতিটি শিক্ষক ও শিক্ষার্থীর জন্য সমন্বিত ও সুসংগঠিত প্রোফাইলিং সিস্টেম",
        "ব্যক্তিগত, পারিবারিক, একাডেমিক ও পেশাগত তথ্য সংরক্ষণের ব্যবস্থা",
        "তথ্যভিত্তিক ব্যবস্থাপনা ও সিদ্ধান্ত গ্রহণে সহায়ক তথ্য কাঠামো",
        "নিরাপদ, হালনাগাদ ও সহজে অ্যাক্সেসযোগ্য তথ্য ব্যবস্থাপনা সুবিধা",
      ],
    },
    {
      title: "সহজবোধ্য টিউটোরিয়াল",
      icon: PlayCircle,
      items: [
        "এডুস্যাস ব্যবহারের প্রক্রিয়া সহজ ও ব্যবহারবান্ধব",
        "সময় সাশ্রয়ী, সংক্ষিপ্ত ও সহজবোধ্য ভিডিও টিউটোরিয়াল সুবিধা",
        "ধাপে ধাপে টেক্সট ও গ্রাফিকাল টিউটোরিয়াল সাপোর্ট",
        "অনলাইনে লাইভ ট্রেনিং সেশনের মাধ্যমে ব্যবহারিক দিকনির্দেশনা",
        "নিরবচ্ছিন্ন কাস্টমার সাপোর্ট ও সহায়তা ব্যবস্থা",
      ],
    },
    {
      title: "ইউজার কমিউনিটি সাপোর্ট",
      icon: Users,
      items: [
        "এডুস্যাস ব্যবহারকারীদের জন্য সক্রিয় ও সহায়ক কমিউনিটি প্ল্যাটফর্ম",
        "ব্যবহারকারীদের পারস্পরিক অভিজ্ঞতা ও জ্ঞান বিনিময়ের সুযোগ",
        "সাধারণ সমস্যা ও সমাধান দ্রুত শেয়ার ও প্রাপ্তির সুবিধা",
        "নিয়মিত আপডেট, গাইডলাইন ও বেস্ট প্র্যাকটিস শেয়ারিং",
        "অফিসিয়াল সাপোর্ট টিমের পর্যবেক্ষণ ও দিকনির্দেশনা সহায়তা",
      ],
    },
    {
      title: "সার্টিফিকেশন ও রেফারেল প্রোগ্রাম",
      icon: Badge,
      items: [
        "এডুস্যাস ব্যবহারকারীদের জন্য নির্ধারিত ইউজার সার্টিফিকেশন কোর্স সুবিধা",
        "কোর্স সম্পন্নের পর অফিসিয়াল সার্টিফিকেট প্রদান ব্যবস্থা",
        "সার্টিফিকেটের জন্য অনলাইন ভেরিফিকেশন সুবিধা",
        "রেফারেল প্রোগ্রামের মাধ্যমে আকর্ষণীয় কুপন ও ডিসকাউন্ট সুবিধা",
        "রেফারেলের বিপরীতে বিভিন্ন উপহার ও বিশেষ প্রণোদনা ব্যবস্থা",
      ],
    },
  ];

  const displayedFeatures = showAllFeatures ? features : features.slice(0, 6);

  const colorPalettes = [
    {
      bg: "bg-gradient-to-br from-purple-500 to-indigo-600",
      shadow: "shadow-purple-500/30",
      glow: "bg-purple-100/50 dark:bg-purple-900/20",
      checkBg:
        "group-hover/item:bg-purple-100 dark:group-hover/item:bg-purple-900/50",
      check: "text-purple-600 dark:text-purple-400",
    },
    {
      bg: "bg-gradient-to-br from-emerald-400 to-teal-500",
      shadow: "shadow-emerald-500/30",
      glow: "bg-emerald-100/50 dark:bg-emerald-900/20",
      checkBg:
        "group-hover/item:bg-emerald-100 dark:group-hover/item:bg-emerald-900/50",
      check: "text-emerald-600 dark:text-emerald-400",
    },
    {
      bg: "bg-gradient-to-br from-orange-400 to-amber-500",
      shadow: "shadow-orange-500/30",
      glow: "bg-orange-100/50 dark:bg-orange-900/20",
      checkBg:
        "group-hover/item:bg-orange-100 dark:group-hover/item:bg-orange-900/50",
      check: "text-orange-600 dark:text-orange-400",
    },
    {
      bg: "bg-gradient-to-br from-rose-400 to-pink-500",
      shadow: "shadow-rose-500/30",
      glow: "bg-rose-100/50 dark:bg-rose-900/20",
      checkBg:
        "group-hover/item:bg-rose-100 dark:group-hover/item:bg-rose-900/50",
      check: "text-rose-600 dark:text-rose-400",
    },
    {
      bg: "bg-gradient-to-br from-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/30",
      glow: "bg-blue-100/50 dark:bg-blue-900/20",
      checkBg:
        "group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-900/50",
      check: "text-blue-600 dark:text-blue-400",
    },
    {
      bg: "bg-gradient-to-br from-fuchsia-500 to-violet-600",
      shadow: "shadow-fuchsia-500/30",
      glow: "bg-fuchsia-100/50 dark:bg-fuchsia-900/20",
      checkBg:
        "group-hover/item:bg-fuchsia-100 dark:group-hover/item:bg-fuchsia-900/50",
      check: "text-fuchsia-600 dark:text-fuchsia-400",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-all duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
            কোর ফিচারসমূহ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-5">
            স্কুল ম্যানেজমেন্টের সকল সল্যুশন এক জায়গায়
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            আপনার প্রতিষ্ঠানের দৈনন্দিন কার্যক্রমকে সহজ, নির্ভুল এবং
            স্বয়ংক্রিয় করতে আমাদের রয়েছে বিশ্বমানের সব ফিচার।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {displayedFeatures.map((feature, idx) => {
            const palette = colorPalettes[idx % colorPalettes.length];
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group relative overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                style={{
                  animationDuration: "400ms",
                  animationDelay: `${(idx % 6) * 75}ms`,
                  animationFillMode: "both",
                }}
              >
                {/* Colorful gradient background effect on hover */}
                <div
                  className={`absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${palette.glow}`}
                ></div>

                {/* Card Header: Icon & Title */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4 relative z-10">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ${palette.bg} ${palette.shadow}`}
                  >
                    <feature.icon
                      className="w-6 h-6 text-white"
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                    {feature.title}
                  </h3>
                </div>

                {/* Card Body: Feature List */}
                <div className="flex-1 relative z-10">
                  <ul className="space-y-3.5">
                    {feature.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start group/item">
                        <div
                          className={`mt-1 mr-3 flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center transition-colors ${palette.checkBg}`}
                        >
                          <Check
                            className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-400 group-hover/item:${palette.check} transition-colors`}
                            strokeWidth={3}
                          />
                        </div>
                        <span className="text-slate-600 dark:text-slate-300 text-[15.5px] leading-relaxed group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Toggle Button */}
        <div className="mt-16 text-center">
          <button
            onClick={() => setShowAllFeatures(!showAllFeatures)}
            className="inline-flex items-center px-8 py-3.5 text-base font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-blue-100 dark:border-blue-800"
          >
            {showAllFeatures ? (
              <>
                কম ফিচার দেখুন
                <ChevronUp className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                আরও ফিচার দেখুন
                <ChevronDown className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

const AllModules = () => {
  const modules = [
    { name: "শিক্ষার্থী ভর্তি", icon: UserPlus },
    { name: "হাজিরা", icon: CalendarCheck },
    { name: "পরীক্ষা ও ফলাফল", icon: ClipboardList },
    { name: "ফি কালেকশন", icon: CreditCard },
    { name: "লাইব্রেরি", icon: Library },
    { name: "আইডি কার্ড", icon: Contact },
    { name: "এসএমএস নোটিফিকেশন", icon: MessageSquareText },
    { name: "একাডেমিক ক্যালেন্ডার", icon: Clock },
    { name: "স্টাফ ও পেরোল", icon: Briefcase },
    { name: "অ্যানালিটিক্স ড্যাশবোর্ড", icon: Activity },
    { name: "রোল-ভিত্তিক অ্যাক্সেস", icon: Shield },
    { name: "রিপোর্ট বিল্ডার", icon: FileText },
  ];

  return (
    <section className="py-24 bg-slate-50/30 dark:bg-slate-900/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
            সকল মডিউল
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-5">
            একটি প্ল্যাটফর্ম। সব মডিউল।
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            দৈনিক হাজিরা থেকে শুরু করে বছর শেষের রিপোর্ট পর্যন্ত — এডুস্যাস দিয়ে
            সবকিছু পরিচালনা করুন কোনো বাহ্যিক টুল ছাড়াই।
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
          {modules.map((mod, i) => (
            <div
              key={i}
              className="flex items-center space-x-2.5 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 cursor-default"
            >
              <mod.icon
                className="w-4 h-4 text-slate-500 dark:text-slate-400"
                strokeWidth={1.5}
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {mod.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PaymentGateways = () => {
  const gateways = [
    {
      title: "আইবিবিএল আই-ব্যাংকিং",
      desc: "ইসলামী ব্যাংক বাংলাদেশ লিমিটেড-এর ইন্টারনেট ব্যাংকিং গেটওয়ে। শরিয়াহ-সম্মত অনলাইন ফি পেমেন্টের জন্য বাংলাদেশি অভিভাবকদের কাছে ব্যাপকভাবে সমাদৃত।",
      icon: CreditCard,
      colors: {
        iconBg: "bg-orange-50 dark:bg-orange-500/10",
        iconText: "text-orange-500",
        badgeBg: "bg-orange-50/50 dark:bg-orange-500/10",
        badgeBorder: "border-orange-200 dark:border-orange-500/30",
        badgeText: "text-orange-600 dark:text-orange-400",
        dot: "bg-orange-500",
      },
    },
    {
      title: "এসএসএলকমার্জ",
      desc: "বাংলাদেশের শীর্ষস্থানীয় পেমেন্ট গেটওয়ে, যা কার্ড, মোবাইল ব্যাংকিং (বিকাশ, নগদ, রকেট), নেট ব্যাংকিং এবং আরও অনেক কিছু সমর্থন করে — সবই এক চেকআউটে।",
      icon: ShieldCheck,
      colors: {
        iconBg: "bg-blue-50 dark:bg-blue-500/10",
        iconText: "text-blue-500",
        badgeBg: "bg-blue-50/50 dark:bg-blue-500/10",
        badgeBorder: "border-blue-200 dark:border-blue-500/30",
        badgeText: "text-blue-600 dark:text-blue-400",
        dot: "bg-blue-500",
      },
    },
    {
      title: "সোনালী ব্যাংক",
      desc: "সরকারি ও আধা-সরকারি স্কুলের জন্য সরকার-সমর্থিত সোনালী ব্যাংক পেমেন্ট ইন্টিগ্রেশন — যার মাধ্যমে জাতীয় ব্যাংকিং নেটওয়ার্ক ব্যবহার করে ফি সংগ্রহ করা যায়।",
      icon: Landmark,
      colors: {
        iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
        iconText: "text-emerald-600",
        badgeBg: "bg-emerald-50/50 dark:bg-emerald-500/10",
        badgeBorder: "border-emerald-200 dark:border-emerald-500/30",
        badgeText: "text-emerald-700 dark:text-emerald-400",
        dot: "bg-emerald-500",
      },
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
            পেমেন্টস
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            আমাদের সমর্থিত পেমেন্ট গেটওয়েসমূহ
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            বাংলাদেশের সবচেয়ে নির্ভরযোগ্য পেমেন্ট নেটওয়ার্কের মাধ্যমে অনলাইনে
            স্কুলের ফি সংগ্রহ করুন — অভিভাবকরা যেকোনো জায়গা থেকে পেমেন্ট করতে
            পারবেন, আর সিস্টেম তা স্বয়ংক্রিয়ভাবে সমন্বয় করবে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {gateways.map((gateway, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none transition-all duration-300 flex flex-col text-center group"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${gateway.colors.iconBg}`}
              >
                <gateway.icon
                  className={`w-8 h-8 ${gateway.colors.iconText}`}
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {gateway.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                {gateway.desc}
              </p>
              <div className="mt-auto">
                <span
                  className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold border ${gateway.colors.badgeBg} ${gateway.colors.badgeBorder} ${gateway.colors.badgeText}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${gateway.colors.dot}`}
                  ></span>
                  অ্যাক্টিভ ইন্টিগ্রেশন
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch("/api/public/testimonials");
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data)) {
          setReviews(data.data);
        }
      } catch (err) {
        console.error("Testimonials fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  return (
    <section
      id="testimonials"
      className="py-24 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            শিক্ষক এবং পরিচালকদের আস্থার প্ল্যাটফর্ম
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            দেখুন কীভাবে দেশের স্বনামধন্য স্কুলগুলো আমাদের প্ল্যাটফর্মের মাধ্যমে
            ডিজিটাল হচ্ছে।
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            বর্তমানে কোনো টেস্টিমোনিয়াল উপলব্ধ নেই।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <div
                key={review._id || i}
                className="bg-white dark:bg-slate-800/80 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 relative flex flex-col shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex text-amber-400 mb-6">
                  {[...Array(review.rating || 5)].map((_, idx) => (
                    <Star key={idx} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-8 italic flex-1 leading-relaxed">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div className="flex items-center mt-auto">
                  <img
                    src={review.image || `https://i.pravatar.cc/150?u=${i}`}
                    alt={review.author}
                    className="w-12 h-12 rounded-full border-2 border-slate-100 dark:border-slate-600 shadow-sm object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {review.author}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {review.role}
                      {review.instituteName ? `, ${review.instituteName}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};


const Pricing = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnnual, setIsAnnual] = useState(true);

  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await fetch("/api/public/pricing");
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data)) {
          setPlans(data.data);
        }
      } catch (err) {
        console.error("Pricing fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPricing();
  }, []);

  return (
    <section id="pricing" className="py-24 bg-white dark:bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
            প্যাকেজ ও মূল্যতালিকা
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            আপনার প্রতিষ্ঠানের আকার অনুযায়ী সঠিক প্ল্যানটি বেছে নিন
          </h2>

          <div className="flex items-center justify-center mt-10">
            <span
              className={`text-sm font-medium ${!isAnnual ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
            >
              মাসিক বিলিং
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative mx-4 inline-flex h-7 w-14 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isAnnual ? "translate-x-8" : "translate-x-1"}`}
              />
            </button>
            <span
              className={`text-sm font-medium flex items-center ${isAnnual ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
            >
              বার্ষিক বিলিং
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                ডিসকাউন্ট অফার
              </span>
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            বর্তমানে কোনো প্রাইসিং প্ল্যান উপলব্ধ নেই।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, i) => {
              const basePrice = plan.price || 0;
              const hasDiscount = plan.discount && plan.discount > 0;
              const discountedPrice = hasDiscount
                ? Math.round(basePrice - (basePrice * plan.discount) / 100)
                : plan.discountPrice || basePrice;

              const displayPrice = isAnnual ? discountedPrice : basePrice;
              const isPopular = i === 1;

              return (
                <div
                  key={plan._id || i}
                  className={`relative flex flex-col bg-white dark:bg-slate-800 rounded-3xl p-8 border ${
                    isPopular
                      ? "border-blue-500 dark:border-blue-500 shadow-xl shadow-blue-500/10 scale-105 z-10"
                      : "border-slate-200 dark:border-slate-700 shadow-sm"
                  } transition-all duration-300`}
                >
                  {isPopular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md">
                        সবচেয়ে জনপ্রিয়
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {plan.billingType || "রেগুলার প্ল্যান"}
                    </p>
                  </div>

                  <div className="mb-6 flex items-baseline text-slate-900 dark:text-white">
                    <span className="text-3xl font-extrabold mr-1">৳</span>
                    <span className="text-5xl font-extrabold tracking-tight">
                      {displayPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 ml-1 font-medium text-sm">
                      /{isAnnual ? "মাস (বার্ষিক বিলিং)" : "মাস"}
                    </span>
                  </div>

                  {hasDiscount && isAnnual && (
                    <div className="mb-4">
                      <span className="text-xs bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 font-bold px-2 py-0.5 rounded-full">
                        {plan.discount}% ডিসকাউন্ট প্রযোজ্য
                      </span>
                    </div>
                  )}

                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features?.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/login"
                    className={`w-full py-3.5 px-4 rounded-xl font-semibold text-center transition-all active:scale-95 ${
                      isPopular
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                    }`}
                  >
                    প্ল্যানটি বেছে নিন
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

const Support = () => {
  const [formData, setFormData] = useState({
    name: "",
    instituteName: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToastMsg(null);
    try {
      const res = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToastMsg({
          text: "আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! আমাদের টিম দ্রুত যোগাযোগ করবে।",
          type: "success",
        });
        setFormData({ name: "", instituteName: "", phone: "", email: "", message: "" });
      } else {
        setToastMsg({ text: data.message || "বার্তা পাঠাতে ব্যর্থ হয়েছে।", type: "error" });
      }
    } catch (err) {
      setToastMsg({ text: "সার্ভারে সমস্যা হয়েছে। পরে চেষ্টা করুন।", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const supportChannels = [
    {
      title: "ফোন সাপোর্ট",
      desc: "সরাসরি আমাদের এক্সিকিউটিভদের সাথে কথা বলুন। (সকাল ৯টা - রাত ৮টা)",
      icon: PhoneCall,
      action: "+880 1711 223344",
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      title: "ইমেইল সাপোর্ট",
      desc: "যেকোনো সমস্যার বিস্তারিত জানিয়ে ইমেইল করুন। ২৪ ঘণ্টার মধ্যে রিপ্লাই।",
      icon: Mail,
      action: "support@edusaas.com",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
  ];

  return (
    <section className="py-24 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left Side: Support Info */}
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              গ্রাহক সেবা
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              যেকোনো প্রয়োজনে আমরা আছি আপনার পাশে
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 leading-relaxed">
              সফটওয়্যার সেটআপ থেকে শুরু করে দৈনন্দিন যেকোনো সমস্যায় আমাদের
              ডেডিকেটেড সাপোর্ট টিম সর্বদা প্রস্তুত। আপনার স্বাচ্ছন্দ্যই আমাদের
              অগ্রাধিকার।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {supportChannels.map((channel, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${channel.bg}`}
                  >
                    <channel.icon className={`w-6 h-6 ${channel.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {channel.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 h-10">
                    {channel.desc}
                  </p>
                  <span className={`text-sm font-semibold ${channel.color}`}>
                    {channel.action}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="w-full lg:w-1/2 bg-white dark:bg-slate-800 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              আমাদের বার্তা পাঠান
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              ডেমো রিকোয়েস্ট বা যেকোনো জিজ্ঞাসার জন্য ফর্মটি পূরণ করুন।
            </p>

            {toastMsg && (
              <div
                className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                  toastMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                }`}
              >
                {toastMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="উদাঃ মোঃ আব্দুল্লাহ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    প্রতিষ্ঠানের নাম
                  </label>
                  <input
                    type="text"
                    value={formData.instituteName}
                    onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="উদাঃ ঢাকা পাবলিক স্কুল"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="01XXX-XXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    ইমেইল এড্রেস *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  আপনার বার্তা / ডেমো রিকোয়েস্ট *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="কিভাবে আমরা আপনাকে সাহায্য করতে পারি?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 mr-2" />
                )}
                বার্তা পাঠান
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-blue-600">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/50 rounded-full blur-3xl mix-blend-screen"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          আপনার প্রতিষ্ঠানকে আধুনিকীকরণ করতে প্রস্তুত?
        </h2>
        <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          বাংলাদেশের ৫০০+ স্কুলের সাথে যুক্ত হোন যারা এডুস্যাস প্রো ব্যবহার করে
          সময় বাঁচাচ্ছে এবং অভিভাবকদের সেবার মান উন্নত করছে।
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button className="w-full sm:w-auto px-8 py-4 text-base font-bold text-blue-600 bg-white hover:bg-slate-50 rounded-xl shadow-xl transition-transform hover:-translate-y-1">
            ১৪ দিনের ফ্রি ট্রায়াল শুরু করুন
          </button>
          <button className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-transparent border border-white/30 hover:bg-white/10 rounded-xl transition-colors">
            সেলস টিমের সাথে কথা বলুন
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                এডুস্যাস প্রো
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-6 max-w-xs leading-relaxed">
              শিক্ষাপ্রতিষ্ঠান পরিচালনার জন্য বাংলাদেশের সেরা অল-ইন-ওয়ান
              প্ল্যাটফর্ম, যা অ্যাকাডেমিক ও আর্থিক কার্যক্রমকে সহজ করে তোলে।
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">প্রোডাক্ট</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="#features"
                  className="hover:text-blue-400 transition-colors"
                >
                  ফিচারসমূহ
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-blue-400 transition-colors"
                >
                  মূল্যতালিকা
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  ইন্টিগ্রেশন
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  নতুন আপডেট
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">রিসোর্স</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  হেল্প সেন্টার
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  এপিআই গাইড
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  ব্লগ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  ওয়েবিনার
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">কোম্পানি</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  আমাদের সম্পর্কে
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  ক্যারিয়ার
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  যোগাযোগ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  পার্টনারশিপ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} এডুস্যাস টেকনোলজিস। সর্বস্বত্ব
            সংরক্ষিত।
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              গোপনীয়তা নীতি (Privacy)
            </a>
            <a href="#" className="hover:text-white transition-colors">
              ব্যবহারের শর্তাবলী (Terms)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function Page() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
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

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Prevent flash of unstyled content/hydration mismatch on initial load
  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-slate-950"></div>;
  }

  return (
    <div
      className="min-h-screen selection:bg-blue-500/30 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 transition-colors duration-300"
      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap');
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-in {
            animation-name: fade-in;
          }
      `,
        }}
      />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <DashboardMockup />
        <StatsBanner />
        <DetailedFeatures />
        <AllModules />
        <PaymentGateways />
        <Testimonials />
        <Pricing />
        <Support />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
