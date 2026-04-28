import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface QuestionStickerProps {
  question?: string;
  placeholder?: string;
  headerColor?: string;
  textColor?: string;
  theme?: 'light' | 'dark';
}

export default function QuestionSticker({ 
  question = 'Ask me a question', 
  placeholder = 'Hello can i start video editing from scratch in 2026?',
  headerColor = '#262626',
  textColor = '#FFFFFF',
  theme = 'light'
}: QuestionStickerProps) {
  const isDark = theme === 'dark';
  
  const truncatedText = React.useMemo(() => {
    const words = placeholder.split(/\s+/);
    if (words.length > 20) {
      return words.slice(0, 20).join(' ') + '.....';
    }
    return placeholder;
  }, [placeholder]);
  
  return (
    <div className={cn(
      "w-[340px] rounded-[22px] overflow-hidden shadow-2xl flex flex-col font-instagram border border-white/10",
      isDark ? "bg-[#1C1C1E]" : "bg-white"
    )}>
      {/* Header section with "Ask me a question" */}
      <div 
        className="pt-5 pb-5 px-6 text-center flex items-center justify-center" 
        style={{ backgroundColor: headerColor }}
      >
        <span 
          className="text-[17px] font-semibold tracking-tight"
          style={{ color: textColor }}
        >
          {question}
        </span>
      </div>
      
      {/* Body section where the text appears */}
      <div className={cn(
        "px-8 py-10 text-center flex items-center justify-center",
        isDark ? "bg-[#1C1C1E] text-white" : "bg-white text-[#1C1C1E]"
      )}>
        <p className="text-[24px] font-bold leading-[1.2] tracking-tight text-pretty">
          {truncatedText}
        </p>
      </div>
    </div>
  );
}
