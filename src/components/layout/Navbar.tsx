import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Sparkles, Command } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

import { useSiteConfig } from '../../hooks/useSiteConfig';

export default function Navbar() {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const { config, loading: configLoading } = useSiteConfig();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = config.headerNavigation;

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
      scrolled ? "py-4" : "py-6"
    )}>
      <div className="mx-auto max-w-7xl px-6">
        <div className={cn(
          "flex items-center justify-between px-6 py-2 rounded-full transition-all duration-500",
          scrolled ? "bg-white shadow-xl border border-slate-100" : "bg-white/80 backdrop-blur-md border border-white/10"
        )}>
          <Link to="/" className="flex items-center gap-2 group">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt={config.logoText} className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20 group-hover:rotate-12 transition-transform duration-500">
                <Command size={22} strokeWidth={2.5} />
              </div>
            )}
            <span className="font-display text-xl font-bold tracking-tight text-slate-900 group-hover:text-accent transition-colors">
              {config.logoText}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all rounded-full relative",
                  pathname === link.path 
                    ? "text-slate-900" 
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                {pathname === link.path && (
                  <motion.div 
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-slate-900/5 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {link.label}
              </Link>
            ))}
            
            <div className="w-px h-4 bg-slate-200 mx-4" />

            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link 
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-all border border-slate-200"
                  >
                    <LayoutDashboard size={14} />
                    Admin
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center gap-2 p-0.5 rounded-full border border-slate-200 hover:border-slate-300 transition-all">
                    <img 
                      src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                      className="w-8 h-8 rounded-full bg-slate-50"
                      alt=""
                    />
                  </button>
                  <div className="absolute right-0 top-full mt-4 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                       <p className="text-xs font-bold text-slate-900 truncate">{user.displayName || 'User'}</p>
                       <p className="text-[10px] text-slate-500 font-medium truncate italic">{user.email}</p>
                    </div>
                    <button 
                      onClick={signOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} /> Log out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-all"
                >
                  Log in
                </Link>
                <Link 
                  to="/signup"
                  className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-full transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                >
                  Join now
                </Link>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 top-24 z-[90] bg-white md:hidden p-6 mx-6 rounded-3xl h-fit border border-slate-100 shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={cn(
                    "px-6 py-4 rounded-2xl text-lg font-semibold transition-all",
                    pathname === link.path ? "bg-slate-50 text-slate-900" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-4 h-px bg-slate-100" />
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <img 
                      src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                      className="w-12 h-12 rounded-full border border-slate-200"
                      alt=""
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{user.displayName || 'User'}</p>
                      <p className="text-xs text-slate-500 font-medium italic">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={signOut}
                    className="w-full py-4 text-center text-red-500 font-bold bg-slate-50 hover:bg-red-50 rounded-2xl border border-slate-100"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/login" className="py-4 text-center font-bold bg-slate-50 text-slate-900 rounded-2xl border border-slate-100">Log in</Link>
                  <Link to="/signup" className="py-4 text-center font-bold bg-slate-900 text-white rounded-2xl">Join now</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

