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
      className="inline-flex items-center justify-center p-12 shrink-0"
      style={{ 
        backgroundColor: 'transparent',
        width: 'auto', // Let it be compact or fixed width based on parent
        minWidth: '500px',
      }}
    >
      <div className="flex justify-center">
        {children}
      </div>
    </div>
  );
}

