import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { motion } from 'motion/react';
import { Lock, Loader2, Mail } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin, isVerified } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (!isVerified && user.providerData.some(p => p.providerId === 'password')) {
    return (
       <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50/50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-indigo-100 border border-slate-100 p-12 text-center"
        >
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto text-red-500 mb-8">
            <Lock size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-4">Account Restricted</h1>
          <p className="text-slate-500 font-light mb-8">
            You must verify your email address to access these features. Please check your inbox for the activation link.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
          >
            I've Verified My Email
          </button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
