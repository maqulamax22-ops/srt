import React from 'react';
import { cn } from '../../lib/utils';

interface StickerFrameProps {
  children: React.ReactNode;
  theme: 'light' | 'dark';
  platform: 'instagram' | 'tiktok';
  innerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function StickerFrame({ children, theme, platform, innerRef }: StickerFrameProps) {
  return (
    <div 
      ref={innerRef as any}
      className="flex items-center justify-center p-12 shrink-0 aspect-square min-w-[500px] bg-transparent"
    >
      <div className="flex justify-center w-full">
        {children}
      </div>
    </div>
  );
}

