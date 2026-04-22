import { Link } from 'react-router-dom';
import { Type, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function AITools() {
  const tools = [
    {
      id: 'instagram',
      title: 'Instagram Generator',
      description: 'Create realistic Instagram comment stickers for your videos.',
      icon: (
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/3840px-Instagram_logo_2016.svg.png" 
          alt="Instagram" 
          className="w-10 h-10 object-contain"
          referrerPolicy="no-referrer"
        />
      ),
      path: '/instagram',
      color: 'bg-white',
      shadow: 'shadow-pink-100 hover:shadow-pink-200'
    },
    {
      id: 'tiktok',
      title: 'TikTok Generator',
      description: 'Authentic TikTok style comments for your high-engagement content.',
      icon: (
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Tiktok_icon.svg/3840px-Tiktok_icon.svg.png" 
          alt="TikTok" 
          className="w-10 h-10 object-contain"
          referrerPolicy="no-referrer"
        />
      ),
      path: '/tiktok',
      color: 'bg-slate-900',
      textColor: 'text-white',
      shadow: 'shadow-slate-300 hover:shadow-slate-400'
    },
    {
      id: 'text-box',
      title: 'Text Box Generator',
      description: 'Stunning text box styles for Reels, Shorts, and TikTok hooks.',
      icon: <Type size={40} className="text-indigo-600" />,
      path: '/text-box',
      color: 'bg-white',
      shadow: 'shadow-blue-100 hover:shadow-blue-200'
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10 py-16">
      <div className="text-center mb-20 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
          AI <span className="text-insta-gradient">Creator Tools</span>
        </h1>
        <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto">


          Elevate your social media game with our suite of powerful generation tools. 
          Built for creators, by creators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "p-8 rounded-[40px] border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]",
              tool.color,
              tool.shadow,
              tool.textColor || "text-slate-900"
            )}
          >
            <div className="space-y-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-3xl inline-block shadow-sm">
                {tool.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight">{tool.title}</h3>
                <p className={cn(
                  "font-light text-sm leading-relaxed",
                  tool.textColor ? "text-slate-300" : "text-slate-500"
                )}>
                  {tool.description}
                </p>
              </div>
            </div>
            
            <div className="pt-8">
              <Link
                to={tool.path}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all hover:gap-3",
                  tool.textColor ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-indigo-600 text-white hover:bg-indigo-700"
                )}
              >
                Create Now
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
