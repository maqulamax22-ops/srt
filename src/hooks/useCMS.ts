import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface SiteConfig {
  logoText: string;
  footerText: string;
  instagramLink: string;
  navigation: { label: string; path: string }[];
}

export interface PageSection {
  id: string;
  type: 'hero' | 'text-cta' | 'features' | 'preview';
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  content?: string;
  image?: string;
}

export interface PageData {
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
            footerText: '© 2026 Commentify Labs. All rights reserved. By Dilovan Abdo',
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

        // Load Landing Page content
        const landingRef = doc(db, 'pages', 'landing');
        const landingSnap = await getDoc(landingRef);
        if (landingSnap.exists()) {
          setPages(prev => ({ ...prev, landing: landingSnap.data() as PageData }));
        } else {
          const defaultLanding: PageData = {
            sections: [
              { id: 'hero', type: 'hero', title: 'Transform Your Content with AI Magic', subtitle: 'Enhance your social media presence with professional, customizable comment overlays and text boxes.', ctaText: 'Explore Tools', ctaLink: '/tools' }
            ]
          };
          setPages(prev => ({ ...prev, landing: defaultLanding }));
        }

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
