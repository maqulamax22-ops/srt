import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

export interface SiteConfig {
  logoText: string;
  footerText: string;
  instagramLink: string;
  navigation: { label: string; path: string }[];
}

export interface PageSection {
  id: string;
  type: 'hero' | 'features' | 'faq' | 'cta' | 'gallery' | 'rich-text' | 'preview' | 'text-cta';
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  content?: string;
  imageUrl?: string;
  image?: string;
  items?: { title: string; description: string }[];
}

export interface PageData {
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

export function useCMS() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [pages, setPages] = useState<Record<string, PageData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const docRef = doc(db, 'configs', 'site');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setConfig(docSnap.data() as SiteConfig);
        } else {
          const defaultConfig: SiteConfig = {
            logoText: 'Commentify',
            footerText: '© 2026 Commentify Labs. All rights reserved.',
            instagramLink: 'http://instagram.com/dilovan.abdo',
            navigation: [
              { label: 'AI Tools', path: '/tools' },
              { label: 'Community', path: '/community' },
              { label: 'About Us', path: '/about' },
              { label: 'Contact', path: '/contact' },
              { label: 'Donate', path: '/donate' },
            ]
          };
          setConfig(defaultConfig);
        }

        // Load All Managed Pages
        const pagesSnap = await getDocs(collection(db, 'pages'));
        const pagesMap: Record<string, PageData> = {};
        
        pagesSnap.docs.forEach(doc => {
          pagesMap[doc.id] = doc.data() as PageData;
        });

        // Set defaults if landing missing
        if (!pagesMap.landing) {
          pagesMap.landing = {
            hero: {
              title: 'Elevate Your Social Presence with Smart AI-Crafted Comments',
              subtitle: 'Boost engagement effortlessly across TikTok, Instagram, and More. Our AI-powered generator helps you create perfectly tailored comments and text boxes that captivate your audience.',
              ctaText: 'Explore AI Tools',
              ctaLink: '/tools',
              badge: 'Smart Comments Tool'
            },
            sections: []
          };
        }

        setPages(pagesMap);

      } catch (error) {
        console.error("Error loading CMS content:", error);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const saveConfig = async (newConfig: SiteConfig) => {
    try {
      await setDoc(doc(db, 'configs', 'site'), newConfig);
      setConfig(newConfig);
      return true;
    } catch (error) {
      return false;
    }
  };

  const savePage = async (pageId: string, pageData: PageData) => {
    try {
      await setDoc(doc(db, 'pages', pageId), pageData);
      setPages(prev => ({ ...prev, [pageId]: pageData }));
      return true;
    } catch (error) {
      return false;
    }
  };

  return { config, pages, loading, saveConfig, savePage };
}
