import React, { useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight, Type, Command, Sparkles, ShieldCheck } from 'lucide-react';
import { useDownload } from '../hooks/useDownload';
import { useAnalytics } from '../lib/analytics';
import ControlsPanel from './ui/ControlsPanel';
import StickerFrame from './ui/StickerFrame';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function TextBoxGenerator() {
  const [text, setText] = useState('HELLO HOW CAN\nHELP YOU,');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('font-inter');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [bgImage, setBgImage] = useState('https://picsum.photos/seed/nature1/1200/800');
  const [showBg, setShowBg] = useState(true);

  const { trackEvent } = useAnalytics();
  const { downloadRef, download } = useDownload();

  const handleDownload = async () => {
    trackEvent('conversion', { tool: 'text-box', action: 'download' });
    download('text-box');
  };

  const reset = () => {
    setText('HELLO HOW CAN\nHELP YOU,');
    setBgColor('#ffffff');
    setTextColor('#000000');
    setFontFamily('font-sans');
    setTextAlign('center');
    setShowBg(true);
  };

  return (
    <div className="bg-[#030303] min-h-screen pt-32 pb-24 px-6 sm:px-10 overflow-hidden text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <Type size={14} className="text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Asset Sub-system 04</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              Text Box <br/>
              <span className="text-gradient">Design Studio</span>
            </h1>
            <p className="text-lg text-white/40 font-medium max-w-xl">
              High-impact text box generation for Hooks and CTAs. Dynamic font scaling and precision alignment protocols.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
             <div className="px-4 py-2 bg-white text-black rounded-xl text-xs font-bold">Standard Layout</div>
             <div className="px-4 py-2 text-white/40 text-xs font-bold hover:text-white/60 transition-colors cursor-pointer text-nowrap">Express (Coming)</div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5"
          >
            <ControlsPanel 
              onReset={reset}
              onDownload={handleDownload}
              fields={[
                { label: 'Content Payload', type: 'textarea', value: text, onChange: setText },
                { label: 'Surface Color', type: 'color', value: bgColor, onChange: setBgColor },
                { label: 'Text Foreground', type: 'color', value: textColor, onChange: setTextColor },
                { 
                  label: 'Typography Stack', 
                  type: 'select', 
                  value: fontFamily, 
                  onChange: setFontFamily,
                  options: [
                    { label: 'Sans Serif (Inter)', value: 'font-inter' },
                    { label: 'Monospace (JetBrains)', value: 'font-mono' },
                    { label: 'Serif (Classic)', value: 'font-serif' },
                    { label: 'Space Grotesk (Display)', value: 'font-space' },
                  ]
                },
                { 
                  label: 'Text Alignment', 
                  type: 'toggle', 
                  value: textAlign, 
                  onChange: setTextAlign,
                  options: [
                    { label: 'LT', value: 'left', icon: <AlignLeft size={14} /> },
                    { label: 'CT', value: 'center', icon: <AlignCenter size={14} /> },
                    { label: 'RT', value: 'right', icon: <AlignRight size={14} /> },
                  ]
                },
                {
                  label: 'Context Simulation',
                  type: 'toggle',
                  value: showBg,
                  onChange: setShowBg,
                  options: [
                    { label: 'Transparent', value: false },
                    { label: 'Realistic', value: true }
                  ]
                },
                { label: 'Simulation Resource', type: 'upload', value: bgImage, onChange: setBgImage }
              ]}
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 lg:sticky lg:top-32"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Visual Context Simulator</span>
              </div>
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={12} />
                SECURE ASSET
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[48px] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-1000" />
              
              <div 
                className={cn(
                  "relative flex items-center justify-center min-h-[500px] rounded-[48px] border border-white/5 overflow-hidden transition-all duration-500",
                  showBg ? "" : "glass bg-dot-pattern"
                )}
              >
                {showBg && (
                  <img 
                    src={bgImage} 
                    alt="Background" 
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
                  />
                )}
                
                <div className="relative z-10 w-full flex justify-center p-12">
                  <StickerFrame
                    innerRef={downloadRef}
                    theme="light"
                    platform="instagram"
                  >
                    <div 
                      className={cn(
                        "p-8 rounded-3xl shadow-2xl backdrop-blur-md max-w-full inline-block whitespace-pre-wrap transition-all duration-500 hover:scale-105",
                        fontFamily
                      )}
                      style={{ 
                        backgroundColor: bgColor,
                        color: textColor,
                        textAlign: textAlign,
                        fontSize: '28px',
                        fontWeight: 900,
                        lineHeight: '1.1',
                        letterSpacing: '-0.05em'
                      }}
                    >
                      {text}
                    </div>
                  </StickerFrame>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-6">
               <div className="flex-1 glass rounded-3xl p-6 border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Asset Specification</span>
                  </div>
                  <p className="text-xs text-white/30 leading-relaxed font-medium">
                    Perfect for captions, hooks, and call-to-actions. These styles match the native look of popular social platforms.
                  </p>
               </div>
               <div className="flex-1 glass rounded-3xl p-6 border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Command size={14} className="text-white/60" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Creative Protocol</span>
                  </div>
                  <p className="text-xs text-white/30 leading-relaxed font-medium">
                    Supports multiline text and dynamic scaling. Exports with alpha transparency for multi-layer video composition.
                  </p>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
