import { cn } from '../../lib/utils';
import { Check, Heart } from 'lucide-react';
import React from 'react';

interface CommentPreviewProps {
  platform: 'instagram' | 'tiktok';
  username: string;
  comment: string;
  profilePic: string;
  isVerified?: boolean;
  theme: 'light' | 'dark';
  replyingTo?: string;
  likes?: string;
  showReply?: boolean;
  innerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function CommentPreview({
  platform,
  username,
  comment,
  profilePic,
  isVerified,
  theme,
  replyingTo,
  likes,
  showReply,
  innerRef
}: CommentPreviewProps) {
  // Common styles for the "sticker" card
  const cardStyles = cn(
    "flex items-start gap-4 p-6 rounded-[28px] transition-colors w-[380px] shrink-0",
    theme === 'light' ? "bg-white text-black shadow-[0_10px_40px_rgba(0,0,0,0.08)]" : "bg-[#121212] text-white shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
    platform === 'instagram' ? "font-instagram" : "font-tiktok"
  );



  if (platform === 'instagram') {
    return (
      <div 
        ref={innerRef as any}
        className={cardStyles}
        style={{ backgroundColor: theme === 'light' ? '#ffffff' : '#121212' }}
      >
        <img 
          src={profilePic} 
          alt="Profile" 
          referrerPolicy="no-referrer"
          className="h-10 w-10 rounded-full object-cover shrink-0" 
        />
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[14px] leading-tight">{username}</span>
            {isVerified && (
              <div className="w-[14px] h-[14px] bg-[#0095f6] rounded-full flex items-center justify-center">
                <Check size={10} strokeWidth={5} className="text-white" />
              </div>
            )}
          </div>
          <p className="text-[14px] mt-1 leading-[1.4] font-normal break-words">
            {comment}
          </p>
          {replyingTo && (
            <span className={cn(
              "text-[12px] mt-2",
              theme === 'light' ? "text-black/60" : "text-white/60"
            )}>
              Replying to <span className="font-medium cursor-default">{replyingTo.replace('@', '')}</span>
            </span>
          )}

        </div>
      </div>
    );
  }

  return (
    <div 
      ref={innerRef as any}
      className={cardStyles}
      style={{ backgroundColor: theme === 'light' ? '#ffffff' : '#121212' }}
    >
      <img 
        src={profilePic} 
        alt="Profile" 
        referrerPolicy="no-referrer"
        className="h-9 w-9 rounded-full object-cover shrink-0 border border-white/5" 
      />
      <div className="flex-1 flex flex-col min-w-0">
        <span className={cn(
          "font-bold text-[13px] leading-tight mb-0.5",
          theme === 'light' ? "text-slate-600 font-semibold" : "text-zinc-300"
        )}>{username}</span>
        <p className="text-[14px] leading-[1.4] font-normal break-words">
          {comment}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <span className={cn(
            "text-[11px] font-medium leading-none",
            theme === 'light' ? "text-zinc-400" : "text-zinc-500"
          )}>
            1h ago
          </span>
          {showReply && (
            <span className={cn(
              "text-[11px] font-bold leading-none cursor-default",
              theme === 'light' ? "text-zinc-500" : "text-zinc-400"
            )}>
              Reply
            </span>
          )}
        </div>
      </div>
      <div className="shrink-0 flex flex-col items-center gap-1 mt-1">
         <Heart 
          size={18} 
          className={theme === 'light' ? "text-zinc-300" : "text-zinc-500"} 
         />
         <span className={cn(
            "text-[10px] font-medium",
            theme === 'light' ? "text-zinc-400" : "text-zinc-500"
         )}>{likes}</span>
      </div>
    </div>
  );
}

