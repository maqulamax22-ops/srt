import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Instagram, Download, Zap, Sparkles, Command, ShieldCheck, Globe, Star } from 'lucide-react';
import { useCMS } from '../hooks/useCMS';
import { cn } from '../lib/utils';

import { useAuth } from '../lib/AuthContext';

export default function LandingPage() {
  const { pages, loading: cmsLoading } = useCMS();
  const { user, isVerified } = useAuth();
  const landingData = pages.landing;

  if (cmsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="w-12 h-12 border-t-2 border-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  const ctaLink = user && isVerified ? '/tools' : '/signup';
  const ctaText = user && isVerified ? 'Go to Tools' : 'Get Started';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: any = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="bg-[#030303] min-h-screen selection:bg-accent/30 selection:text-white pb-32">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center text-center space-y-10"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full border border-white/10 shadow-glow shadow-white/5">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <img 
                    key={i} 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=creator${i}`} 
                    className="w-6 h-6 rounded-full border-2 border-[#030303] bg-zinc-800"
                    alt="User avatar"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/90">
                {landingData?.hero.badge || 'PRO Protocol active'}
              </span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="font-display text-[clamp(2.5rem,10vw,5.5rem)] font-bold tracking-tight text-white leading-[0.95] text-balance"
            >
              {landingData?.hero.title.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < landingData.hero.title.split('\n').length - 1 && <br />}
                </React.Fragment>
              )) || 'The Next Evolution of Viral Assets'}
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="mx-auto max-w-2xl text-[clamp(1rem,3vw,1.25rem)] text-white/70 font-medium leading-relaxed"
            >
              {landingData?.hero.subtitle || 'Industrial-grade AI engines and layouts that generate realistic, pixel-perfect stickers for Instagram and TikTok.'}
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 w-full"
            >
              <Link
                to={ctaLink}
                className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-white text-black rounded-3xl font-bold hover:scale-105 transition-all duration-500 active:scale-95 w-full sm:w-auto text-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 -z-10" />
                <span className="group-hover:text-white transition-colors duration-500 flex items-center gap-2">
                  {user && isVerified ? 'Launch Studio' : (landingData?.hero.ctaText || 'Launch Enterprise Tool')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link to={ctaLink} className="flex items-center justify-center gap-2 px-8 py-5 glass hover:bg-white/10 rounded-3xl font-bold transition-all w-full sm:w-auto text-lg text-white">
                {ctaText}
              </Link>
            </motion.div>

            {/* Platform Badges */}
            <motion.div variants={itemVariants} className="pt-16 flex items-center gap-10 opacity-60 grayscale-[0.5] hover:grayscale-0 hover:opacity-100 transition-all duration-700 text-white">
               <Instagram size={28} />
               <Globe size={28} />
               <ShieldCheck size={28} />
               <Zap size={28} />
            </motion.div>

            {/* iPhone Mockup Section */}
            <motion.div 
              variants={itemVariants}
              className="mt-20 w-full max-w-5xl aspect-video rounded-[48px] overflow-hidden border border-white/10 glass p-4 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent z-10" />
              <img 
                src={landingData?.hero.imageUrl || "https://images.unsplash.com/photo-1556656793-062ff9f1b5aa?q=80&w=2000&auto=format&fit=crop"} 
                alt="Commentify" 
                className="w-full h-full object-cover rounded-[32px] group-hover:scale-[1.02] transition-transform duration-1000 opacity-60 grayscale hover:grayscale-0"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                 <div className="glass p-8 rounded-3xl border-white/20 shadow-2xl backdrop-blur-xl transform -rotate-2">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-10 h-10 rounded-full bg-zinc-800" />
                       <div className="font-bold text-white text-sm">ugc_creator <span className="text-blue-400">Verified</span></div>
                    </div>
                    <p className="text-white text-lg font-medium leading-tight">This tool is a game changer for my content! 🚀</p>
                 </div>
              </div>
              <div className="absolute bottom-12 left-12 z-20 hidden md:block">
                 <div className="glass px-6 py-4 rounded-2xl border-white/20">
                    <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Live Asset Preview</p>
                    <p className="text-sm font-bold text-white">Instagram Dark Mode Sub-system</p>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Sections from Registry */}
      <div className="space-y-32">
        {landingData?.sections?.map((section) => (
          <section key={section.id} className="px-6">
             <div className="mx-auto max-w-7xl">
                {section.type === 'features' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     <div className="lg:col-span-1">
                        <h2 className="text-4xl font-bold text-white mb-4 tracking-tighter leading-none">{section.title}</h2>
                        <p className="text-white/50">{section.subtitle}</p>
                     </div>
                     {section.items?.map((item, i) => (
                       <div key={i} className="glass p-10 rounded-[40px] border border-white/10">
                          <Star className="text-accent mb-6" />
                          <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                          <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                       </div>
                     ))}
                  </div>
                )}

                {section.type === 'rich-text' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className={cn("prose prose-invert", !section.imageUrl && "md:col-span-2 max-w-3xl mx-auto")}>
                      <h2 className="text-4xl font-bold text-white mb-8 tracking-tighter">{section.title}</h2>
                      <div className="text-xl text-white/70 leading-relaxed space-y-6">
                        {section.content?.split('\n').map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    </div>
                    {section.imageUrl && (
                      <div className="relative group">
                        <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                        <img 
                          src={section.imageUrl} 
                          alt={section.title} 
                          className="relative z-10 w-full aspect-square object-cover rounded-[48px] border border-white/10 shadow-2xl" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                )}

                {section.type === 'cta' && (
                  <div className="glass p-16 rounded-[60px] border border-white/10 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <h2 className="text-5xl font-black text-white mb-6 tracking-tighter leading-none">{section.title}</h2>
                    <p className="text-xl text-white/60 mb-10 max-w-xl mx-auto">{section.subtitle}</p>
                    <Link
                      to={ctaLink}
                      className="inline-flex items-center gap-3 px-12 py-6 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all"
                    >
                      {user && isVerified ? 'Go to Tools' : (section.ctaText || 'Get Started')}
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                )}
             </div>
          </section>
        ))}
      </div>

      {/* Feature Grid / Immersive Section (Hardcoded Fallback/Default) */}
      <section className="py-24 px-6 relative">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Primary Feature Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-8 group relative aspect-[16/10] sm:aspect-auto sm:h-[600px] glass rounded-[48px] overflow-hidden border border-white/10 hover:border-white/20 p-12 transition-all duration-700 active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative z-10 h-full flex flex-col justify-end max-w-md">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 text-white">
                  <Star size={28} />
                </div>
                <h3 className="font-display text-5xl font-bold mb-4 tracking-tighter text-white">Unified Studio</h3>
                <p className="text-white/80 text-xl font-medium">A single, powerful interface for all your creative needs. One workspace, infinite possibilities.</p>
              </div>
              
              {/* Floating UI Elements Simulation */}
              <div className="absolute top-12 right-12 hidden lg:block w-[400px]">
                <div className="glass rounded-3xl p-6 shadow-2xl border-white/20 transform rotate-6 hover:rotate-3 transition-transform duration-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-indigo-500" />
                    <div>
                      <div className="h-3 w-24 bg-white/20 rounded-full mb-1" />
                      <div className="h-2 w-16 bg-white/10 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-white/10 rounded-full" />
                    <div className="h-4 w-4/5 bg-white/10 rounded-full" />
                  </div>
                </div>
                <div className="mt-8 glass rounded-full py-4 px-8 border-white/20 flex items-center justify-between transform -rotate-3 hover:rotate-0 transition-transform duration-700">
                   <div className="flex gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                     <span className="text-xs font-bold uppercase tracking-widest text-white/60 leading-none">Live Analytics</span>
                   </div>
                   <div className="text-xs font-black text-white">94.2% Success</div>
                </div>
              </div>
            </motion.div>
            
            {/* Secondary Feature Cards */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1 glass rounded-[48px] p-12 border border-white/10 hover:border-white/20 transition-all duration-700"
              >
                <div className="h-full flex flex-col justify-between">
                  <Zap size={48} className="text-accent mb-12" />
                  <div>
                    <h4 className="text-3xl font-bold mb-2 tracking-tight text-white">Ultra Fast</h4>
                    <p className="text-white/60 font-medium">Global CDN backbone ensures instant rendering and exports under 300ms.</p>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex-1 glass rounded-[48px] p-12 border border-white/10 hover:border-white/20 transition-all duration-700"
              >
                <div className="h-full flex flex-col justify-between">
                  <Download size={48} className="text-white mb-12" />
                  <div>
                    <h4 className="text-3xl font-bold mb-2 tracking-tight text-white">High Fidelity</h4>
                    <p className="text-white/60 font-medium">Export in lossless 8K resolution with alpha transparency out of the box.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Large Text / Philosophy Section */}
      <section className="py-48 px-6 bg-white rounded-[60px] text-[#030303] relative z-10 overflow-hidden">
        <div className="mx-auto max-w-7xl">
           <div className="max-w-4xl">
             <h2 className="font-display text-[clamp(2rem,8vw,5.5rem)] font-bold tracking-tight leading-[0.95] mb-20 text-balance">
                "Simple enough for casual use, <span className="opacity-40">powerful enough for the world's best creative agencies."</span>
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
               {[
                 { label: "UGC Creators", value: "500+" },
                 { label: "Agency Partners", value: "20+" },
                 { label: "Rendered Daily", value: "10k+" }
               ].map((stat, i) => (
                 <div key={i}>
                   <div className="text-[clamp(2rem,6vw,4rem)] font-black tracking-tighter leading-none mb-2">{stat.value}</div>
                   <div className="text-black/40 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-48 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          <h2 className="font-display text-[clamp(2.5rem,10vw,6rem)] font-bold tracking-tight mb-12 text-white">
            Build the <span className="text-gradient">Future.</span>
          </h2>
          <Link
            to={ctaLink}
            className="inline-flex items-center gap-4 bg-white text-black px-12 py-6 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-2xl shadow-accent/20 active:scale-95"
          >
            {ctaText}
            <ArrowRight size={24} />
          </Link>
          <p className="mt-8 text-white/50 font-medium">No credit card required. Cancel anytime.</p>
        </motion.div>
      </section>
    </div>
  );
}
