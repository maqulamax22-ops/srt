import { Link } from 'react-router-dom';
import { Command, Github, Twitter, Youtube } from 'lucide-react';

import { useSiteConfig } from '../../hooks/useSiteConfig';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { config } = useSiteConfig();

  const footerLinks = config.footerSections;

  return (
    <footer className="bg-[#030303] pt-24 pb-12 border-t border-white/5 relative z-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
          <div className="col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              {config.logoUrl ? (
                <img src={config.logoUrl} alt={config.logoText} className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white border border-white/10 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                  <Command size={18} />
                </div>
              )}
              <span className="font-display text-lg font-bold tracking-tight text-white">
                {config.logoText}
              </span>
            </Link>
            <p className="text-white/40 text-sm font-medium leading-relaxed max-w-[240px]">
              The premium creator ecosystem for high-fidelity social assets and AI-powered viral tools.
            </p>
            <div className="flex items-center gap-4 text-white/30">
               <Twitter size={20} className="hover:text-white transition-colors cursor-pointer" />
               <Github size={20} className="hover:text-white transition-colors cursor-pointer" />
               <Youtube size={20} className="hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-sm font-medium text-white/30 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            © {currentYear} Commentify AI Labs. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Network Status: Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
