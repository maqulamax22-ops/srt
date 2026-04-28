import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface NavLink {
  label: string;
  path: string;
}

export interface FooterSection {
  title: string;
  links: NavLink[];
}

export interface SiteConfig {
  logoText: string;
  logoUrl?: string;
  faviconUrl?: string;
  headerNavigation: NavLink[];
  footerSections: FooterSection[];
}

const DEFAULT_CONFIG: SiteConfig = {
  logoText: 'Commentify',
  headerNavigation: [
    { label: 'Tools', path: '/tools' },
    { label: 'Community', path: '/community' },
    { label: 'Donate', path: '/donate' },
  ],
  footerSections: [
    {
      title: 'Product',
      links: [
        { label: 'Tools', path: '/tools' },
        { label: 'Enterprise', path: '/tools' },
        { label: 'Resources', path: '/community' },
        { label: 'Changelog', path: '/community' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
        { label: 'Privacy', path: '/privacy' },
        { label: 'Terms', path: '/terms' },
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'Donate', path: '/donate' },
        { label: 'Feedback', path: '/contact' },
        { label: 'GitHub', path: '#' },
        { label: 'Discord', path: '#' },
      ]
    }
  ]
};

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'configs', 'site'), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as SiteConfig;
        // Merge with defaults to ensure structure
        setConfig({
          logoText: data.logoText || DEFAULT_CONFIG.logoText,
          logoUrl: data.logoUrl,
          faviconUrl: data.faviconUrl,
          headerNavigation: data.headerNavigation || DEFAULT_CONFIG.headerNavigation,
          footerSections: data.footerSections || DEFAULT_CONFIG.footerSections
        });
      } else {
        setConfig(DEFAULT_CONFIG);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const updateConfig = async (newConfig: Partial<SiteConfig>) => {
    try {
      await setDoc(doc(db, 'configs', 'site'), { ...config, ...newConfig }, { merge: true });
    } catch (error) {
      console.error('Error updating site config:', error);
      throw error;
    }
  };

  return { config, updateConfig, loading };
}
