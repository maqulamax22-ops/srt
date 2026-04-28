import React from 'react';
import { Upload, User, RotateCcw, Download, Sparkles, Sliders } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ControlField {
  label: string;
  type: 'text' | 'textarea' | 'upload' | 'toggle' | 'select' | 'color';
  value: any;
  onChange: (val: any) => void;
  options?: { label: string; value: any; icon?: React.ReactNode }[];
  maxLength?: number;
}

interface ControlsPanelProps {
  fields: ControlField[];
  onReset: () => void;
  onDownload: () => void;
  downloadLabel?: string;
}

export default function ControlsPanel({ fields, onReset, onDownload, downloadLabel = 'Deploy Asset' }: ControlsPanelProps) {
  return (
    <div className="space-y-10 glass rounded-[40px] p-10 border border-white/10 shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
          <Sliders size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">System Controls</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">Configuration Module</p>
        </div>
      </div>

      <div className="space-y-8">
        {fields.map((field, idx) => (
          <div key={idx} className="group">
            <div className="flex justify-between mb-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">{field.label}</label>
              {field.maxLength && <span className="text-[10px] font-bold text-white/20">{field.value.length}/{field.maxLength}</span>}
            </div>
            
            {field.type === 'text' && (
              <input
                type="text"
                maxLength={field.maxLength}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 focus:border-accent/50 focus:ring-accent/20 text-sm text-white placeholder-white/20 transition-all outline-none"
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 focus:border-accent/50 focus:ring-accent/20 text-sm text-white placeholder-white/20 transition-all outline-none resize-none"
              />
            )}

            {field.type === 'upload' && (
              <div className="flex items-center gap-6 p-4 glass rounded-3xl border-white/5">
                <img 
                  src={field.value} 
                  alt="Profile" 
                  referrerPolicy="no-referrer"
                  className="h-16 w-16 rounded-2xl object-cover border border-white/10 shadow-lg" 
                />
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <label className="cursor-pointer flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-xs font-bold hover:bg-white/90 transition-all active:scale-95">
                      <Upload size={14} />
                      Replace
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              field.onChange(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                    </label>
                    <button 
                      onClick={() => field.onChange(`https://picsum.photos/seed/avatar${Math.floor(Math.random() * 1000)}/200/200`)}
                      className="flex items-center gap-2 rounded-xl glass px-4 py-2 text-xs font-bold text-white hover:bg-white/5 transition-all border-white/10 active:scale-95"
                    >
                      <User size={14} />
                      Gen New
                    </button>
                  </div>
                  <p className="text-[10px] font-medium text-white/20 italic">Recommendation: 1:1 Aspect Ratio</p>
                </div>
              </div>
            )}

            {field.type === 'toggle' && field.options && (
              <div className="flex p-1.5 glass rounded-2xl border-white/5 gap-1">
                {field.options.map((opt, optIdx) => (
                  <button 
                    key={optIdx}
                    onClick={() => field.onChange(opt.value)}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                      field.value === opt.value ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white/60 hover:bg-white/5"
                    )}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {field.type === 'color' && (
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-xl border border-white/10 overflow-hidden ring-offset-2 ring-offset-[#030303] ring-1 ring-white/5">
                  <input
                    type="color"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="absolute inset-0 h-full w-full border-none cursor-pointer p-0 bg-transparent scale-150"
                  />
                </div>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="flex-1 rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-3.5 text-xs text-white placeholder-white/20 transition-all outline-none font-mono tracking-widest"
                />
              </div>
            )}

            {field.type === 'select' && field.options && (
              <select
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 focus:border-accent/50 focus:ring-accent/20 text-sm text-white transition-all outline-none appearance-none"
              >
                {field.options.map((opt, optIdx) => (
                  <option key={optIdx} value={opt.value} className="bg-[#030303]">
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
        <button 
          onClick={onDownload}
          className="flex items-center justify-center gap-3 rounded-3xl bg-white px-8 py-5 text-sm font-black text-black hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 hover:scale-[1.02] active:scale-95 uppercase tracking-[0.15em] relative overflow-hidden group"
        >
          <Download size={18} />
          {downloadLabel}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
        </button>
        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-2 rounded-3xl glass px-8 py-4 text-xs font-bold text-white/40 hover:text-white hover:bg-white/5 border-white/5 transition-all text-center uppercase tracking-widest"
        >
          <RotateCcw size={14} />
          System Reset
        </button>
      </div>
    </div>
  );
}
