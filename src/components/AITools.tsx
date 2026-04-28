import { Link } from 'react-router-dom';
import { Type, ArrowRight, Instagram, Music2, Command, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function AITools() {
  const tools = [
    {
      id: 'instagram',
      title: 'Instagram Generator',
      description: 'Create realistic Instagram comment stickers for your videos with alpha transparency.',
      icon: <Instagram size={32} />,
      path: '/instagram',
      color: 'from-pink-500/20 to-purple-500/20',
      border: 'border-pink-500/10'
    },
    {
      id: 'instagram-question',
      title: 'Question Sticker',
      description: 'High-fidelity "Ask me a question" stickers. Pixel perfect and high resolution.',
      icon: <Sparkles size={32} />,
      path: '/instagram-question',
      color: 'from-orange-500/20 to-red-500/20',
      border: 'border-orange-500/10'
    },
    {
      id: 'tiktok',
      title: 'TikTok Generator',
      description: 'Authentic TikTok style comments with system fonts and dark/light modes.',
      icon: <Music2 size={32} />,
      path: '/tiktok',
      color: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/10'
    },
    {
      id: 'text-box',
      title: 'Text Box Generator',
      description: 'Stunning text box styles for Reels, Shorts, and TikTok hooks. Clean typography.',
      icon: <Type size={32} />,
      path: '/text-box',
      color: 'from-indigo-500/20 to-blue-500/20',
      border: 'border-indigo-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] pt-32 pb-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-white/5 shadow-glow">
            <Command size={14} className="text-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Developer Suite</span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[0.95] text-balance">
            Tools Crafted for <br/>
            <span className="text-gradient">Professional Creators</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/40 font-medium max-w-2xl text-balance">
            Deploy industrial-grade social assets in seconds. Our generators use high-fidelity layouts based on the latest platform UI updates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
            >
              <Link
                to={tool.path}
                className={cn(
                  "group relative block h-[400px] rounded-[48px] glass border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden p-12 flex flex-col justify-between",
                )}
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-1000",
                  tool.color
                )} />
                
                <div className="relative z-10 space-y-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                    {tool.icon}
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-display text-4xl font-bold tracking-tight text-white">{tool.title}</h3>
                    <p className="text-white/40 text-lg font-medium leading-relaxed max-w-sm">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 flex items-center gap-2 font-bold text-white group-hover:gap-4 transition-all duration-500">
                  Open Sub-system
                  <ArrowRight size={20} className="text-accent" />
                </div>
                
                {/* Decoration */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-[60px] group-hover:bg-accent/10 transition-colors duration-1000" />
              </Link>
            </motion.div>
          ))}

          {/* Coming Soon Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: tools.length * 0.1, duration: 0.8, ease: "easeOut" }}
            className="group h-[400px] rounded-[48px] glass border border-dashed border-white/10 p-12 flex flex-col items-center justify-center text-center opacity-50 hover:opacity-100 transition-all duration-500"
          >
            <div className="w-16 h-16 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/20 mb-8">
               <ArrowRight size={24} />
            </div>
            <h4 className="text-2xl font-bold tracking-tight mb-2">More systems pending</h4>
            <p className="text-white/30 font-medium">Next-gen video generation in development.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
