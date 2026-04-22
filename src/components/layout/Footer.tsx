import { Link } from 'react-router-dom';
import { useCMS } from '../../hooks/useCMS';
import { cn } from '../../lib/utils';

export default function Footer() {
  const { config, loading } = useCMS();

  if (loading || !config) return null;

  return (
    <footer className="px-6 sm:px-10 py-12 bg-slate-900 text-white flex flex-col items-center gap-8 shrink-0">
      <Link to="/" className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
        <img src="/logo.png" alt="Commentify" className="h-8 w-auto brightness-0 invert" referrerPolicy="no-referrer" />
      </Link>

      <div className="flex flex-wrap justify-center gap-8 text-[10px] opacity-50 uppercase tracking-[0.2em] font-bold">
        {config.navigation.map((link) => (
          <Link key={link.path} to={link.path} className="hover:text-white transition-colors">
            {link.label}
          </Link>
        ))}
      </div>

      <div className="text-[10px] font-medium opacity-40 tracking-wider">
        {config.footerText}
      </div>
    </footer>
  );
}

