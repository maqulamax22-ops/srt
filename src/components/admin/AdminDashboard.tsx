import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileEdit, 
  Users, 
  Settings, 
  TrendingUp, 
  LogOut,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import AnalyticsOverview from './AnalyticsOverview';
import ContentManager from './ContentManager';
import UserManager from './UserManager';
import NavigationManager from './NavigationManager';

export default function AdminDashboard() {
  const { isAdmin, user, signOut, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
    </div>
  );

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { label: 'Analytics', path: '/admin', icon: TrendingUp },
    { label: 'Content CMS', path: '/admin/content', icon: FileEdit },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const currentNavItem = navItems.find(item => 
    item.path === location.pathname || 
    (item.path !== '/admin' && location.pathname.startsWith(item.path))
  ) || navItems[0];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <AnimatePresence mode='wait'>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl lg:shadow-none"
          >
            <div className="p-8 flex items-center justify-between">
              <Link to="/" className="text-2xl font-black text-white tracking-tight">
                Commentify<span className="text-indigo-500 italic">.</span>
              </Link>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all group ${
                    location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon size={20} className={location.pathname === item.path ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} />
                  {item.label}
                  <ChevronRight size={16} className={`ml-auto transition-transform ${location.pathname === item.path ? 'rotate-90 opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />
                </Link>
              ))}
            </nav>

            <div className="p-6 mt-auto">
              <div className="p-4 bg-slate-800/50 rounded-3xl border border-slate-700 mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Live</span>
                </div>
                <p className="text-xs text-white font-medium">All services operational</p>
              </div>
              <button
                onClick={signOut}
                className="w-full flex items-center gap-3 px-4 py-4 text-red-400 hover:bg-red-900/20 rounded-2xl font-bold transition-all"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:pl-72' : 'pl-0'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isSidebarOpen && (
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-3 bg-slate-900 text-white rounded-xl shadow-lg hover:scale-105 transition-all"
                >
                  <Menu size={20} />
                </button>
              )}
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{currentNavItem.label}</h2>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Admin Panel <ChevronRight size={12} /> {currentNavItem.label}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-4 py-2 w-64 ring-offset-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                <Search size={16} className="text-slate-400" />
                <input placeholder="Search records..." className="bg-transparent border-none focus:outline-none text-sm font-medium w-full" />
              </div>
              
              <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <Bell size={24} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white border border-white" />
              </button>

              <div className="flex items-center gap-3 border-l border-slate-100 pl-6">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">{user?.displayName || 'Administrator'}</p>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Main Office</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 p-[2px] shadow-sm">
                   <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} className="w-full h-full rounded-[14px] object-cover" alt="" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 pb-12">
          <Routes>
            <Route index element={<AnalyticsOverview />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="settings" element={<NavigationManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
