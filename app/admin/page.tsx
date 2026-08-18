"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, CreditCard, MessageSquare, Star, 
  Settings, LogOut, Plus, Edit, Trash2, Eye, EyeOff, Menu, X, 
  CheckCircle2, XCircle, MoreVertical, Search, Filter, Receipt, DollarSign, Download, Printer, Bell, Shield, Lock, Calendar
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  image?: string;
  instituteName?: string;
  mobile?: string;
  package?: string;
  createdAt: string; // নতুন তারিখ ফিল্ড
}

interface Plan {
  id: string;
  name: string;
  price: string;
  discount?: number;
  type: string;
  features: string[];
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
}

interface Testimonial {
  id: string;
  author: string;
  role: string;
  quote: string;
  image?: string;
  instituteName?: string;
}

interface Billing {
  id: string;
  invoiceNo: string;
  userName: string;
  packageName: string;
  amount: string;
  billingMethod: 'বিকাশ (bKash)' | 'নগদ (Nagad)' | 'ব্যাংক ট্রান্সফার' | 'ক্রেডিট কার্ড' | 'SSLCommerz';
  status: 'Paid' | 'Pending' | 'Failed';
  date: string;
}

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
}

// Number conversion helpers for discount calculation
const bnToEn = (str: string) => str.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d).toString());
const enToBn = (num: number | string) => num.toString().replace(/\d/g, d => '০১২৩৪۵৬৭৮৯'[parseInt(d)]);
const parsePrice = (str: string) => Number(bnToEn(str).replace(/,/g, ''));
const formatPrice = (num: number) => enToBn(num.toLocaleString('en-IN'));

const mockUsers: User[] = [
  { id: '1', name: 'Karim Rahman', email: 'karim@edusaas.com', mobile: '01711223344', instituteName: 'ঢাকা পাবলিক স্কুল', package: 'প্রফেশনাল (Professional)', role: 'Admin', status: 'Active', image: 'https://i.pravatar.cc/150?u=1', createdAt: '2026-08-01' },
  { id: '2', name: 'Sarmin Akter', email: 'sarmin@school.com', mobile: '01811223344', instituteName: 'গ্রিনফিল্ড মডেল একাডেমি', package: 'স্টার্টার (Starter)', role: 'Subscriber', status: 'Active', image: 'https://i.pravatar.cc/150?u=2', createdAt: '2026-08-05' },
  { id: '3', name: 'Jamal Uddin', email: 'jamal@college.com', mobile: '01911223344', instituteName: 'রাজশাহী কলেজিয়েট', package: 'এন্টারপ্রাইজ (Enterprise)', role: 'Subscriber', status: 'Inactive', image: 'https://i.pravatar.cc/150?u=3', createdAt: '2026-08-10' },
];

const mockPlans: Plan[] = [
  { id: '1', name: 'স্টার্টার (Starter)', price: '১,২০০', discount: 15, type: 'Yearly', features: ['সর্বোচ্চ ৫০০ শিক্ষার্থী', 'বেসিক অ্যাটেনডেন্স', 'রেজাল্ট প্রসেসিং'] },
  { id: '2', name: 'প্রফেশনাল (Professional)', price: '২,৪০০', discount: 25, type: 'Yearly', features: ['সর্বোচ্চ ২,০০০ শিক্ষার্থী', 'বায়োমেট্রিক অ্যাটেনডেন্স', 'অনলাইন পেমেন্ট', 'অটোমেটেড একাউন্টিং'] },
  { id: '3', name: 'এন্টারপ্রাইজ (Enterprise)', price: '৫,০০০', discount: 10, type: 'Monthly', features: ['আনলিমিটেড শিক্ষার্থী', 'মাল্টি-ব্রাঞ্চ', 'কাস্টম ডোমেইন', 'কাস্টম API'] },
];

const mockLeads: Lead[] = [
  { id: '1', name: 'Rafiqul Islam', email: 'rafiq@gmail.com', phone: '01711000000', message: 'I need a demo for my school.', date: '2026-08-12' },
  { id: '2', name: 'Nusrat Jahan', email: 'nusrat@yahoo.com', phone: '01811000000', message: 'Pricing related query.', date: '2026-08-13' },
];

