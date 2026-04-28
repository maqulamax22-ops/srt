import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogIn, 
  UserPlus, 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  User,
  Command
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { auth } from '../../lib/firebase';

export default function Login({ isSignUp = false }: { isSignUp?: boolean }) {
  const { 
    signInWithGoogle, 
    signUpWithEmail, 
    signInWithEmail, 
    resetPassword,
    reloadUser,
    user, 
    isVerified, 
    resendVerification 
  } = useAuth();
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  React.useEffect(() => {
    if (user && isVerified) {
      navigate('/tools');
    }
  }, [user, isVerified, navigate]);

  const handleReload = async () => {
    setLoading(true);
    try {
      await reloadUser();
      if (auth.currentUser?.emailVerified) {
        navigate('/tools');
      } else {
        setError("Account still not verified. Please check your email.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to refresh status");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      const code = err.code || '';
      if (isSignUp && code === 'auth/email-already-in-use') {
        setError("This email is already in use. Please log in instead.");
        setTimeout(() => navigate('/login'), 3000);
      } else if (!isSignUp && (code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-credential')) {
        setError("Email or password is not correct.");
      } else {
        setError(err.message || "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await resetPassword(email);
      setSuccess("A password reset link was sent to your email.");
      setShowReset(false);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await resendVerification();
      setSuccess("Verification email resent!");
    } catch (err: any) {
      setError(err.message || "Failed to send verification email");
    } finally {
      setLoading(false);
    }
  };

  if (user && !isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#030303]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass rounded-[48px] border border-white/10 p-10 sm:p-14 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="w-20 h-20 bg-accent/10 border border-accent/20 rounded-3xl flex items-center justify-center mx-auto text-accent mb-10">
            <Mail size={40} />
          </div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight mb-4">Verification Sent</h1>
          <p className="text-white/40 font-medium mb-10 leading-relaxed">
            A secure link was sent to <span className="text-white">{user?.email}</span>. Activate your account to continue.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleReload}
              disabled={loading}
              className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : (
                <>
                  <CheckCircle2 size={16} />
                  Confirm Status
                </>
              )}
            </button>
            <button
              onClick={handleResend}
              disabled={loading}
              className="w-full py-5 glass border border-white/5 text-white/60 rounded-2xl font-bold text-sm hover:bg-white/5 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin mx-auto text-accent" /> : 'Resend Protocol'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#030303] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-xl w-full glass rounded-[48px] border border-white/10 p-10 sm:p-14 text-center relative z-10"
      >
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-white mb-10 group hover:rotate-12 transition-transform duration-500">
          <Command size={32} />
        </div>

        <div className="space-y-3 mb-12">
          <h1 className="font-display text-4xl font-bold text-white tracking-tight leading-tight">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-white/40 font-medium leading-relaxed max-max-w-xs mx-auto">
            {isSignUp 
              ? 'Join our community and start creating viral content today.' 
              : 'Log in to manage your account and content.'}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-3 text-left"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-xs font-bold flex items-center gap-3 text-left"
          >
            <CheckCircle2 size={18} />
            {success}
          </motion.div>
        )}

        {showReset ? (
          <div className="space-y-6">
            <div className="space-y-3 mb-8 text-left">
              <h2 className="text-xl font-bold text-white">Reset Password</h2>
              <p className="text-white/40 text-sm">Enter your email and we'll send you a link to reset your password.</p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Email</label>
                <div className="relative">
                  <input 
                    required
                    type="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 glass border border-white/5 rounded-2xl text-sm font-medium focus:outline-none focus:border-accent transition-all text-white placeholder-white/20"
                  />
                  <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10" size={18} />
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send Reset Link'}
              </button>
              <button 
                type="button"
                onClick={() => setShowReset(false)}
                className="w-full text-xs font-bold text-white/40 hover:text-white transition-colors"
              >
                Back to Login
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 p-5 glass border border-white/5 text-white rounded-2xl font-bold hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 disabled:opacity-50 text-sm"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" alt="" />
            Continue with Google
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black text-white/20 bg-transparent">
              <span className="bg-[#121212] px-4">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailAction} className="space-y-5 text-left">
             <AnimatePresence mode="wait">
               {isSignUp && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="space-y-2"
                 >
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Name</label>
                    <div className="relative">
                      <input 
                        required
                        type="text" 
                        placeholder="Enter your name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-6 py-4 glass border border-white/5 rounded-2xl text-sm font-medium focus:outline-none focus:border-accent transition-all text-white placeholder-white/20"
                      />
                      <User className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10" size={18} />
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Email</label>
                <div className="relative">
                  <input 
                    required
                    type="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 glass border border-white/5 rounded-2xl text-sm font-medium focus:outline-none focus:border-accent transition-all text-white placeholder-white/20"
                  />
                  <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10" size={18} />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Password</label>
                <div className="relative">
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 glass border border-white/5 rounded-2xl text-sm font-medium focus:outline-none focus:border-accent transition-all text-white placeholder-white/20"
                  />
                  <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10" size={18} />
                </div>
                {!isSignUp && (
                   <button 
                     type="button"
                     onClick={() => setShowReset(true)}
                     className="text-[10px] font-bold text-white/30 hover:text-white transition-colors ml-2"
                   >
                     Forgot your password?
                   </button>
                 )}
              </div>

             <button 
               type="submit"
               disabled={loading}
               className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 active:scale-95 shadow-xl shadow-white/5"
             >
               {loading ? (
                 <Loader2 size={18} className="animate-spin" />
               ) : (
                 <>
                   {isSignUp ? 'Register Now' : 'Login'}
                   <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </>
               )}
             </button>
          </form>
        </div>
        )}

        <div className="mt-12 pt-8 border-t border-white/5 space-y-6">
          <p className="text-xs text-white/30 font-medium">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <Link 
              to={isSignUp ? '/login' : '/signup'} 
              className="ml-2 text-white hover:text-accent transition-colors underline underline-offset-4"
            >
              {isSignUp ? 'Login instead' : 'Register Now'}
            </Link>
          </p>
          
          <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            <ShieldCheck size={14} className="text-green-500/50" />
            End-to-End Encryption Enabled
          </div>
        </div>
      </motion.div>
    </div>
  );
}
