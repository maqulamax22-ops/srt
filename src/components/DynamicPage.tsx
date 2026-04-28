import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { ArrowRight, Zap, Star, Layout, Type, MousePointer2 } from 'lucide-react';

interface PageSection {
  id: string;
  type: 'hero' | 'features' | 'faq' | 'cta' | 'gallery' | 'rich-text';
  title?: string;
  subtitle?: string;
  content?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  items?: any[];
}

interface PageData {
  label: string;
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    badge: string;
    imageUrl?: string;
  };
  sections: PageSection[];
}

export default function DynamicPage() {
  const { pageId } = useParams<{ pageId: string }>();
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!pageId) return;
      try {
        const snap = await getDoc(doc(db, 'pages', pageId));
        if (snap.exists()) {
          setData(snap.data() as PageData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [pageId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="w-12 h-12 border-t-2 border-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#030303] text-white p-6 text-center">
        <h1 className="text-6xl font-black mb-4">404</h1>
        <p className="text-xl text-white/60 mb-8 max-w-md">The page protocol you requested does not exist or has been declassified.</p>
        <Link to="/" className="px-8 py-4 bg-white text-black rounded-2xl font-bold hover:scale-105 transition-all">
          Return to Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#030303] min-h-screen selection:bg-accent/30 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center space-y-10"
          >
            <div className="inline-flex items-center px-4 py-1.5 glass rounded-full border border-white/10 shadow-glow shadow-white/5">
              <span className="text-[11px] font-black uppercase tracking-widest text-white/90">
                {data.hero.badge}
              </span>
            </div>

            <h1 className="font-display text-[clamp(2.5rem,10vw,5.5rem)] font-bold tracking-tight text-white leading-[0.95] text-balance">
              {data.hero.title}
            </h1>

            <p className="mx-auto max-w-2xl text-[clamp(1rem,3vw,1.25rem)] text-white/70 font-medium leading-relaxed">
              {data.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 w-full">
              <Link
                to={data.hero.ctaLink}
                className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-white text-black rounded-3xl font-bold hover:scale-105 transition-all duration-500 active:scale-95 w-full sm:w-auto text-lg overflow-hidden"
              >
                {data.hero.ctaText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {data.hero.imageUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-20 w-full max-w-5xl aspect-video rounded-[48px] overflow-hidden border border-white/10 glass p-4"
              >
                <img 
                  src={data.hero.imageUrl} 
                  alt={data.label} 
                  className="w-full h-full object-cover rounded-[32px] opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Dynamic Sections */}
      <div className="pb-32">
        {data.sections?.map((section, index) => (
          <section key={section.id} className="py-24 px-6">
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
                <div className="max-w-3xl mx-auto prose prose-invert">
                  <h2 className="text-4xl font-bold text-white mb-8 tracking-tighter">{section.title}</h2>
                  <div className="text-xl text-white/70 leading-relaxed space-y-6">
                    {section.content?.split('\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              )}

              {section.type === 'cta' && (
                <div className="glass p-16 rounded-[60px] border border-white/10 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                  <h2 className="text-5xl font-black text-white mb-6 tracking-tighter leading-none">{section.title}</h2>
                  <p className="text-xl text-white/60 mb-10 max-w-xl mx-auto">{section.subtitle}</p>
                  <Link
                    to={section.ctaLink || '/signup'}
                    className="inline-flex items-center gap-3 px-12 py-6 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all"
                  >
                    {section.ctaText || 'Get Started'}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
