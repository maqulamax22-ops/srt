import React, { useState } from 'react';
import { useDownload } from '../hooks/useDownload';
import { useAnalytics } from '../lib/analytics';
import ControlsPanel from './ui/ControlsPanel';
import StickerFrame from './ui/StickerFrame';
import QuestionSticker from './ui/QuestionSticker';
import { Sparkles, Command, Instagram, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function QuestionGenerator() {
  const [question, setQuestion] = useState('Ask me a question');
  const [placeholder, setPlaceholder] = useState('Hello can i start video editing from scratch in 2026?');
  const [headerColor, setHeaderColor] = useState('#262626');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const { trackEvent } = useAnalytics();
  const { downloadRef, download } = useDownload();

  const handleDownload = async () => {
    trackEvent('conversion', { tool: 'question', action: 'download' });
    download('instagram-question');
  };

  const reset = () => {
    setQuestion('Ask me a question');
    setPlaceholder('Hello can i start video editing from scratch in 2026?');
    setHeaderColor('#262626');
    setTextColor('#FFFFFF');
    setTheme('light');
  };

  return (
    <div className="bg-[#030303] min-h-screen pt-32 pb-24 px-6 sm:px-10 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
              <Sparkles size={14} className="text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Asset Sub-system 02</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              Question <br/>
              <span className="text-gradient">Sticker Studio</span>
            </h1>
            <p className="text-lg text-white/40 font-medium max-w-xl">
              Professional story engagement assets. High-fidelity layouts optimized for vertical video and story delivery.
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
                { label: 'Label text', type: 'text', value: question, onChange: setQuestion },
                { label: 'Input placeholder', type: 'text', value: placeholder, onChange: setPlaceholder },
                { label: 'Primary Header Color', type: 'color', value: headerColor, onChange: setHeaderColor },
                { label: 'Label Text Color', type: 'color', value: textColor, onChange: setTextColor },
                {
                  label: 'Interface Theme',
                  type: 'toggle',
                  value: theme,
                  onChange: setTheme,
                  options: [
                    { label: 'System Light', value: 'light' },
                    { label: 'System Dark', value: 'dark' }
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
                 <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Story Simulation Engine</span>
              </div>
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={12} />
                SECURE ASSET
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-[48px] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-1000" />
              
              <div className="relative flex items-center justify-center min-h-[500px] glass rounded-[48px] border border-white/5 p-4 sm:p-12 overflow-hidden bg-dot-pattern">
                <StickerFrame
                  innerRef={downloadRef}
                  theme={theme}
                  platform="instagram"
                >
                  <QuestionSticker 
                    question={question}
                    placeholder={placeholder}
                    headerColor={headerColor}
                    textColor={textColor}
                    theme={theme}
                  />
                </StickerFrame>
              </div>
            </div>

            <div className="mt-8 flex gap-6">
               <div className="flex-1 glass rounded-3xl p-6 border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-orange-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Asset Specification</span>
                  </div>
                  <p className="text-xs text-white/30 leading-relaxed font-medium">
                    Optimized for 1080x1920 Story delivery. High-contrast colors ensure visibility over complex video backgrounds.
                  </p>
               </div>
               <div className="flex-1 glass rounded-3xl p-6 border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Command size={14} className="text-white/60" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Creative Protocol</span>
                  </div>
                  <p className="text-xs text-white/30 leading-relaxed font-medium">
                    Layout matches official Instagram v312.0.0.12 components. Standardized rounded corners and margins.
                  </p>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
