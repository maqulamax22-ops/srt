import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';
import { useCMS } from '../../hooks/useCMS';

export default function Navbar() {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { config, loading } = useCMS();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (loading || !config) return null;

  const navLinks = config.navigation;
  const logoText = config.logoText;

  return (
    <nav className="sticky top-0 z-50 w-full h-20 bg-white border-b border-slate-200 shadow-sm shrink-0 flex items-center">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 sm:px-10">
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="/logo.png" 
            alt="Commentify" 
            className="h-10 w-auto transition-transform group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link: any) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={cn(
                "text-sm font-medium transition-colors pb-1 border-b-2",
                pathname === link.path ? "text-indigo-600 border-indigo-600" : "text-slate-600 border-transparent hover:text-indigo-600"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link 
            to="/tools"
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-full font-semibold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
          >
            Start Creating Now
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-indigo-600 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-[280px] bg-white z-[70] shadow-2xl p-8 transform transition-transform duration-300 ease-in-out md:hidden",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex justify-between items-center mb-10">
          <span className="font-bold text-xl text-slate-900 italic">Menu</span>
          <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex flex-col gap-6">
          {navLinks.map((link: any) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={cn(
                "text-lg font-bold transition-all p-4 rounded-2xl",
                pathname === link.path ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-6 border-t border-slate-100">
            <Link 
              to="/tools"
              className="flex items-center justify-center w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
            >
              Start Creating Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

