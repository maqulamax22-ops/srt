import React from 'react';
import { Upload, User, RotateCcw, Download } from 'lucide-react';
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

export default function ControlsPanel({ fields, onReset, onDownload, downloadLabel = 'Download PNG' }: ControlsPanelProps) {
  return (
    <div className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
      <div className="space-y-6">
        {fields.map((field, idx) => (
          <div key={idx}>
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-700">{field.label}</label>
              {field.maxLength && <span className="text-xs text-slate-400">{field.value.length}/{field.maxLength}</span>}
            </div>
            
            {field.type === 'text' && (
              <input
                type="text"
                maxLength={field.maxLength}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full rounded-xl border-slate-200 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-slate-50 transition-all shadow-sm"
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                rows={3}
                className="w-full rounded-xl border-slate-200 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-slate-50 transition-all shadow-sm resize-none"
              />
            )}

            {field.type === 'upload' && (
              <div className="flex items-center gap-4">
                <img 
                  src={field.value} 
                  alt="Profile" 
                  referrerPolicy="no-referrer"
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-100" 
                />
                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors">
                    <Upload size={16} />
                    Upload
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
                    className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <User size={16} />
                    Random
                  </button>
                </div>
              </div>
            )}

            {field.type === 'toggle' && field.options && (
              <div className="flex items-center gap-4">
                {field.options.map((opt, optIdx) => (
                  <button 
                    key={optIdx}
                    onClick={() => field.onChange(opt.value)}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-xl text-sm font-medium border flex items-center justify-center gap-2 transition-all text-center",
                      field.value === opt.value ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    )}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {field.type === 'color' && (
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="h-10 w-10 rounded-lg border-none cursor-pointer overflow-hidden p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full rounded-xl border-slate-200 px-4 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-slate-50 transition-all shadow-sm font-mono"
                />
              </div>
            )}

            {field.type === 'select' && field.options && (
              <select
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full rounded-xl border-slate-200 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-slate-50 transition-all shadow-sm"
              >
                {field.options.map((opt, optIdx) => (
                  <option key={optIdx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-6 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex-1"
        >
          <RotateCcw size={18} />
          Reset
        </button>
        <button 
          onClick={onDownload}
          className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 hover:scale-[1.02] active:scale-95 flex-1"
        >
          <Download size={18} />
          {downloadLabel}
        </button>
      </div>
    </div>
  );
}