const mockTestimonials: Testimonial[] = [
  { id: '1', author: 'ড. শফিকুল ইসলাম', role: 'অধ্যক্ষ', instituteName: 'ফিউচার প্রিপারেটরি স্কুল', quote: 'এডুস্যাস প্রো আমাদের স্কুলের ব্যবস্থাপনা অনেক সহজ করে দিয়েছে।', image: 'https://i.pravatar.cc/150?u=14' },
];

const mockBillings: Billing[] = [
  { id: '1', invoiceNo: 'INV-2026-001', userName: 'Sarmin Akter', packageName: 'স্টার্টার (Starter)', amount: '১,০২০', billingMethod: 'বিকাশ (bKash)', status: 'Paid', date: '2026-08-01' },
  { id: '2', invoiceNo: 'INV-2026-002', userName: 'Karim Rahman', packageName: 'প্রফেশনাল (Professional)', amount: '১,৮০০', billingMethod: 'SSLCommerz', status: 'Paid', date: '2026-08-05' },
  { id: '3', invoiceNo: 'INV-2026-003', userName: 'Jamal Uddin', packageName: 'এন্টারপ্রাইজ (Enterprise)', amount: '৪,৫০০', billingMethod: 'ব্যাংক ট্রান্সফার', status: 'Pending', date: '2026-08-10' },
];

