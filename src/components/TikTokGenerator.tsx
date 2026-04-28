import React, { useState } from 'react';
import { useDownload } from '../hooks/useDownload';
import { useAnalytics } from '../lib/analytics';
import CommentPreview from './ui/CommentPreview';
import ControlsPanel from './ui/ControlsPanel';
import StickerFrame from './ui/StickerFrame';
import { Music2, Command, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function TikTokGenerator() {
  const [username, setUsername] = useState('social_maven');
  const [comment, setComment] = useState('Wait, did you really just do that?! 😱 I need one right now!');
  const [profilePic, setProfilePic] = useState('https://picsum.photos/seed/avatar5/200/200');
  const [likes, setLikes] = useState('1,240');
  const [showReply, setShowReply] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const { trackEvent } = useAnalytics();
  const { downloadRef, download } = useDownload();

  const handleDownload = async () => {
    trackEvent('conversion', { tool: 'tiktok', action: 'download' });
    download('tiktok-comment');
  };

  const reset = () => {
    setUsername('social_maven');
    setComment('Wait, did you really just do that?! 😱 I need one right now!');
    setProfilePic('https://picsum.photos/seed/avatar5/200/200');
    setLikes('1,240');
    setShowReply(true);
    setTheme('dark');
  };

  return (
    <div className="bg-[#030303] min-h-screen pt-32 pb-24 px-6 sm:px-10 overflow-hidden text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
              <Music2 size={14} className="text-cyan-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Asset Sub-system 03</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              TikTok <br/>
              <span className="text-gradient">Comment Studio</span>
            </h1>
            <p className="text-lg text-white/40 font-medium max-w-xl">
              Industrial-grade TikTok comment generation. Authentic system typography and precise layout spacing.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
             <div className="px-4 py-2 bg-white text-black rounded-xl text-xs font-bold">Standard Layout</div>
             <div className="px-4 py-2 text-white/40 text-xs font-bold hover:text-white/60 transition-colors cursor-pointer text-nowrap">Retina (Coming)</div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          {/* Controls Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5"
          >
            <ControlsPanel 
              onReset={reset}
              onDownload={handleDownload}
              fields={[
                { label: 'Profile Picture', type: 'upload', value: profilePic, onChange: setProfilePic },
                { 
                  label: 'Handle', 
                  type: 'text', 
                  value: username, 
                  maxLength: 30,
                  onChange: setUsername
                },
                { label: 'Comment Body', type: 'textarea', value: comment, onChange: setComment },
                { label: 'Metric: Likes', type: 'text', value: likes, onChange: setLikes },
                { 
                  label: 'Reply Hint', 
                  type: 'toggle', 
                  value: showReply, 
                  onChange: setShowReply,
                  options: [
                    { label: 'Inactive', value: false },
                    { label: 'Active', value: true }
                  ]
                },
                {
                  label: 'Interface Theme',
                  type: 'toggle',
                  value: theme,
                  onChange: setTheme,
                  options: [
                    { label: 'Light', value: 'light' },
                    { label: 'Dark Mode', value: 'dark' }
                  ]
                }
              ]}
            />
          </motion.div>

          {/* Preview Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 lg:sticky lg:top-32"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Real-time Simulation Engine</span>
              </div>
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={12} />
                SECURE ASSET
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-[48px] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-1000" />
              
              <div className="relative flex items-center justify-center min-h-[500px] glass rounded-[48px] border border-white/5 p-4 sm:p-12 overflow-hidden bg-dot-pattern">
                 <StickerFrame
                  innerRef={downloadRef}
                  theme={theme}
                  platform="tiktok"
                >
                  <CommentPreview 
                    platform="tiktok"
                    username={username}
                    comment={comment}
                    profilePic={profilePic}
                    theme={theme}
                    likes={likes}
                    showReply={showReply}
                  />
                </StickerFrame>
              </div>
            </div>

            <div className="mt-8 flex gap-6">
               <div className="flex-1 glass rounded-3xl p-6 border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-cyan-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Asset Specification</span>
                  </div>
                  <p className="text-xs text-white/30 leading-relaxed font-medium">
                    Optimized for vertical video delivery. Our generator mimics the exact font and spacing used in the official TikTok app.
                  </p>
               </div>
               <div className="flex-1 glass rounded-3xl p-6 border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Command size={14} className="text-white/60" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Creative Protocol</span>
                  </div>
                  <p className="text-xs text-white/30 leading-relaxed font-medium">
                    Platform compliance verified against the latest Q1 2026 TikTok UI updates. Lossless PNG export.
                  </p>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
