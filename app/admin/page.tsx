"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Menu,
  X,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Search,
  Filter,
  Receipt,
  DollarSign,
  Download,
  Printer,
  Bell,
  Shield,
  Lock,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: "admin" | "user" | string;
  status: "active" | "inactive" | "Active" | "Inactive" | string;
  image?: string;
  instituteName?: string;
  mobile?: string;
  packageId?: any;
  package?: string;
  createdAt?: string;
}

interface Plan {
  _id?: string;
  id?: string;
  name: string;
  price: number | string;
  discountPrice?: number;
  discount?: number;
  billingType?: string;
  type?: string;
  features: string[];
}

interface Lead {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status?: string;
  date?: string;
}

interface Testimonial {
  _id?: string;
  id?: string;
  author: string;
  role: string;
  quote: string;
  image?: string;
  instituteName?: string;
  rating?: number;
}

interface Billing {
  _id?: string;
  id?: string;
  invoiceNo: string;
  userName: string;
  userEmail?: string;
  packageName: string;
  amount: number | string;
  billingMethod: string;
  status: "Paid" | "Pending" | "Failed" | string;
  date?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
}

const bnToEn = (str: string) =>
  str.replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d).toString());
const enToBn = (num: number | string) =>
  num ? num.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]) : "";
const parsePrice = (str: string | number) => {
  if (typeof str === "number") return str;
  return Number(bnToEn(str.replace(/,/g, ""))) || 0;
};
const formatPrice = (num: number | string) => {
  const n = typeof num === "number" ? num : Number(num) || 0;
  return enToBn(n.toLocaleString("en-IN"));
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Data States
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    totalRevenue: 0,
    totalLeads: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [billings, setBillings] = useState<Billing[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    siteName: "এডুস্যাস প্রো - স্কুল ম্যানেজমেন্ট",
    adminEmail: "admin@edusaas.com",
    supportPhone: "+880 1711223344",
    supportEmail: "support@edusaas.com",
    currentPassword: "",
    newPassword: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form specific input states
  const [formValues, setFormValues] = useState({
    name: "",
    price: "",
    discount: "",
    type: "Yearly (বার্ষিক)",
  });
  const [planFeatures, setPlanFeatures] = useState<string[]>([]);
  const [showUserPassword, setShowUserPassword] = useState(false);

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

  // Fetch live data for current tab
  const fetchTabData = useCallback(async (tabName: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/dashboard?tab=${tabName}`);
      const result = await res.json();

      if (res.ok && result.success) {
        const data = result.data;
        if (tabName === "dashboard" || tabName === "overview") {
          if (data.stats) setStats(data.stats);
          if (data.recentUsers) setUsers(data.recentUsers);
          if (data.recentBillings) setBillings(data.recentBillings);
          if (data.notifications) setNotifications(data.notifications);
        } else if (tabName === "users" || tabName === "subscribers") {
          setUsers(Array.isArray(data) ? data : []);
        } else if (tabName === "pricing") {
          setPlans(Array.isArray(data) ? data : []);
        } else if (tabName === "billing") {
          setBillings(Array.isArray(data) ? data : []);
        } else if (tabName === "leads") {
          setLeads(Array.isArray(data) ? data : []);
        } else if (tabName === "testimonials") {
          setTestimonials(Array.isArray(data) ? data : []);
        } else if (tabName === "settings") {
          if (data) {
            setSettingsForm((prev) => ({
              ...prev,
              siteName: data.siteName || prev.siteName,
              adminEmail: data.adminEmail || prev.adminEmail,
              supportPhone: data.supportPhone || prev.supportPhone,
              supportEmail: data.supportEmail || prev.supportEmail,
            }));
          }
        }
      } else {
        showToast(result.message || "ডেটা লোড করতে সমস্যা হয়েছে।", "error");
      }
    } catch (error) {
      console.error("Fetch tab data error:", error);
      showToast("সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchTabData(activeTab);
  }, [activeTab, fetchTabData]);

  const openModal = (type: string, item: any = null) => {
    setModalType(type);
    setSelectedItem(item);

    if (type.includes("plan")) {
      setFormValues({
        name: item?.name || "",
        price: item?.price ? item.price.toString() : "",
        discount: item?.discount !== undefined ? item.discount.toString() : "",
        type: item?.billingType || item?.type || "Yearly (বার্ষিক)",
      });
      setPlanFeatures(item?.features ? [...item.features] : [""]);
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
    setSelectedItem(null);
    setPlanFeatures([]);
    setShowUserPassword(false);
    setFormValues({
      name: "",
      price: "",
      discount: "",
      type: "Yearly (বার্ষিক)",
    });
  };

  const handleDelete = async (type: string, id: string) => {
    try {
      let endpoint = "";
      if (type === "user") endpoint = `/api/users?id=${id}`;
      if (type === "plan") endpoint = `/api/delete-plan?id=${id}`;
      if (type === "lead") endpoint = `/api/leads?id=${id}`;
      if (type === "testimonial") endpoint = `/api/testimonials?id=${id}`;
      if (type === "billing") endpoint = `/api/billing?id=${id}`;

      const res = await fetch(endpoint, { method: "DELETE" });
      const result = await res.json();

      if (res.ok && result.success) {
        showToast("সফলভাবে মুছে ফেলা হয়েছে!");
        fetchTabData(activeTab);
      } else {
        showToast(result.message || "মুছে ফেলা ব্যর্থ হয়েছে।", "error");
      }
    } catch (e) {
      showToast("মুছে ফেলতে সার্ভার এরর হয়েছে।", "error");
    }
    closeModal();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    try {
      if (modalType.includes("user")) {
        const name = formData.get("userName") as string;
        const email = formData.get("userEmail") as string;
        const mobile = formData.get("userMobile") as string;
        const instituteName = formData.get("userInstitute") as string;
        const packageId = formData.get("userPackage") as string;
        const status = (formData.get("userStatus") as string)?.toLowerCase() || "active";
        const role = (formData.get("userRole") as string)?.toLowerCase() || "user";
        const image = formData.get("userImage") as string;
        const password = formData.get("userPassword") as string;

        if (modalType === "add-user") {
          const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              mobile,
              instituteName,
              packageId,
              status,
              role,
              image,
              password: password || "123456",
            }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            showToast("ব্যবহারকারী সফলভাবে তৈরি হয়েছে!");
            fetchTabData(activeTab);
          } else {
            showToast(data.message || "ইউজার তৈরি করা যায়নি।", "error");
            return;
          }
        } else if (modalType === "edit-user" && selectedItem) {
          const id = selectedItem._id || selectedItem.id;
          const res = await fetch(`/api/users?id=${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              mobile,
              instituteName,
              packageId,
              status,
              role,
              image,
              password: password || undefined,
            }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            showToast("ইউজার তথ্য আপডেট হয়েছে!");
            fetchTabData(activeTab);
          } else {
            showToast(data.message || "আপডেট ব্যর্থ হয়েছে।", "error");
            return;
          }
        }
      } else if (modalType.includes("plan")) {
        const name = formValues.name;
        const price = parsePrice(formValues.price);
        const discount = formValues.discount !== "" ? Number(formValues.discount) : 0;
        const billingType = formValues.type.includes("Monthly")
          ? "Monthly (মাসিক)"
          : "Yearly (বার্ষিক)";
        const cleanFeatures = planFeatures.filter((f) => f.trim() !== "");

        if (modalType === "add-plan") {
          const res = await fetch("/api/create-plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              price,
              discount,
              billingType,
              features: cleanFeatures,
            }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            showToast("প্রাইসিং প্ল্যান তৈরি হয়েছে!");
            fetchTabData(activeTab);
          } else {
            showToast(data.message || "প্ল্যান তৈরি ব্যর্থ হয়েছে।", "error");
            return;
          }
        } else if (modalType === "edit-plan" && selectedItem) {
          const id = selectedItem._id || selectedItem.id;
          const res = await fetch(`/api/edit-plan?id=${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              price,
              discount,
              billingType,
              features: cleanFeatures,
            }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            showToast("প্ল্যান আপডেট হয়েছে!");
            fetchTabData(activeTab);
          } else {
            showToast(data.message || "আপডেট ব্যর্থ হয়েছে।", "error");
            return;
          }
        }
      } else if (modalType.includes("testimonial")) {
        const author = formData.get("testAuthor") as string;
        const role = formData.get("testRole") as string;
        const instituteName = formData.get("testInstitute") as string;
        const quote = formData.get("testQuote") as string;
        const image = formData.get("testImage") as string;

        if (modalType === "add-testimonial") {
          const res = await fetch("/api/testimonials", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              author,
              role,
              instituteName,
              quote,
              image,
              rating: 5,
            }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            showToast("টেস্টিমোনিয়াল যুক্ত হয়েছে!");
            fetchTabData(activeTab);
          } else {
            showToast(data.message || "যুক্ত করতে সমস্যা হয়েছে।", "error");
            return;
          }
        } else if (modalType === "edit-testimonial" && selectedItem) {
          const id = selectedItem._id || selectedItem.id;
          const res = await fetch(`/api/testimonials?id=${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              author,
              role,
              instituteName,
              quote,
              image,
            }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            showToast("টেস্টিমোনিয়াল আপডেট হয়েছে!");
            fetchTabData(activeTab);
          } else {
            showToast(data.message || "আপডেট ব্যর্থ হয়েছে।", "error");
            return;
          }
        }
      }
    } catch (e) {
      showToast("সার্ভারে সমস্যা হয়েছে।", "error");
      return;
    }

    closeModal();
  };

  const handleDownloadInvoice = (invoiceNo: string) => {
    showToast(`ইনভয়েস ${invoiceNo} সফলভাবে ডাউনলোড হয়েছে!`);
  };

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("অ্যাডমিন সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
        setSettingsForm((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
        }));
      } else {
        showToast(data.message || "সেটিংস সংরক্ষণ ব্যর্থ হয়েছে।", "error");
      }
    } catch (e) {
      showToast("সার্ভার ত্রুটি।", "error");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    showToast("লগআউট সফল হয়েছে...");
    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 500);
  };

  if (!mounted)
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-900"></div>;

  const navItems = [
    { id: "dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
    { id: "users", label: "ইউজার ম্যানেজমেন্ট", icon: Users },
    { id: "subscribers", label: "সাবস্ক্রাইবারগণ", icon: CreditCard },
    { id: "billing", label: "বিলিং ও ইনভয়েস", icon: Receipt },
    { id: "pricing", label: "প্রাইসিং প্ল্যান", icon: DollarSign },
    { id: "leads", label: "লিড ও কন্টাক্ট", icon: MessageSquare },
    { id: "testimonials", label: "টেস্টিমোনিয়াল", icon: Star },
    { id: "settings", label: "সেটিংস", icon: Settings },
  ];

  const filteredUsers = users.filter((u) =>
    searchQuery
      ? u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.instituteName?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const filteredBillings = billings.filter((b) =>
    searchQuery
      ? b.invoiceNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.packageName?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          ওভারভিউ পরিসংখ্যান
        </h2>
        <button
          onClick={() => fetchTabData("dashboard")}
          className="flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg hover:bg-blue-100 transition-all"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
          />{" "}
          রিফ্রেশ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                মোট ইউজার
              </p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">
                {enToBn(stats.totalUsers || users.length)}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                অ্যাক্টিভ সাবস্ক্রাইবার
              </p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">
                {enToBn(stats.activeSubscribers || users.filter((u) => u.status === "active" || u.status === "Active").length)}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                মোট অর্জিত রাজস্ব
              </p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">
                ৳ {formatPrice(stats.totalRevenue || 0)}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
              <Receipt className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                নতুন লিড ও কন্টাক্ট
              </p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">
                {enToBn(stats.totalLeads || leads.length)}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <MessageSquare className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users and Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            সাম্প্রতিক ইউজারগণ
          </h3>
          <div className="space-y-3">
            {users.slice(0, 5).map((u, i) => (
              <div
                key={u._id || u.id || i}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.image || "https://i.pravatar.cc/150?u=1"}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {u.name}
                    </p>
                    <p className="text-xs text-slate-500">{u.instituteName || u.email}</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    u.status === "active" || u.status === "Active"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {u.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            সাম্প্রতিক ইনভয়েস
          </h3>
          <div className="space-y-3">
            {billings.slice(0, 5).map((b, i) => (
              <div
                key={b._id || b.id || i}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50"
              >
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {b.invoiceNo}
                  </p>
                  <p className="text-xs text-slate-500">{b.userName} • {b.packageName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    ৳ {formatPrice(b.amount)}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold uppercase">
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          ইউজার ম্যানেজমেন্ট ({enToBn(filteredUsers.length)})
        </h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="খুঁজুন (নাম, ইমেইল)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => openModal("add-user")}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" /> নতুন ইউজার
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            কোনো ইউজার পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    প্রোফাইল
                  </th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    নাম ও প্রতিষ্ঠান
                  </th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    যোগাযোগ
                  </th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    প্যাকেজ
                  </th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    রোল
                  </th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    স্ট্যাটাস
                  </th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id || user.id}
                    className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-4">
                      <img
                        src={user.image || "https://i.pravatar.cc/150?u=1"}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600"
                      />
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-800 dark:text-slate-200 font-bold">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {user.instituteName || "প্রযোজ্য নয়"}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {user.email}
                      </p>
                      <p className="text-xs text-slate-500">
                        {user.mobile || "নম্বর নেই"}
                      </p>
                    </td>
                    <td className="p-4 text-sm text-blue-600 dark:text-blue-400 font-semibold">
                      {user.packageId?.name || user.package || "বেসিক প্যাকেজ"}
                    </td>
                    <td className="p-4 text-xs font-semibold uppercase text-slate-600 dark:text-slate-300">
                      {user.role}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          user.status === "active" || user.status === "Active"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2 pt-6">
                      <button
                        onClick={() => openModal("view-user", user)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal("edit-user", user)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal("delete-user", user)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 bg-rose-50 dark:bg-rose-900/20 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
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
  );

  const renderSubscribers = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        সাবস্ক্রাইবার তালিকা
      </h2>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  প্রতিষ্ঠান ও ইউজার
                </th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  অ্যাক্টিভ প্যাকেজ
                </th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  যোগাযোগ
                </th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  স্ট্যাটাস
                </th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((u) => u.role === "user")
                .map((user) => (
                  <tr
                    key={user._id || user.id}
                    className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-4">
                      <p className="text-sm font-bold text-slate-800 dark:text-white">
                        {user.instituteName || "ইনস্টিটিউট নাম নেই"}
                      </p>
                      <p className="text-xs text-slate-500">{user.name}</p>
                    </td>
                    <td className="p-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {user.packageId?.name || user.package || "প্রফেশনাল"}
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                      {user.email} ({user.mobile})
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {user.status === "active" || user.status === "Active"
                          ? "Subscribed (সক্রিয়)"
                          : "Inactive (নিষ্ক্রিয়)"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          বিলিং ও ইনভয়েস ইতিহাস ({enToBn(filteredBillings.length)})
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchTabData("billing")}
            className="flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
            />
            রিফ্রেশ
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  ইনভয়েস নম্বর
                </th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  ইউজার / প্রতিষ্ঠান
                </th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  প্যাকেজ
                </th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  পরিমাণ
                </th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  পেমেন্ট মেথড
                </th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  স্ট্যাটাস
                </th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">
                  অ্যাকশন
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBillings.map((bill) => (
                <tr
                  key={bill._id || bill.id}
                  className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-4 text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                    {bill.invoiceNo}
                  </td>
                  <td className="p-4 text-sm text-slate-900 dark:text-white font-medium">
                    {bill.userName}
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {bill.packageName}
                  </td>
                  <td className="p-4 text-sm font-bold text-blue-600 dark:text-blue-400">
                    ৳ {formatPrice(bill.amount)}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                      {bill.billingMethod}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        bill.status === "Paid"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {bill.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => openModal("view-billing", bill)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-700 rounded"
                      title="View Invoice"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(bill.invoiceNo)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 dark:bg-slate-700 rounded"
                      title="Download Invoice"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal("delete-billing", bill)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 bg-rose-50 dark:bg-rose-900/20 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          প্রাইসিং প্ল্যান ম্যানেজমেন্ট
        </h2>
        <button
          onClick={() => openModal("add-plan")}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-medium text-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> নতুন প্ল্যান
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const numericPrice = parsePrice(plan.price);
          const hasDiscount =
            plan.discount !== undefined &&
            plan.discount > 0 &&
            !isNaN(numericPrice);
          const discountedPrice = hasDiscount
            ? Math.round(numericPrice - (numericPrice * plan.discount!) / 100)
            : numericPrice;

          return (
            <div
              key={plan._id || plan.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col relative overflow-hidden"
            >
              {hasDiscount && (
                <div className="absolute top-0 right-0 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-sm z-10">
                  {enToBn(plan.discount!)}% ছাড়
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 pr-12">
                {plan.name}
              </h3>
              <div className="mb-6">
                {hasDiscount && (
                  <div className="text-sm font-medium text-slate-400 line-through mb-1">
                    ৳ {formatPrice(plan.price)}
                  </div>
                )}
                <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                  ৳ {formatPrice(discountedPrice)}{" "}
                  <span className="text-sm font-medium text-slate-500">
                    /{plan.billingType || plan.type || "Yearly"}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features?.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start text-sm text-slate-600 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => openModal("edit-plan", plan)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-2" /> আপডেট
                </button>
                <button
                  onClick={() => openModal("delete-plan", plan)}
                  className="py-2 px-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderLeads = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        লিড ও কন্টাক্ট মেসেজ ({enToBn(leads.length)})
      </h2>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            কোনো লিড মেসেজ নেই।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    নাম
                  </th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    যোগাযোগ
                  </th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    মেসেজ
                  </th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead._id || lead.id}
                    className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-4">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {lead.name}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {lead.email}
                      </p>
                      <p className="text-xs text-slate-500">{lead.phone}</p>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {lead.message}
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => openModal("view-lead", lead)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 bg-slate-100 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal("delete-lead", lead)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 bg-rose-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
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
  );

  const renderTestimonials = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          টেস্টিমোনিয়াল ম্যানেজমেন্ট ({enToBn(testimonials.length)})
        </h2>
        <button
          onClick={() => openModal("add-testimonial")}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" /> নতুন টেস্টিমোনিয়াল
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((test) => (
          <div
            key={test._id || test.id}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
          >
            <p className="text-slate-600 dark:text-slate-300 text-sm italic mb-6">
              &ldquo;{test.quote}&rdquo;
            </p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <img
                  src={test.image || "https://i.pravatar.cc/150?u=14"}
                  alt={test.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {test.author}
                  </p>
                  <p className="text-xs text-slate-500">
                    {test.role}
                    {test.instituteName ? `, ${test.instituteName}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal("edit-testimonial", test)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-100 dark:bg-slate-700 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openModal("delete-testimonial", test)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 bg-rose-50 dark:bg-rose-900/20 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        অ্যাডমিন সেটিংস
      </h2>
      <form
        onSubmit={handleSettingsSave}
        className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6"
      >
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
            সাইটের নাম
          </label>
          <input
            type="text"
            value={settingsForm.siteName}
            onChange={(e) =>
              setSettingsForm({ ...settingsForm, siteName: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
            অ্যাডমিন ইমেইল
          </label>
          <input
            type="email"
            value={settingsForm.adminEmail}
            onChange={(e) =>
              setSettingsForm({ ...settingsForm, adminEmail: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
            সাপোর্ট ফোন নম্বর
          </label>
          <input
            type="text"
            value={settingsForm.supportPhone}
            onChange={(e) =>
              setSettingsForm({ ...settingsForm, supportPhone: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            অ্যাডমিন পাসওয়ার্ড পরিবর্তন
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
                বর্তমান পাসওয়ার্ড
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={settingsForm.currentPassword}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
                নতুন পাসওয়ার্ড
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={settingsForm.newPassword}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    newPassword: e.target.value,
                  })
                }
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all"
        >
          পরিবর্তন সংরক্ষণ করুন
        </button>
      </form>
    </div>
  );

  const renderModal = () => {
    if (!isModalOpen) return null;
    const isDelete = modalType.includes("delete");
    const isView = modalType.includes("view");

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          {isDelete && (
            <div className="p-8 text-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                আপনি কি নিশ্চিত?
              </h3>
              <p className="text-slate-500 mb-6">
                এই আইটেমটি স্থায়ীভাবে মুছে ফেলা হবে।
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 font-medium text-slate-700 bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  onClick={() =>
                    handleDelete(
                      modalType.split("-")[1],
                      selectedItem._id || selectedItem.id
                    )
                  }
                  className="px-6 py-2.5 font-medium text-white bg-rose-600 rounded-xl"
                >
                  মুছে ফেলুন
                </button>
              </div>
            </div>
          )}

          {isView && selectedItem && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold dark:text-white">
                  {modalType === "view-billing"
                    ? "ইনভয়েস বিবরণী"
                    : modalType === "view-user"
                    ? "ইউজার প্রোফাইল"
                    : "বিস্তারিত তথ্য"}
                </h3>
                <button onClick={closeModal}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalType === "view-billing" ? (
                <div className="space-y-4 text-sm dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">ইনভয়েস নম্বর:</span>
                    <span className="font-bold font-mono">
                      {selectedItem.invoiceNo}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">গ্রাহকের নাম:</span>
                    <span className="font-semibold">{selectedItem.userName}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">প্যাকেজ:</span>
                    <span>{selectedItem.packageName}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">টাকার পরিমাণ:</span>
                    <span className="font-bold text-blue-600">
                      ৳ {formatPrice(selectedItem.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">পেমেন্ট মেথড:</span>
                    <span className="font-medium text-indigo-600">
                      {selectedItem.billingMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">স্ট্যাটাস:</span>
                    <span className="font-bold text-emerald-600">
                      {selectedItem.status}
                    </span>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={() => handleDownloadInvoice(selectedItem.invoiceNo)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" /> ডাউনলোড ইনভয়েস
                    </button>
                  </div>
                </div>
              ) : modalType === "view-user" ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                    <img
                      src={
                        selectedItem.image || "https://i.pravatar.cc/150?u=1"
                      }
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800"
                    />
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                        {selectedItem.name}
                      </h4>
                      <p className="text-sm font-medium text-slate-500">
                        {selectedItem.instituteName || "প্রতিষ্ঠান নেই"}
                      </p>
                      <span
                        className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                          selectedItem.status === "active" ||
                          selectedItem.status === "Active"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {selectedItem.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm dark:text-slate-300">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">ইমেইল</p>
                      <p className="font-medium break-all">{selectedItem.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">মোবাইল</p>
                      <p className="font-medium">
                        {selectedItem.mobile || "দেওয়া হয়নি"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">রোল</p>
                      <p className="font-medium uppercase">{selectedItem.role}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">অ্যাক্টিভ প্যাকেজ</p>
                      <p className="font-medium text-blue-600">
                        {selectedItem.packageId?.name || selectedItem.package || "বেসিক"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm dark:text-white">
                  <p>
                    <strong>নাম:</strong> {selectedItem.name}
                  </p>
                  <p>
                    <strong>ইমেইল:</strong> {selectedItem.email}
                  </p>
                  {selectedItem.phone && (
                    <p>
                      <strong>ফোন:</strong> {selectedItem.phone}
                    </p>
                  )}
                  {selectedItem.message && (
                    <p className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      {selectedItem.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {!isDelete && !isView && (
            <form onSubmit={handleSave} className="flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-bold dark:text-white">
                  {modalType.includes("user")
                    ? "ইউজার ফর্ম"
                    : modalType.includes("plan")
                    ? "প্ল্যান ফর্ম"
                    : "টেস্টিমোনিয়াল ফর্ম"}
                </h3>
                <button type="button" onClick={closeModal}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto">
                {modalType.includes("user") && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                          নাম
                        </label>
                        <input
                          required
                          name="userName"
                          defaultValue={selectedItem?.name}
                          type="text"
                          className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                          ইমেইল
                        </label>
                        <input
                          required
                          name="userEmail"
                          defaultValue={selectedItem?.email}
                          type="email"
                          className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                          মোবাইল নম্বর
                        </label>
                        <input
                          name="userMobile"
                          defaultValue={selectedItem?.mobile}
                          type="tel"
                          className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                          প্রতিষ্ঠানের নাম
                        </label>
                        <input
                          name="userInstitute"
                          defaultValue={selectedItem?.instituteName}
                          type="text"
                          className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                          প্যাকেজ
                        </label>
                        <select
                          name="userPackage"
                          defaultValue={selectedItem?.packageId?._id || selectedItem?.packageId}
                          className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"
                        >
                          {plans.map((p) => (
                            <option key={p._id || p.id} value={p._id || p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                          স্ট্যাটাস
                        </label>
                        <select
                          name="userStatus"
                          defaultValue={selectedItem?.status || "active"}
                          className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                          রোল (Role)
                        </label>
                        <select
                          name="userRole"
                          defaultValue={selectedItem?.role || "user"}
                          className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"
                        >
                          <option value="user">Subscriber (User)</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                          পাসওয়ার্ড
                        </label>
                        <div className="relative">
                          <input
                            name="userPassword"
                            required={modalType === "add-user"}
                            type={showUserPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full p-2.5 pr-10 rounded-lg border dark:bg-slate-800 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowUserPassword(!showUserPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                          >
                            {showUserPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                        ছবির ইউআরএল
                      </label>
                      <input
                        name="userImage"
                        defaultValue={selectedItem?.image}
                        type="text"
                        placeholder="https://..."
                        className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </>
                )}

                {modalType.includes("plan") && (
                  <>
                    <div>
                      <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                        প্ল্যানের নাম
                      </label>
                      <input
                        required
                        type="text"
                        value={formValues.name}
                        onChange={(e) =>
                          setFormValues({ ...formValues, name: e.target.value })
                        }
                        className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                          মূল্য (৳)
                        </label>
                        <input
                          required
                          type="text"
                          value={formValues.price}
                          onChange={(e) =>
                            setFormValues({ ...formValues, price: e.target.value })
                          }
                          className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                          ডিসকাউন্ট (%)
                        </label>
                        <input
                          type="number"
                          value={formValues.discount}
                          onChange={(e) =>
                            setFormValues({
                              ...formValues,
                              discount: e.target.value,
                            })
                          }
                          className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                        বিলিং টাইপ
                      </label>
                      <select
                        value={formValues.type}
                        onChange={(e) =>
                          setFormValues({ ...formValues, type: e.target.value })
                        }
                        className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"
                      >
                        <option value="Yearly (বার্ষিক)">Yearly (বার্ষিক)</option>
                        <option value="Monthly (মাসিক)">Monthly (মাসিক)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium dark:text-slate-300 block mb-2 mt-4">
                        প্ল্যানের ফিচারসমূহ
                      </label>
                      <div className="space-y-2 pr-2">
                        {planFeatures.map((feat, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={feat}
                              onChange={(e) => {
                                const newFeats = [...planFeatures];
                                newFeats[index] = e.target.value;
                                setPlanFeatures(newFeats);
                              }}
                              className="flex-1 p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white text-sm"
                              placeholder={`ফিচার ${index + 1}`}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (planFeatures.length > 1) {
                                  setPlanFeatures(
                                    planFeatures.filter((_, i) => i !== index)
                                  );
                                }
                              }}
                              className="p-2.5 bg-rose-50 text-rose-600 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setPlanFeatures([...planFeatures, ""])}
                        className="mt-3 flex items-center text-sm font-medium text-blue-600 hover:underline bg-blue-50 py-2 px-3 rounded-lg w-fit"
                      >
                        <Plus className="w-4 h-4 mr-1" /> নতুন ফিচার যোগ করুন
                      </button>
                    </div>
                  </>
                )}

                {modalType.includes("testimonial") && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                          লেখকের নাম
                        </label>
                        <input
                          required
                          name="testAuthor"
                          defaultValue={selectedItem?.author}
                          type="text"
                          className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                          পদবী (Role)
                        </label>
                        <input
                          required
                          name="testRole"
                          defaultValue={selectedItem?.role}
                          type="text"
                          placeholder="উদাঃ অধ্যক্ষ"
                          className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                          স্কুল/কলেজের নাম
                        </label>
                        <input
                          name="testInstitute"
                          defaultValue={selectedItem?.instituteName}
                          type="text"
                          placeholder="উদাঃ ঢাকা পাবলিক স্কুল"
                          className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                          ছবির ইউআরএল
                        </label>
                        <input
                          name="testImage"
                          defaultValue={selectedItem?.image}
                          type="text"
                          placeholder="https://..."
                          className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium dark:text-slate-300 block mb-1">
                        মতামত (Quote)
                      </label>
                      <textarea
                        required
                        name="testQuote"
                        defaultValue={selectedItem?.quote}
                        rows={3}
                        className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"
                      ></textarea>
                    </div>
                  </>
                )}
              </div>
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 ${
            toast.type === "error"
              ? "bg-rose-600 text-white"
              : "bg-slate-900 text-white"
          }`}
        >
          {toast.type === "error" ? (
            <XCircle className="w-5 h-5 text-white" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/50 z-40 md:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-slate-900 text-slate-300 h-full border-r border-slate-800 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 text-white font-bold">
              E
            </div>
            <span className="text-lg font-bold text-white">অ্যাডমিন প্যানেল</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon
                className={`w-5 h-5 mr-3 ${
                  activeTab === item.id ? "text-white" : "text-slate-400"
                }`}
              />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" /> লগআউট
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="mr-3 md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
              {navItems.find((i) => i.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <Bell className="w-5 h-5" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-bold text-sm dark:text-white">
                    নোটিফিকেশন
                  </span>
                  <span
                    className="text-xs text-blue-600 cursor-pointer"
                    onClick={() =>
                      setNotifications(
                        notifications.map((n) => ({ ...n, read: true }))
                      )
                    }
                  >
                    সব পঠিত
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b border-slate-50 dark:border-slate-700/50 text-xs ${
                        !n.read ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
                      }`}
                    >
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mr-2 font-bold">
                A
              </div>
              সিস্টেম অ্যাডমিন
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "users" && renderUsers()}
            {activeTab === "subscribers" && renderSubscribers()}
            {activeTab === "billing" && renderBilling()}
            {activeTab === "pricing" && renderPricing()}
            {activeTab === "leads" && renderLeads()}
            {activeTab === "testimonials" && renderTestimonials()}
            {activeTab === "settings" && renderSettings()}
          </div>
        </div>
      </main>
      {renderModal()}
    </div>
  );
}