const mockNotifications: NotificationItem[] = [
  { id: '1', title: 'নতুন সাবস্ক্রিপশন পেমেন্ট সম্পন্ন হয়েছে (৳১,৮০০)', time: '১০ মিনিট আগে', read: false },
  { id: '2', title: 'নতুন একটি ডেমো রিকোয়েস্ট লিড জমা পড়েছে', time: '১ ঘণ্টা আগে', read: false },
  { id: '3', title: 'নতুন ইউজার রেজিস্ট্রেশন হয়েছে', time: '৩ ঘণ্টা আগে', read: true },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data States
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(mockTestimonials);
  const [billings, setBillings] = useState<Billing[]>(mockBillings);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    siteName: 'এডুস্যাস প্রো - স্কুল ম্যানেজমেন্ট',
    adminEmail: 'admin@edusaas.com',
    supportPhone: '+880 1711223344',
    currentPassword: '',
    newPassword: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); 
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Form specific input states
  const [formValues, setFormValues] = useState({ name: '', price: '', discount: '', type: 'Yearly' });
  const [planFeatures, setPlanFeatures] = useState<string[]>([]);
  const [showUserPassword, setShowUserPassword] = useState(false);
  
  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const openModal = (type: string, item: any = null) => {
    setModalType(type);
    setSelectedItem(item);
    
    if (type.includes('plan')) {
      setFormValues({
        name: item?.name || '',
        price: item?.price || '',
        discount: item?.discount !== undefined ? item.discount.toString() : '',
        type: item?.type || 'Yearly'
      });
      setPlanFeatures(item?.features ? [...item.features] : ['']);
    }
    
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('');
    setSelectedItem(null);
    setPlanFeatures([]);
    setShowUserPassword(false);
    setFormValues({ name: '', price: '', discount: '', type: 'Yearly' });
  };

  const handleDelete = (type: string, id: string) => {
    if (type === 'user') setUsers(users.filter(u => u.id !== id));
    if (type === 'plan') setPlans(plans.filter(p => p.id !== id));
    if (type === 'lead') setLeads(leads.filter(l => l.id !== id));
    if (type === 'testimonial') setTestimonials(testimonials.filter(t => t.id !== id));
    if (type === 'billing') setBillings(billings.filter(b => b.id !== id));
    
    showToast('সফলভাবে মুছে ফেলা হয়েছে!');
    closeModal();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    if (modalType.includes('user')) {
      const name = formData.get('userName') as string;
      const email = formData.get('userEmail') as string;
      const mobile = formData.get('userMobile') as string;
      const instituteName = formData.get('userInstitute') as string;
      const packageType = formData.get('userPackage') as string;
      const status = formData.get('userStatus') as 'Active' | 'Inactive';
      const role = formData.get('userRole') as string;
      const image = formData.get('userImage') as string;
      const todayDate = new Date().toISOString().split('T')[0];

      if (modalType === 'add-user') {
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          mobile,
          instituteName,
          package: packageType,
          status,
          role,
          image: image || 'https://i.pravatar.cc/150?u=' + Date.now(),
          createdAt: todayDate
        };
        setUsers([newUser, ...users]);
      } else if (modalType === 'edit-user' && selectedItem) {
        setUsers(users.map(u => u.id === selectedItem.id ? {
          ...u,
          name,
          email,
          mobile,
          instituteName,
          package: packageType,
          status,
          role,
          image: image || u.image
        } : u));
      }
    } else if (modalType.includes('plan')) {
      const name = formValues.name;
      const price = formValues.price;
      const discount = formValues.discount !== '' ? Number(formValues.discount) : undefined;
      const type = formValues.type;
      const cleanFeatures = planFeatures.filter(f => f.trim() !== '');

      if (modalType === 'add-plan') {
        const newPlan: Plan = {
          id: Date.now().toString(),
          name,
          price,
          discount,
          type,
          features: cleanFeatures
        };
        setPlans([...plans, newPlan]);
      } else if (modalType === 'edit-plan' && selectedItem) {
        setPlans(plans.map(p => p.id === selectedItem.id ? { ...p, name, price, discount, type, features: cleanFeatures } : p));
      }
    } else if (modalType.includes('testimonial')) {
      const author = formData.get('testAuthor') as string;
      const role = formData.get('testRole') as string;
      const instituteName = formData.get('testInstitute') as string;
      const quote = formData.get('testQuote') as string;
      const image = formData.get('testImage') as string;

      if (modalType === 'add-testimonial') {
        const newTest: Testimonial = {
          id: Date.now().toString(),
          author,
          role,
          instituteName,
          quote,
          image: image || 'https://i.pravatar.cc/150?u=' + Date.now()
        };
        setTestimonials([...testimonials, newTest]);
      } else if (modalType === 'edit-testimonial' && selectedItem) {
        setTestimonials(testimonials.map(t => t.id === selectedItem.id ? { ...t, author, role, instituteName, quote, image: image || t.image } : t));
      }
    }

    showToast('সফলভাবে সংরক্ষণ করা হয়েছে!');
    closeModal();
  };

  const handleDownloadInvoice = (invoiceNo: string) => {
    showToast(`ইনভয়েস ${invoiceNo} সফলভাবে ডাউনলোড হয়েছে!`);
  };

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('অ্যাডমিন সেটিংস সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    showToast('লগআউট সফল হয়েছে...');
    setTimeout(() => {
      router.push('/login');
      router.refresh();
    }, 500);
  };

  if (!mounted) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900"></div>;

  const navItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'users', label: 'ইউজার ম্যানেজমেন্ট', icon: Users },
    { id: 'subscribers', label: 'সাবস্ক্রাইবারগণ', icon: CreditCard },
    { id: 'billing', label: 'বিলিং ও ইনভয়েস', icon: Receipt },
    { id: 'pricing', label: 'প্রাইসিং প্ল্যান', icon: DollarSign },
    { id: 'leads', label: 'লিড ও কন্টাক্ট', icon: MessageSquare },
    { id: 'testimonials', label: 'টেস্টিমোনিয়াল', icon: Star },
    { id: 'settings', label: 'সেটিংস', icon: Settings },
  ];

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">ওভারভিউ</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">মোট ইউজার</p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{users.length}</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg"><Users className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">অ্যাক্টিভ সাবস্ক্রাইবার</p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{users.filter(u => u.package).length}</h3>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg"><CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" /></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">মোট বিলিং ইনভয়েস</p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{billings.length}</h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg"><Receipt className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">নতুন লিড</p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{leads.length}</h3>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg"><MessageSquare className="w-6 h-6 text-amber-600 dark:text-amber-400" /></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">ইউজার ম্যানেজমেন্ট</h2>
        <button onClick={() => openModal('add-user')} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-2" /> নতুন ইউজার
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">প্রোফাইল</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">নাম ও প্রতিষ্ঠান</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">যোগাযোগ</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">প্যাকেজ</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">তারিখ</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">স্ট্যাটাস</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <img src={user.image || 'https://via.placeholder.com/150'} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600" />
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-slate-800 dark:text-slate-200 font-bold">{user.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{user.instituteName || 'প্রযোজ্য নয়'}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                    <p className="text-xs text-slate-500">{user.mobile || 'নম্বর নেই'}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{user.package || 'ফ্রি প্ল্যান'}</td>
                  <td className="p-4 text-xs font-mono text-slate-500 flex items-center pt-5">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {user.createdAt || '2026-08-01'}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => openModal('view-user', user)} className="p-1.5 text-slate-400 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-700 dark:hover:bg-slate-600 rounded"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => openModal('edit-user', user)} className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 dark:bg-slate-700 dark:hover:bg-slate-600 rounded"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => openModal('delete-user', user)} className="p-1.5 text-slate-400 hover:text-rose-600 bg-rose-50 dark:bg-rose-900/20 rounded"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSubscribers = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">সাবস্ক্রাইবার ম্যানেজমেন্ট</h2>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">প্রতিষ্ঠান ও ইউজার</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">অ্যাক্টিভ প্যাকেজ</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">যোগাযোগ</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">সাবস্ক্রিপশন তারিখ</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.package).map((user) => (
                <tr key={user.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{user.instituteName || 'ইনস্টিটিউট নাম নেই'}</p>
                    <p className="text-xs text-slate-500">{user.name}</p>
                  </td>
                  <td className="p-4 text-sm font-semibold text-blue-600 dark:text-blue-400">{user.package}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{user.email} ({user.mobile})</td>
                  <td className="p-4 text-xs font-mono text-slate-500 flex items-center pt-5">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {user.createdAt || '2026-08-01'}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Subscribed</span>
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
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">বিলিং ও ইনভয়েস ইতিহাস</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">ইনভয়েস নম্বর</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">ইউজার / প্রতিষ্ঠান</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">প্যাকেজ</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">পরিমাণ</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">পেমেন্ট মেথড</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">তারিখ</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">স্ট্যাটাস</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {billings.map((bill) => (
                <tr key={bill.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-sm font-mono font-bold text-slate-700 dark:text-slate-300">{bill.invoiceNo}</td>
                  <td className="p-4 text-sm text-slate-900 dark:text-white font-medium">{bill.userName}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{bill.packageName}</td>
                  <td className="p-4 text-sm font-bold text-blue-600 dark:text-blue-400">৳ {bill.amount}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                      {bill.billingMethod}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-500">{bill.date}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => openModal('view-billing', bill)} className="p-1.5 text-slate-400 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-700 rounded" title="View Invoice"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => handleDownloadInvoice(bill.invoiceNo)} className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 dark:bg-slate-700 rounded" title="Download Invoice"><Download className="w-4 h-4" /></button>
                    <button onClick={() => openModal('delete-billing', bill)} className="p-1.5 text-slate-400 hover:text-rose-600 bg-rose-50 dark:bg-rose-900/20 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">প্রাইসিং প্ল্যান ম্যানেজমেন্ট</h2>
        <button onClick={() => openModal('add-plan')} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> নতুন প্ল্যান
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const numericPrice = parsePrice(plan.price);
          const hasDiscount = plan.discount !== undefined && plan.discount > 0 && !isNaN(numericPrice);
          const discountedPrice = hasDiscount ? formatPrice(Math.round(numericPrice - (numericPrice * plan.discount!) / 100)) : plan.price;

          return (
            <div key={plan.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col relative overflow-hidden">
              {hasDiscount && (
                <div className="absolute top-0 right-0 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-sm z-10">
                  {enToBn(plan.discount!)}% ছাড়
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 pr-12">{plan.name}</h3>
              <div className="mb-6">
                {hasDiscount && <div className="text-sm font-medium text-slate-400 line-through mb-1">৳ {plan.price}</div>}
                <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                  ৳ {discountedPrice} <span className="text-sm font-medium text-slate-500">/{plan.type}</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button onClick={() => openModal('edit-plan', plan)} className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                  <Edit className="w-4 h-4 mr-2" /> আপডেট
                </button>
                <button onClick={() => openModal('delete-plan', plan)} className="py-2 px-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderLeads = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">লিড ও কন্টাক্ট মেসেজ</h2>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">নাম ও তারিখ</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">যোগাযোগ</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">মেসেজ</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4"><p className="text-sm font-medium text-slate-800 dark:text-slate-200">{lead.name}</p><p className="text-xs text-slate-500">{lead.date}</p></td>
                  <td className="p-4"><p className="text-sm text-slate-600 dark:text-slate-400">{lead.email}</p><p className="text-xs text-slate-500">{lead.phone}</p></td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{lead.message}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => openModal('view-lead', lead)} className="p-1.5 text-slate-400 hover:text-emerald-600 bg-slate-100 rounded"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => openModal('delete-lead', lead)} className="p-1.5 text-slate-400 hover:text-rose-600 bg-rose-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTestimonials = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">টেস্টিমোনিয়াল ম্যানেজমেন্ট</h2>
        <button onClick={() => openModal('add-testimonial')} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> নতুন টেস্টিমোনিয়াল
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((test) => (
          <div key={test.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <p className="text-slate-600 dark:text-slate-300 text-sm italic mb-6">&ldquo;{test.quote}&rdquo;</p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <img src={test.image || 'https://via.placeholder.com/150'} alt={test.author} className="w-10 h-10 rounded-full object-cover" />
                <div><p className="font-bold text-slate-900 dark:text-white text-sm">{test.author}</p><p className="text-xs text-slate-500">{test.role}{test.instituteName ? `, ${test.instituteName}` : ''}</p></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openModal('edit-testimonial', test)} className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-100 dark:bg-slate-700 rounded"><Edit className="w-4 h-4" /></button>
                <button onClick={() => openModal('delete-testimonial', test)} className="p-1.5 text-slate-400 hover:text-rose-600 bg-rose-50 dark:bg-rose-900/20 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">অ্যাডমিন সেটিংস</h2>
      <form onSubmit={handleSettingsSave} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">সাইটের নাম</label>
          <input 
            type="text" 
            value={settingsForm.siteName} 
            onChange={(e) => setSettingsForm({...settingsForm, siteName: e.target.value})}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">অ্যাডমিন ইমেইল</label>
          <input 
            type="email" 
            value={settingsForm.adminEmail} 
            onChange={(e) => setSettingsForm({...settingsForm, adminEmail: e.target.value})}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">সাপোর্ট ফোন নম্বর</label>
          <input 
            type="text" 
            value={settingsForm.supportPhone} 
            onChange={(e) => setSettingsForm({...settingsForm, supportPhone: e.target.value})}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">পাসওয়ার্ড পরিবর্তন</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">বর্তমান পাসওয়ার্ড</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">নতুন পাসওয়ার্ড</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
        </div>
        <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all">
          পরিবর্তন সংরক্ষণ করুন
        </button>
      </form>
    </div>
  );

  const renderModal = () => {
    if (!isModalOpen) return null;
    const isDelete = modalType.includes('delete');
    const isView = modalType.includes('view');

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          {isDelete && (
            <div className="p-8 text-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">আপনি কি নিশ্চিত?</h3>
              <p className="text-slate-500 mb-6">এই আইটেমটি স্থায়ীভাবে মুছে ফেলা হবে।</p>
              <div className="flex justify-center gap-4">
                <button onClick={closeModal} className="px-6 py-2.5 font-medium text-slate-700 bg-slate-100 rounded-xl">বাতিল</button>
                <button onClick={() => handleDelete(modalType.split('-')[1], selectedItem.id)} className="px-6 py-2.5 font-medium text-white bg-rose-600 rounded-xl">মুছে ফেলুন</button>
              </div>
            </div>
          )}

          {isView && selectedItem && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold dark:text-white">
                  {modalType === 'view-billing' ? 'ইনভয়েস বিবরণী' : modalType === 'view-user' ? 'ইউজার প্রোফাইল' : 'বিস্তারিত তথ্য'}
                </h3>
                <button onClick={closeModal}><X className="w-5 h-5" /></button>
              </div>

              {modalType === 'view-billing' ? (
                <div className="space-y-4 text-sm dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between border-b pb-2"><span className="text-slate-500">ইনভয়েস নম্বর:</span><span className="font-bold font-mono">{selectedItem.invoiceNo}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-slate-500">গ্রাহকের নাম:</span><span className="font-semibold">{selectedItem.userName}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-slate-500">প্যাকেজ:</span><span>{selectedItem.packageName}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-slate-500">টাকার পরিমাণ:</span><span className="font-bold text-blue-600">৳ {selectedItem.amount}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-slate-500">পেমেন্ট মেথড:</span><span className="font-medium text-indigo-600">{selectedItem.billingMethod}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-slate-500">তারিখ:</span><span>{selectedItem.date}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">স্ট্যাটাস:</span><span className="font-bold text-emerald-600">{selectedItem.status}</span></div>
                  
                  <div className="pt-4 flex gap-3">
                    <button onClick={() => handleDownloadInvoice(selectedItem.invoiceNo)} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> ডাউনলোড ইনভয়েস
                    </button>
                  </div>
                </div>
              ) : modalType === 'view-user' ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                    <img src={selectedItem.image || 'https://via.placeholder.com/150'} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800" />
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white">{selectedItem.name}</h4>
                      <p className="text-sm font-medium text-slate-500">{selectedItem.instituteName || 'প্রতিষ্ঠান নেই'}</p>
                      <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${selectedItem.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30'}`}>
                        {selectedItem.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm dark:text-slate-300">
                    <div><p className="text-xs text-slate-500 mb-1">ইমেইল</p><p className="font-medium break-all">{selectedItem.email}</p></div>
                    <div><p className="text-xs text-slate-500 mb-1">মোবাইল</p><p className="font-medium">{selectedItem.mobile || 'দেওয়া হয়নি'}</p></div>
                    <div><p className="text-xs text-slate-500 mb-1">রোল</p><p className="font-medium">{selectedItem.role}</p></div>
                    <div><p className="text-xs text-slate-500 mb-1">অ্যাক্টিভ প্যাকেজ</p><p className="font-medium text-blue-600">{selectedItem.package || 'নাই'}</p></div>
                    <div><p className="text-xs text-slate-500 mb-1">রেজিস্ট্রেশন তারিখ</p><p className="font-medium font-mono">{selectedItem.createdAt || '2026-08-01'}</p></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm dark:text-white">নাম: {selectedItem.name}</p>
                  <p className="text-sm dark:text-white">ইমেইল: {selectedItem.email}</p>
                </div>
              )}
            </div>
          )}

          {!isDelete && !isView && (
            <form onSubmit={handleSave} className="flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center"><h3 className="text-lg font-bold dark:text-white">{modalType.includes('user') ? 'ইউজার ফর্ম' : modalType.includes('plan') ? 'প্ল্যান ফর্ম' : 'টেস্টিমোনিয়াল ফর্ম'}</h3><button type="button" onClick={closeModal}><X className="w-5 h-5" /></button></div>
              <div className="p-6 space-y-4 overflow-y-auto">
                {modalType.includes('user') && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium dark:text-slate-300 block mb-1">নাম</label><input required name="userName" defaultValue={selectedItem?.name} type="text" className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white" /></div>
                      <div><label className="text-sm font-medium dark:text-slate-300 block mb-1">ইমেইল</label><input required name="userEmail" defaultValue={selectedItem?.email} type="email" className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white" /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium dark:text-slate-300 block mb-1">মোবাইল নম্বর</label><input name="userMobile" defaultValue={selectedItem?.mobile} type="tel" className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white" /></div>
                      <div><label className="text-sm font-medium dark:text-slate-300 block mb-1">প্রতিষ্ঠানের নাম</label><input name="userInstitute" defaultValue={selectedItem?.instituteName} type="text" className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white" /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium dark:text-slate-300 block mb-1">প্যাকেজ</label>
                        <select name="userPackage" defaultValue={selectedItem?.package} className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white">
                          <option value="স্টার্টার (Starter)">স্টার্টার (Starter)</option>
                          <option value="প্রফেশনাল (Professional)">প্রফেশনাল (Professional)</option>
                          <option value="এন্টারপ্রাইজ (Enterprise)">এন্টারপ্রাইজ (Enterprise)</option>
                        </select>
                      </div>
                      <div><label className="text-sm font-medium dark:text-slate-300 block mb-1">স্ট্যাটাস</label>
                        <select name="userStatus" defaultValue={selectedItem?.status || 'Active'} className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white">
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium dark:text-slate-300 block mb-1">রোল (Role)</label>
                        <select name="userRole" defaultValue={selectedItem?.role || 'Subscriber'} className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white">
                          <option value="Subscriber">Subscriber</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium dark:text-slate-300 block mb-1">পাসওয়ার্ড</label>
                        <div className="relative">
                          <input required={modalType === 'add-user'} type={showUserPassword ? "text" : "password"} placeholder="••••••••" className="w-full p-2.5 pr-10 rounded-lg border dark:bg-slate-800 dark:text-white" />
                          <button type="button" onClick={() => setShowUserPassword(!showUserPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
                            {showUserPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div><label className="text-sm font-medium dark:text-slate-300 block mb-1">ছবির ইউআরএল</label><input name="userImage" defaultValue={selectedItem?.image} type="text" placeholder="https://..." className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white" /></div>
                  </>
                )}

                {modalType.includes('plan') && (
                  <>
                    <div><label className="text-sm font-medium dark:text-slate-300 block mb-1">প্ল্যানের নাম</label><input required type="text" value={formValues.name} onChange={e => setFormValues({...formValues, name: e.target.value})} className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium dark:text-slate-300 block mb-1">মূল্য</label><input required type="text" value={formValues.price} onChange={e => setFormValues({...formValues, price: e.target.value})} className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white" /></div>
                      <div><label className="text-sm font-medium dark:text-slate-300 block mb-1">ডিসকাউন্ট (%)</label><input type="number" value={formValues.discount} onChange={e => setFormValues({...formValues, discount: e.target.value})} className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white" /></div>
                    </div>
                    <div><label className="text-sm font-medium dark:text-slate-300 block mb-1">বিলিং টাইপ</label>
                      <select value={formValues.type} onChange={e => setFormValues({...formValues, type: e.target.value})} className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white">
                        <option value="Yearly">Yearly (বার্ষিক)</option>
                        <option value="Monthly">Monthly (মাসিক)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium dark:text-slate-300 block mb-2 mt-4">প্ল্যানের ফিচারসমূহ</label>
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
                                  setPlanFeatures(planFeatures.filter((_, i) => i !== index));
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
                        onClick={() => setPlanFeatures([...planFeatures, ''])}
                        className="mt-3 flex items-center text-sm font-medium text-blue-600 hover:underline bg-blue-50 py-2 px-3 rounded-lg w-fit"
                      >
                        <Plus className="w-4 h-4 mr-1" /> নতুন ফিচার যোগ করুন
                      </button>
                    </div>
                  </>
                )}

                {modalType.includes('testimonial') && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium dark:text-slate-300 block mb-1">লেখকের নাম</label><input required name="testAuthor" defaultValue={selectedItem?.author} type="text" className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white" /></div>
                      <div><label className="text-sm font-medium dark:text-slate-300 block mb-1">পদবী (Role)</label><input required name="testRole" defaultValue={selectedItem?.role} type="text" placeholder="উদাঃ অধ্যক্ষ" className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white" /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium dark:text-slate-300 block mb-1">স্কুল/কলেজের নাম</label><input name="testInstitute" defaultValue={selectedItem?.instituteName} type="text" placeholder="উদাঃ ঢাকা পাবলিক স্কুল" className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white" /></div>
                      <div><label className="text-sm font-medium dark:text-slate-300 block mb-1">ছবির ইউআরএল</label><input name="testImage" defaultValue={selectedItem?.image} type="text" placeholder="https://..." className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white" /></div>
                    </div>
                    <div><label className="text-sm font-medium dark:text-slate-300 block mb-1">মতামত (Quote)</label><textarea required name="testQuote" defaultValue={selectedItem?.quote} rows={3} className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:text-white"></textarea></div>
                  </>
                )}
              </div>
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3"><button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">সংরক্ষণ করুন</button></div>
            </form>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
      {toast.show && <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /><span className="text-sm font-medium">{toast.message}</span></div>}
      
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 h-full border-r border-slate-800">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 mb-6"><div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 text-white font-bold">E</div><span className="text-lg font-bold text-white">অ্যাডমিন প্যানেল</span></div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'hover:bg-slate-800 hover:text-white'}`}>
              <item.icon className={`w-5 h-5 mr-3 ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />{item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors">
            <LogOut className="w-5 h-5 mr-3" /> লগআউট
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 z-10">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-white">{navItems.find(i => i.id === activeTab)?.label}</h1>
          <div className="flex items-center gap-4 relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Bell className="w-5 h-5" />
              {notifications.some(n => !n.read) && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center"><span className="font-bold text-sm dark:text-white">নোটিফিকেশন</span><span className="text-xs text-blue-600 cursor-pointer" onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}>সব পঠিত</span></div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 border-b border-slate-50 dark:border-slate-700/50 text-xs ${!n.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mr-2 font-bold">A</div>
              অ্যাডমিন
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8"><div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'subscribers' && renderSubscribers()}
          {activeTab === 'billing' && renderBilling()}
          {activeTab === 'pricing' && renderPricing()}
          {activeTab === 'leads' && renderLeads()}
          {activeTab === 'testimonials' && renderTestimonials()}
          {activeTab === 'settings' && renderSettings()}
        </div></div>
      </main>
      {renderModal()}
    </div>
  );
}