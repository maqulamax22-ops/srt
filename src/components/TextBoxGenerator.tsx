import React, { useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';
import { useDownload } from '../hooks/useDownload';
import ControlsPanel from './ui/ControlsPanel';
import StickerFrame from './ui/StickerFrame';
import { cn } from '../lib/utils';

export default function TextBoxGenerator() {
  const [text, setText] = useState('HELLO HOW CAN\nHELP YOU,');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('font-inter');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [bgImage, setBgImage] = useState('https://picsum.photos/seed/nature1/1200/800');
  const [showBg, setShowBg] = useState(true);

  const { downloadRef, download } = useDownload();

  const reset = () => {
    setText('HELLO HOW CAN\nHELP YOU,');
    setBgColor('#ffffff');
    setTextColor('#000000');
    setFontFamily('font-sans');
    setTextAlign('center');
    setShowBg(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          <span className="text-insta-gradient">Text Box</span> Generator
        </h1>
        <p className="mt-2 text-slate-600 font-light">Generate stunning text boxes for TikTok, Reels, and Shorts.</p>
      </div>



      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
        <div className="lg:col-span-5">
          <ControlsPanel 
            onReset={reset}
            onDownload={() => download('text-box')}
            fields={[
              { label: 'Content', type: 'textarea', value: text, onChange: setText },
              { label: 'Background Color', type: 'color', value: bgColor, onChange: setBgColor },
              { label: 'Text Color', type: 'color', value: textColor, onChange: setTextColor },
              { 
                label: 'Font Family', 
                type: 'select', 
                value: fontFamily, 
                onChange: setFontFamily,
                options: [
                  { label: 'Sans Serif (Modern)', value: 'font-inter' },
                  { label: 'Monospace (Technical)', value: 'font-mono' },
                  { label: 'Serif (Classic)', value: 'font-serif' },
                  { label: 'Space Grotesk (Brand)', value: 'font-space' },
                ]
              },
              { 
                label: 'Alignment', 
                type: 'toggle', 
                value: textAlign, 
                onChange: setTextAlign,
                options: [
                  { label: 'Left', value: 'left', icon: <AlignLeft size={16} /> },
                  { label: 'Center', value: 'center', icon: <AlignCenter size={16} /> },
                  { label: 'Right', value: 'right', icon: <AlignRight size={16} /> },
                ]
              },
              {
                label: 'Preview Background',
                type: 'toggle',
                value: showBg,
                onChange: setShowBg,
                options: [
                  { label: 'Hide', value: false },
                  { label: 'Show', value: true }
                ]
              },
              { label: 'Change Background Image', type: 'upload', value: bgImage, onChange: setBgImage }
            ]}
          />
        </div>

        <div className="lg:col-span-7 sticky top-24">
          <div className="mb-6 flex items-center justify-between">
             <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               Live Preview
             </span>
             <div className="flex gap-2">
                <Type size={16} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cross-Platform Ready</span>
             </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[32px] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
            
            <div 
              className={cn(
                "relative flex items-center justify-center min-h-[400px] rounded-[32px] border border-slate-200/60 overflow-hidden transition-all duration-500",
                showBg ? "" : "bg-slate-100/50"
              )}
            >
              {showBg && (
                <img 
                  src={bgImage} 
                  alt="Background" 
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
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
                      "p-6 rounded-2xl shadow-2xl backdrop-blur-sm max-w-full inline-block whitespace-pre-wrap",
                      fontFamily
                    )}
                    style={{ 
                      backgroundColor: bgColor,
                      color: textColor,
                      textAlign: textAlign,
                      fontSize: '24px',
                      fontWeight: 800,
                      lineHeight: '1.2'
                    }}

                  >
                    {text}
                  </div>
                </StickerFrame>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
             <h4 className="font-bold text-blue-900 text-sm mb-2 uppercase tracking-wide">Stunning Text Boxes</h4>
             <p className="text-blue-700 text-sm leading-relaxed">
               Perfect for captions, hooks, and call-to-actions. These styles match the native look of popular social platforms to boost your engagement.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
