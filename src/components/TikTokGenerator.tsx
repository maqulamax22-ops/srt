import React, { useState } from 'react';
import { useDownload } from '../hooks/useDownload';
import CommentPreview from './ui/CommentPreview';
import ControlsPanel from './ui/ControlsPanel';

import StickerFrame from './ui/StickerFrame';

export default function TikTokGenerator() {
  const [username, setUsername] = useState('social_maven');
  const [comment, setComment] = useState('Wait, did you really just do that?! 😱 I need one right now!');
  const [profilePic, setProfilePic] = useState('https://picsum.photos/seed/avatar5/200/200');
  const [likes, setLikes] = useState('1,240');
  const [showReply, setShowReply] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const { downloadRef, download } = useDownload();

  const reset = () => {
    setUsername('social_maven');
    setComment('Wait, did you really just do that?! 😱 I need one right now!');
    setProfilePic('https://picsum.photos/seed/avatar5/200/200');
    setLikes('1,240');
    setShowReply(true);
    setTheme('dark');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900">
          <span className="text-insta-gradient">TikTok</span> Comment Generator
        </h1>

        <p className="mt-2 text-slate-600">Customize and download your TikTok-style comment sticker.</p>
      </div>


      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
         <div className="lg:col-span-5">
          <ControlsPanel 
            onReset={reset}
            onDownload={() => download('tiktok-comment')}
            fields={[
              { label: 'Profile Picture', type: 'upload', value: profilePic, onChange: setProfilePic },
              { 
                label: 'Username', 
                type: 'text', 
                value: username, 
                maxLength: 30,
                onChange: setUsername
              },
              { label: 'Comment', type: 'textarea', value: comment, onChange: setComment },
              { label: 'Likes Count', type: 'text', value: likes, onChange: setLikes },
              { 
                label: 'Reply Indicator', 
                type: 'toggle', 
                value: showReply, 
                onChange: setShowReply,
                options: [
                  { label: 'Off', value: false },
                  { label: 'On', value: true }
                ]
              },
              {
                label: 'Theme',
                type: 'toggle',
                value: theme,
                onChange: setTheme,
                options: [
                  { label: 'Light', value: 'light' },
                  { label: 'Dark', value: 'dark' }
                ]
              }
            ]}
          />
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-7 sticky top-24">
          <div className="mb-6">
             <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               Live Preview
             </span>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-indigo-500 rounded-[32px] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
            
            <div className="relative flex items-center justify-center min-h-[400px] bg-slate-100/50 rounded-[32px] border border-slate-200/60 p-4 sm:p-12 overflow-hidden">
               <StickerFrame
                innerRef={downloadRef}
                theme={theme}
                platform="tiktok"
              >
                <CommentPreview 
                  platform="tiktok"
                  username={username}
                  comment={comment}
                  profilePic={profilePic}
                  theme={theme}
                  likes={likes}
                  showReply={showReply}
                />
              </StickerFrame>
            </div>
          </div>


          
          <div className="mt-8 p-6 bg-slate-900 rounded-2xl border border-slate-800 text-white">
             <h4 className="font-bold text-white text-sm mb-2 uppercase tracking-wide">Pro TikTok Tip</h4>
             <p className="text-slate-400 text-sm leading-relaxed">
               Most TikTok comments are viewed on a dark background. Our generator mimics the exact font and spacing used in the TikTok app for maximum authenticity.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

