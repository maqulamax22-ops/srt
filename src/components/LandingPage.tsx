import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Instagram, Music2, Download, Zap, Heart, Type, Sparkles } from 'lucide-react';
import { useCMS } from '../hooks/useCMS';

export default function LandingPage() {
  const { pages, loading } = useCMS();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const landingData = pages.landing;
  
  // Find specific sections
  const heroSection = landingData?.sections.find(s => s.type === 'hero');
  const featureSection = landingData?.sections.find(s => s.type === 'features');
  const ctaSection = landingData?.sections.find(s => s.type === 'text-cta');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-16 lg:pt-24 lg:pb-24 px-6 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center space-y-6"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-balance"
            >
              {heroSection?.title || (
                <>
                  Create Realistic <span className="text-insta-gradient">Social Media</span> <br/>
                  <span className="text-indigo-600">Comment Stickers</span> For Your Videos
                </>
              )}
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="mx-auto max-w-2xl text-lg text-slate-500 font-light"
            >
              {heroSection?.subtitle || 'Download high-quality sticker images for UGC content, ads, and Reels. Authentic layouts for Instagram and TikTok.'}
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link
                to={heroSection?.ctaLink || "/tools"}
                className="group flex items-center justify-center gap-3 sm:gap-6 px-6 py-4 sm:px-10 sm:py-5 bg-indigo-600 text-white rounded-[24px] shadow-2xl shadow-indigo-200 font-bold hover:bg-slate-900 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-base sm:text-xl"
              >
                {heroSection?.ctaText || 'Start Creating AI Stickers'}
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Preview Section - Grid 2 columns */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 min-h-0 pb-16">
            <div className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center relative overflow-hidden group min-h-[300px]">
              <div className="absolute top-6 left-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Instagram Style</div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-full max-w-sm bg-white p-4 rounded-xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex gap-3 font-instagram"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border border-slate-100 shrink-0 flex items-center justify-center font-bold text-indigo-400">SJ</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[14px]">sarah_jones</span>
                    <CheckCircle2 color="#3b82f6" fill="currentColor" size={14} />
                  </div>
                  <p className="text-[14px] text-slate-800 leading-tight">I need this for my next UGC project! This tool is literally a lifesaver. 🔥🔥🔥</p>
                  <p className="text-[12px] text-slate-400">Replying to @commentify</p>
                </div>
              </motion.div>
            </div>

            <div className="bg-slate-900 rounded-[32px] p-10 border border-slate-800 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group min-h-[300px]">
              <div className="absolute top-6 left-8 text-[10px] font-bold text-slate-600 uppercase tracking-widest">TikTok Style</div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-full max-w-sm bg-[#121212] p-4 rounded-xl border border-white/5 shadow-2xl flex gap-3 text-white font-tiktok"
              >
                <div className="w-9 h-9 rounded-full bg-slate-700 shrink-0 border border-white/10 flex items-center justify-center font-bold text-white text-sm">MT</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-[13px]">mike.tok.creator</span>
                    <Heart size={16} fill="#71717a" className="text-zinc-500" />
                  </div>
                  <p className="text-[13px] text-white/90 font-medium leading-snug">Finally a way to make high-res stickers for my TikTok ads! This is gold. 🚀</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-[11px] font-bold text-white/40">12.4k likes</span>
                    <span className="text-[11px] font-bold text-white/40 italic">Reply</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Features Section */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-t border-slate-200 shrink-0">
            {(featureSection?.title ? [
               { num: "01", title: featureSection.title, desc: featureSection.subtitle }
            ] : [
              { num: "01", title: "Type", desc: "Write your custom text" },
              { num: "02", title: "Platform", desc: "Choose IG or TikTok" },
              { num: "03", title: "Design", desc: "Pick colors & themes" },
              { num: "04", title: "Export", desc: "Download transparent PNG" }
            ]).map((step, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                  {step.num}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{step.title}</h4>
                  <p className="text-xs text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Dynamic Content Section (from text-cta type) */}
          {ctaSection && (
            <section className="mt-24 bg-indigo-900 rounded-[40px] p-8 sm:p-16 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-bold uppercase tracking-widest border border-white/10">
                    <Sparkles size={16} className="text-yellow-400" />
                    Featured
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-bold tracking-tight">{ctaSection.title}</h3>
                  <p className="text-lg text-indigo-100 font-light leading-relaxed max-w-xl">
                    {ctaSection.subtitle}
                  </p>
                  {ctaSection.ctaText && (
                    <div className="pt-4">
                      <Link 
                        to={ctaSection.ctaLink || "#"} 
                        className="inline-flex items-center justify-center gap-2 bg-white text-indigo-900 px-6 py-3 sm:px-8 sm:py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base"
                      >
                        {ctaSection.ctaText}
                        <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                      </Link>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 shadow-2xl transform rotate-2">
                    <img 
                      src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800" 
                      alt="Creative tool" 
                      className="rounded-2xl opacity-80"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {!ctaSection && (
            <section className="mt-24 bg-indigo-900 rounded-[40px] p-8 sm:p-16 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-bold uppercase tracking-widest border border-white/10">
                    <Zap size={16} className="text-yellow-400" />
                    New Feature
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-bold tracking-tight">Text Box Generator</h3>
                  <p className="text-lg text-indigo-100 font-light leading-relaxed max-w-xl">
                    Generate stunning text boxes for TikTok, Instagram Reels, and YouTube Shorts in seconds. 
                    Save time by creating once and sharing across platforms without tedious platform-specific editing. 
                  </p>
                  <div className="pt-4">
                    <Link 
                      to="/text-box" 
                      className="inline-flex items-center justify-center gap-2 bg-white text-indigo-900 px-6 py-3 sm:px-8 sm:py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base"
                    >
                      Start Creating Boxes
                      <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 shadow-2xl transform rotate-2">
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="bg-white p-6 rounded-2xl shadow-2xl text-black font-extrabold text-2xl uppercase tracking-tighter transform -rotate-3">
                        Your Stunning <br/> Text Box here
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-5xl mb-8 tracking-tight">
            Ready to enhance your content?
          </h2>
          <Link
            to="/tools"
            className="inline-flex items-center gap-3 sm:gap-4 rounded-2xl bg-indigo-600 px-6 py-4 sm:px-10 sm:py-5 text-base sm:text-xl font-bold text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
          >
            Start Creating Now
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
