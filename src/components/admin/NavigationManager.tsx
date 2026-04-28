import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Save, RefreshCw, Layers, ExternalLink, Layout, Image as ImageIcon, Type, Globe, Sparkles } from 'lucide-react';
import { useSiteConfig, NavLink, FooterSection } from '../../hooks/useSiteConfig';
import { motion, Reorder } from 'motion/react';
import { toast } from 'sonner';

export default function NavigationManager() {
  const { config, updateConfig, loading } = useSiteConfig();
  const [logoText, setLogoText] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [headerLinks, setHeaderLinks] = useState<NavLink[]>([]);
  const [footerSections, setFooterSections] = useState<FooterSection[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setLogoText(config.logoText || 'Commentify');
      setLogoUrl(config.logoUrl || '');
      setFaviconUrl(config.faviconUrl || '');
      setHeaderLinks([...config.headerNavigation]);
      setFooterSections([...config.footerSections]);
    }
  }, [config]);

  const addHeaderLink = () => {
    setHeaderLinks([...headerLinks, { label: 'New Link', path: '/' }]);
  };

  const removeHeaderLink = (index: number) => {
    const newLinks = [...headerLinks];
    newLinks.splice(index, 1);
    setHeaderLinks(newLinks);
  };

  const updateHeaderLink = (index: number, field: keyof NavLink, value: string) => {
    const newLinks = [...headerLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setHeaderLinks(newLinks);
  };

  const addFooterSection = () => {
    setFooterSections([...footerSections, { title: 'New Section', links: [{ label: 'Link', path: '/' }] }]);
  };

  const removeFooterSection = (sectionIndex: number) => {
    const newSections = [...footerSections];
    newSections.splice(sectionIndex, 1);
    setFooterSections(newSections);
  };

  const addFooterLink = (sectionIndex: number) => {
    const newSections = [...footerSections];
    newSections[sectionIndex].links.push({ label: 'New Link', path: '/' });
    setFooterSections(newSections);
  };

  const removeFooterLink = (sectionIndex: number, linkIndex: number) => {
    const newSections = [...footerSections];
    newSections[sectionIndex].links.splice(linkIndex, 1);
    setFooterSections(newSections);
  };

  const updateFooterLink = (sectionIndex: number, linkIndex: number, field: keyof NavLink, value: string) => {
    const newSections = [...footerSections];
    newSections[sectionIndex].links[linkIndex] = { ...newSections[sectionIndex].links[linkIndex], [field]: value };
    setFooterSections(newSections);
  };

  const updateFooterSectionTitle = (sectionIndex: number, value: string) => {
    const newSections = [...footerSections];
    newSections[sectionIndex].title = value;
    setFooterSections(newSections);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
        toast.success('Logo uploaded locally. Click Save to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconUrl(reader.result as string);
        toast.success('Favicon uploaded locally. Click Save to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateConfig({
        logoText,
        logoUrl,
        faviconUrl,
        headerNavigation: headerLinks,
        footerSections: footerSections
      });
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Site Management</h3>
          <p className="text-slate-500 font-medium">Manage branding, header and footer structures</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      {/* Branding Section */}
      <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Globe size={20} />
          </div>
          <h4 className="text-lg font-bold text-slate-900">Branding & Identity</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Type size={12} /> Logo Text
            </label>
            <input 
              value={logoText}
              onChange={(e) => setLogoText(e.target.value)}
              placeholder="e.g. Commentify"
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <ImageIcon size={12} /> Logo Image
            </label>
            <div className="flex items-center gap-3">
               <input 
                 value={logoUrl}
                 onChange={(e) => setLogoUrl(e.target.value)}
                 placeholder="https://.../logo.png"
                 className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-xs" 
               />
               <label className="flex items-center justify-center w-12 h-12 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all shadow-sm">
                  <Plus size={20} className="text-slate-400" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
               </label>
            </div>
            <p className="text-[10px] text-slate-400 font-medium italic">Paste a URL or upload a file</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Sparkles size={12} /> Favicon Image
            </label>
            <div className="flex items-center gap-3">
               <input 
                 value={faviconUrl}
                 onChange={(e) => setFaviconUrl(e.target.value)}
                 placeholder="https://.../favicon.ico"
                 className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-xs" 
               />
               <label className="flex items-center justify-center w-12 h-12 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all shadow-sm">
                  <Plus size={20} className="text-slate-400" />
                  <input type="file" className="hidden" accept="image/x-icon,image/png,image/svg+xml" onChange={handleFaviconUpload} />
               </label>
            </div>
            <p className="text-[10px] text-slate-400 font-medium italic">Paste a URL or upload a file</p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-12">
           <div className="space-y-2 flex-1">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Branding Preview</p>
              <div className="h-16 flex items-center gap-6 p-4 bg-white/50 rounded-2xl border border-slate-200/50">
                 {logoUrl ? (
                   <img src={logoUrl} alt="Preview" className="h-full object-contain" referrerPolicy="no-referrer" />
                 ) : (
                   <div className="h-full px-4 flex items-center bg-white rounded-lg border border-slate-200 font-bold text-slate-400 italic text-xs">No logo</div>
                 )}
                 <span className="text-2xl font-bold text-slate-900 border-l border-slate-200 pl-6">{logoText}</span>
              </div>
           </div>
           <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Favicon</p>
              <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden p-3 shadow-inner">
                 {faviconUrl ? (
                   <img src={faviconUrl} alt="Favicon" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                 ) : (
                   <Globe size={32} className="text-slate-200" />
                 )}
              </div>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* Header Navigation */}
        <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Layout size={20} />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Header Menu</h4>
            </div>
            <button
              onClick={addHeaderLink}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
            >
              <Plus size={14} /> Add Link
            </button>
          </div>

          <Reorder.Group 
            axis="y" 
            values={headerLinks} 
            onReorder={setHeaderLinks}
            className="space-y-4"
          >
            {headerLinks.map((link, index) => (
              <Reorder.Item 
                key={`${link.label}-${index}`}
                value={link}
                className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl group"
              >
                <div className="cursor-grab active:cursor-grabbing text-slate-300">
                  <GripVertical size={20} />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateHeaderLink(index, 'label', e.target.value)}
                    placeholder="Link Label"
                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                  <input
                    type="text"
                    value={link.path}
                    onChange={(e) => updateHeaderLink(index, 'path', e.target.value)}
                    placeholder="Path (/tools)"
                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <button
                  onClick={() => removeHeaderLink(index)}
                  className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {headerLinks.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[32px]">
              <p className="text-slate-400 text-sm italic">No header links configured.</p>
            </div>
          )}
        </section>

        {/* Footer Navigation */}
        <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Layers size={20} />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Footer Sections</h4>
            </div>
            <button
              onClick={addFooterSection}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
            >
              <Plus size={14} /> Add Section
            </button>
          </div>

          <div className="space-y-8">
            {footerSections.map((section, sIndex) => (
              <motion.div 
                key={sIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-slate-50 border border-slate-100 rounded-[32px]"
              >
                <div className="flex items-center gap-4 mb-6">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateFooterSectionTitle(sIndex, e.target.value)}
                    placeholder="Section Title"
                    className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                  <button
                    onClick={() => removeFooterSection(sIndex)}
                    className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  {section.links.map((link, lIndex) => (
                    <div key={lIndex} className="flex items-center gap-4 pl-4 border-l-2 border-slate-200">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => updateFooterLink(sIndex, lIndex, 'label', e.target.value)}
                          placeholder="Label"
                          className="px-4 py-2 bg-white border border-slate-100 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                        <input
                          type="text"
                          value={link.path}
                          onChange={(e) => updateFooterLink(sIndex, lIndex, 'path', e.target.value)}
                          placeholder="Path"
                          className="px-4 py-2 bg-white border border-slate-100 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                      <button
                        onClick={() => removeFooterLink(sIndex, lIndex)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addFooterLink(sIndex)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors pl-4 mt-4"
                  >
                    <Plus size={12} /> Add Link to Section
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {footerSections.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[32px]">
              <p className="text-slate-400 text-sm italic">No footer sections configured.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
