import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Home, 
  Info, 
  Mail, 
  Shield, 
  FileCheck, 
  Save, 
  RefreshCcw,
  Plus,
  Layout,
  Image as ImageIcon,
  Type,
  Link as LinkIcon,
  Trash2,
  Box,
  MousePointer2,
  FilePlus
} from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

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
  updatedAt?: any;
}

const SECTION_TEMPLATES: Record<string, Partial<PageSection>> = {
  features: {
    type: 'features',
    title: 'Engineered for Performance',
    subtitle: 'Our sub-systems are built to deliver maximum impact with minimum friction.',
    items: [
      { title: 'Feature One', description: 'Detailed description here.' },
      { title: 'Feature Two', description: 'Detailed description here.' }
    ]
  },
  'rich-text': {
    type: 'rich-text',
    title: 'Supporting Narrative',
    content: 'Write your long-form content here. High precision communication protocol.'
  },
  cta: {
    type: 'cta',
    title: 'Ready to Scale?',
    subtitle: 'Join 500+ creators and agencies today.',
    ctaText: 'Get Started',
    ctaLink: '/signup'
  }
};

export default function ContentManager() {
  const [pages, setPages] = useState<{id: string, label: string}[]>([]);
  const [activePage, setActivePage] = useState('landing');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<PageData | null>(null);

  useEffect(() => {
    fetchPagesList();
  }, []);

  useEffect(() => {
    fetchPageData();
  }, [activePage]);

  const fetchPagesList = async () => {
    try {
      const snap = await getDocs(collection(db, 'pages'));
      const list = snap.docs.map(doc => ({ id: doc.id, label: (doc.data() as PageData).label || doc.id }));
      
      if (!list.find(p => p.id === 'landing')) {
        list.unshift({ id: 'landing', label: 'Landing Page' });
      }
      setPages(list);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'pages', activePage);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as PageData;
        setPageData({
          ...data,
          sections: data.sections || []
        });
      } else {
        const defaults: Record<string, PageData> = {
          landing: {
            label: 'Landing Page',
            hero: {
              title: 'Elevate Your Social Presence with Smart AI-Crafted Comments',
              subtitle: 'Boost engagement effortlessly across TikTok, Instagram, and More.',
              ctaText: 'Explore AI Tools',
              ctaLink: '/tools',
              badge: 'Smart Comments Tool'
            },
            sections: []
          }
        };
        setPageData(defaults[activePage] || { 
          label: activePage.charAt(0).toUpperCase() + activePage.slice(1),
          hero: { title: 'Default Title', subtitle: 'Default Subtitle', ctaText: 'Learn More', ctaLink: '/', badge: 'New Feature' },
          sections: []
        });
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to fetch page data');
    } finally {
      setLoading(false);
    }
  };

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPageLabel, setNewPageLabel] = useState('');

  const handleCreatePage = async () => {
    if (!newPageLabel) return;
    const label = newPageLabel;
    const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    if (pages.find(p => p.id === id)) {
      toast.error('A page with this ID already exists');
      return;
    }

    const newPage: PageData = {
      label,
      hero: {
        title: `Welcome to ${label}`,
        subtitle: 'Experience the next generation of creative tools and asset generation.',
        ctaText: 'Get Started',
        ctaLink: '/signup',
        badge: 'New Section'
      },
      sections: []
    };

    try {
      await setDoc(doc(db, 'pages', id), newPage);
      setPages([...pages, { id, label }]);
      setActivePage(id);
      setShowCreateModal(false);
      setNewPageLabel('');
      toast.success(
        <div>
          <p className="font-bold">Page Protocol Initialized</p>
          <p className="text-[10px] opacity-70">Note: You must manually add this path (/{id}) to the Navigation Registry.</p>
        </div>,
        { duration: 6000 }
      );
    } catch (e) {
      toast.error('Failed to create page');
    }
  };

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDeletePage = async (id: string) => {
    if (id === 'landing') {
      toast.error('System pages cannot be purged');
      return;
    }

    try {
      await deleteDoc(doc(db, 'pages', id));
      setPages(pages.filter(p => p.id !== id));
      if (activePage === id) setActivePage('landing');
      setDeleteConfirm(null);
      toast.success('Page purged from system');
    } catch (e) {
      toast.error('Purge operation failed');
    }
  };

  const handleAppendSection = (type: string) => {
    if (!pageData) return;
    const template = SECTION_TEMPLATES[type] || { type: type as any, title: 'New Section' };
    const newSection: PageSection = {
      id: Math.random().toString(36).substr(2, 9),
      ...template
    } as PageSection;

    setPageData({
      ...pageData,
      sections: [...pageData.sections, newSection]
    });
    toast.success(`${type.toUpperCase()} module appended`);
  };

  const removeSection = (id: string) => {
    if (!pageData) return;
    setPageData({
      ...pageData,
      sections: pageData.sections.filter(s => s.id !== id)
    });
  };

  const updateSection = (id: string, updates: Partial<PageSection>) => {
    if (!pageData) return;
    setPageData({
      ...pageData,
      sections: pageData.sections.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const handleFeatureItemImage = (sectionId: string, itemIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && pageData) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const section = pageData.sections.find(s => s.id === sectionId);
        if (section && section.items) {
          const newItems = [...section.items];
          newItems[itemIndex] = { ...newItems[itemIndex], image: result };
          updateSection(sectionId, { items: newItems });
        }
        toast.success('Feature icon updated');
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageUpload = (id: string | 'hero', isSection: boolean, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && pageData) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (isSection && id !== 'hero') {
          updateSection(id, { imageUrl: result });
        } else if (id === 'hero') {
          setPageData({ ...pageData, hero: { ...pageData.hero, imageUrl: result } });
        }
        toast.success('Image uploaded locally');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!pageData) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'pages', activePage), {
        ...pageData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      toast.success('Content synchronized across registry');
    } catch (e) {
      toast.error('Sync failed');
    } finally {
      setSaving(false);
    }
  };

  const getPageIcon = (id: string) => {
    switch(id) {
      case 'landing': return Home;
      case 'about': return Info;
      case 'contact': return Mail;
      case 'privacy': return Shield;
      case 'terms': return FileCheck;
      default: return FileText;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-20">
      {/* Sidebar Pages List */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Managed Registry</h3>
           <div className="space-y-2">
             {pages.map(page => (
               <div key={page.id} className="relative group">
                 {deleteConfirm === page.id ? (
                   <div className="flex items-center gap-2 p-2 bg-red-50 rounded-2xl animate-in slide-in-from-right-4 duration-300">
                      <p className="flex-1 text-[10px] font-black text-red-600 uppercase tracking-widest pl-2">Delete?</p>
                      <button 
                        onClick={() => handleDeletePage(page.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase"
                      >
                        Yes
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-2 bg-white text-slate-400 rounded-xl text-[10px] font-black uppercase border border-slate-100"
                      >
                        No
                      </button>
                   </div>
                 ) : (
                   <>
                     <button
                       onClick={() => setActivePage(page.id)}
                       className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all ${
                         activePage === page.id 
                           ? 'bg-slate-900 text-white shadow-xl' 
                           : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                       }`}
                     >
                       {React.createElement(getPageIcon(page.id), { size: 18 })}
                       <span className="truncate pr-8">{page.label}</span>
                     </button>
                     {page.id !== 'landing' && (
                       <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(page.id);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"
                       >
                         <Trash2 size={14} />
                       </button>
                     )}
                   </>
                 )}
               </div>
             ))}
           </div>
        </div>

        {showCreateModal ? (
          <div className="bg-white p-8 rounded-[32px] border border-indigo-200 shadow-xl shadow-indigo-100 animate-in fade-in zoom-in duration-300">
             <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">Initialize Page</h4>
             <input 
               autoFocus
               value={newPageLabel}
               onChange={(e) => setNewPageLabel(e.target.value)}
               placeholder="Page Name (e.g. Services)"
               className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl mb-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
               onKeyDown={(e) => e.key === 'Enter' && handleCreatePage()}
             />
             <div className="flex gap-2">
                <button 
                  onClick={handleCreatePage}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
                >
                  Create
                </button>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-3 bg-slate-100 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
             </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full text-left p-8 bg-indigo-600 rounded-[32px] text-white overflow-hidden relative group hover:scale-[1.02] transition-all active:scale-95"
          >
             <div className="relative z-10">
                <Plus className="mb-4" size={32} />
                <h4 className="text-lg font-black tracking-tight mb-2 uppercase tracking-widest">Create Custom Page</h4>
                <p className="text-white/70 text-xs font-medium leading-relaxed">Expand your website by adding landing pages for specific campaigns.</p>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
          </button>
        )}
      </div>

      {/* Editor Area */}
      <div className="lg:col-span-3 space-y-8">
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-10 pb-8 border-b border-slate-50">
             <div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Editor: {pages.find(p => p.id === activePage)?.label}</h3>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live updates across all devices</p>
             </div>
             <div className="flex items-center gap-3">
               <button 
                 onClick={fetchPageData}
                 disabled={loading}
                 className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
               >
                 <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
               </button>
               <button
                 onClick={handleSave}
                 disabled={saving || loading}
                 className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
               >
                 <Save size={18} />
                 {saving ? 'Saving...' : 'Sync Registry'}
               </button>
             </div>
           </div>

           {loading ? (
             <div className="py-20 text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 mx-auto mb-4"></div>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Fetching content schema...</p>
             </div>
           ) : pageData && (
             <div className="space-y-16">
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Internal Reference Label</label>
                  <input 
                    value={pageData.label}
                    onChange={(e) => setPageData({...pageData, label: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black tracking-tight text-indigo-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                  />
               </div>

               {/* Hero Section Module */}
               <section className="space-y-8 bg-slate-50/50 p-8 rounded-[32px] border border-slate-100">
                  <div className="flex items-center gap-3 py-2">
                     <Layout className="text-indigo-600" size={20} />
                     <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Hero Master Module</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
                           <Type size={12} /> Badge Label
                        </label>
                        <input 
                          value={pageData.hero.badge}
                          onChange={(e) => setPageData({...pageData, hero: {...pageData.hero, badge: e.target.value}})}
                          className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold tracking-tight focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
                           <ImageIcon size={12} /> Visual Resource
                        </label>
                        <div className="flex items-center gap-3">
                           <input 
                             placeholder="https://..."
                             value={pageData.hero.imageUrl || ''}
                             onChange={(e) => setPageData({...pageData, hero: {...pageData.hero, imageUrl: e.target.value}})}
                             className="flex-1 px-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold tracking-tight focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-xs" 
                           />
                           <label className="flex items-center justify-center w-14 h-14 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all shadow-sm shrink-0">
                               <Plus size={20} className="text-slate-400" />
                               <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('hero', false, e)} />
                           </label>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
                           <Type size={12} /> Heading Payload
                        </label>
                        <textarea 
                          rows={2}
                          value={pageData.hero.title}
                          onChange={(e) => setPageData({...pageData, hero: {...pageData.hero, title: e.target.value}})}
                          className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-black text-xl tracking-tight focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
                           <Type size={12} /> Supporting Subtext
                        </label>
                        <textarea 
                          rows={4}
                          value={pageData.hero.subtitle}
                          onChange={(e) => setPageData({...pageData, hero: {...pageData.hero, subtitle: e.target.value}})}
                          className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-medium text-slate-600 leading-relaxed focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
                           <MousePointer2 size={12} /> CTA Label
                        </label>
                        <input 
                          value={pageData.hero.ctaText}
                          onChange={(e) => setPageData({...pageData, hero: {...pageData.hero, ctaText: e.target.value}})}
                          className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold tracking-tight focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1.5">
                           <LinkIcon size={12} /> Destination Path
                        </label>
                        <input 
                          value={pageData.hero.ctaLink}
                          onChange={(e) => setPageData({...pageData, hero: {...pageData.hero, ctaLink: e.target.value}})}
                          className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold tracking-tight focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-indigo-600" 
                        />
                     </div>
                  </div>
               </section>

               {/* Dynamic Sections */}
               <div className="space-y-12">
                 <AnimatePresence>
                   {pageData.sections.map((section) => (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={section.id} 
                        className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative group"
                     >
                       <div className="absolute -top-4 right-8 flex items-center gap-2">
                          <button 
                            onClick={() => removeSection(section.id)}
                            className="p-3 bg-red-50 text-red-500 rounded-full border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>

                       <div className="flex items-center gap-3 mb-8">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            section.type === 'features' ? 'bg-orange-50 text-orange-600' :
                            section.type === 'cta' ? 'bg-indigo-50 text-indigo-600' :
                            'bg-slate-50 text-slate-600'
                          )}>
                             <Box size={20} />
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Module Structure</span>
                            <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none">{section.type.toUpperCase()} Section</h4>
                          </div>
                       </div>

                       <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Heading</label>
                             <input 
                               value={section.title || ''}
                               onChange={(e) => updateSection(section.id, { title: e.target.value })}
                               className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                             />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subtitle/Meta</label>
                             <input 
                               value={section.subtitle || ''}
                               onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
                               className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium outline-none focus:ring-1 focus:ring-indigo-500"
                             />
                           </div>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                              <ImageIcon size={12} /> Module Visual Resource
                            </label>
                            <div className="flex items-center gap-3">
                               <input 
                                 value={section.imageUrl || ''}
                                 onChange={(e) => updateSection(section.id, { imageUrl: e.target.value })}
                                 className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                                 placeholder="Image URL or upload"
                               />
                               <label className="flex items-center justify-center w-12 h-12 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all shadow-sm shrink-0">
                                   <Plus size={16} className="text-slate-400" />
                                   <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(section.id, true, e)} />
                               </label>
                            </div>
                         </div>
                         
                         {section.type === 'features' && (
                            <div className="space-y-4">
                               <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Feature Items</label>
                                  <button 
                                    onClick={() => {
                                      const newItems = [...(section.items || []), { title: 'New Feature', description: 'Description' }];
                                      updateSection(section.id, { items: newItems });
                                    }}
                                    className="p-1 px-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black uppercase text-indigo-600 hover:bg-slate-100"
                                  >
                                    Add Item
                                  </button>
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {section.items?.map((item, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative group/item">
                                       <button 
                                         onClick={() => {
                                           const newItems = section.items!.filter((_, i) => i !== idx);
                                           updateSection(section.id, { items: newItems });
                                         }}
                                         className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all shadow-sm z-10"
                                       >
                                         <Trash2 size={10} />
                                       </button>
                                       <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl relative group/img overflow-hidden flex items-center justify-center shrink-0">
                                             {item.image ? (
                                               <img src={item.image} className="w-full h-full object-cover" />
                                             ) : (
                                               <ImageIcon size={16} className="text-slate-200" />
                                             )}
                                             <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                                                <Plus size={14} className="text-white" />
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFeatureItemImage(section.id, idx, e)} />
                                             </label>
                                          </div>
                                          <input 
                                            value={item.title} 
                                            onChange={(e) => {
                                              const newItems = [...section.items!];
                                              newItems[idx] = { ...item, title: e.target.value };
                                              updateSection(section.id, { items: newItems });
                                            }}
                                            className="w-full bg-transparent font-bold text-xs outline-none focus:text-indigo-600"
                                            placeholder="Feature Title"
                                          />
                                       </div>
                                       <textarea 
                                         value={item.description}
                                         onChange={(e) => {
                                           const newItems = [...section.items!];
                                           newItems[idx] = { ...item, description: e.target.value };
                                           updateSection(section.id, { items: newItems });
                                         }}
                                         className="w-full bg-transparent text-[10px] font-medium text-slate-500 leading-relaxed resize-none outline-none focus:text-slate-900"
                                         rows={2}
                                         placeholder="Feature description payload..."
                                       />
                                    </div>
                                  ))}
                               </div>
                            </div>
                          )}

                         {section.type === 'rich-text' && (
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rich Content Body</label>
                              <textarea 
                                rows={6}
                                value={section.content || ''}
                                onChange={(e) => updateSection(section.id, { content: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium leading-relaxed outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                           </div>
                         )}

                         {(section.type === 'cta' || section.type === 'hero') && (
                            <div className="grid grid-cols-2 gap-4 pt-2">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Button Text</label>
                                <input 
                                  value={section.ctaText || ''}
                                  onChange={(e) => updateSection(section.id, { ctaText: e.target.value })}
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Link</label>
                                <input 
                                  value={section.ctaLink || ''}
                                  onChange={(e) => updateSection(section.id, { ctaLink: e.target.value })}
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-indigo-600"
                                />
                              </div>
                            </div>
                         )}
                       </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>

                 {/* Append Module Trigger */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['features', 'cta', 'rich-text'].map(type => (
                      <button 
                        key={type}
                        onClick={() => handleAppendSection(type)}
                        className="p-8 border-2 border-dashed border-slate-100 rounded-[32px] text-center group hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                      >
                         <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform group-hover:bg-indigo-100 group-hover:text-indigo-600">
                            <Plus className="text-slate-300 group-hover:text-indigo-600" />
                         </div>
                         <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-900 transition-colors">Append {type.toUpperCase()} Module</h5>
                         <p className="text-slate-300 text-[10px] mt-1 group-hover:text-indigo-500">Insert new content at bottom</p>
                      </button>
                    ))}
                 </div>
               </div>
             </div>
           )}
        </div>

        {/* Live Preview Card */}
        <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
           
           <div className="flex items-center justify-between mb-12 relative z-10">
              <div>
                <h3 className="text-xl font-black italic tracking-tighter uppercase tracking-widest">Protocol Simulation</h3>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Responsive View Engine</p>
              </div>
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-400/30" />
                 <div className="w-3 h-3 rounded-full bg-yellow-400/30" />
                 <div className="w-3 h-3 rounded-full bg-green-400/30" />
              </div>
           </div>

           <div className="text-center py-10 space-y-8 relative z-10">
              <span className="inline-block px-4 py-1.5 bg-indigo-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20">
                {pageData?.hero.badge || 'PRO Protocol'}
              </span>
              <h4 className="text-4xl font-black tracking-tighter leading-none max-w-lg mx-auto">
                {pageData?.hero.title || 'Initializing System...'}
              </h4>
              <p className="text-sm text-white/40 leading-relaxed max-w-sm mx-auto font-medium">
                {pageData?.hero.subtitle || 'Loading simulation data stream...'}
              </p>
              <div className="pt-6">
                 <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-white/10 hover:scale-105 transition-transform">
                   {pageData?.hero.ctaText || 'Execute Path'}
                 </button>
              </div>
           </div>

           {/* Section Count Badge */}
           <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black uppercase tracking-widest">
                    {pageData?.sections.length || 0} Modules
                 </div>
                 <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Schema v2.4.0</div>
              </div>
              <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border border-slate-900 bg-white/10" />)}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
