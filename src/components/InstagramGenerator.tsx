import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useDownload } from '../hooks/useDownload';
import CommentPreview from './ui/CommentPreview';
import ControlsPanel from './ui/ControlsPanel';

import StickerFrame from './ui/StickerFrame';

export default function InstagramGenerator() {
  const [username, setUsername] = useState('ugc_creator');
  const [comment, setComment] = useState('This product literally changed my life! Highly recommend it to everyone. 😍');
  const [profilePic, setProfilePic] = useState('https://picsum.photos/seed/avatar1/200/200');
  const [isVerified, setIsVerified] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [replyingTo, setReplyingTo] = useState('');

  const { downloadRef, download } = useDownload();

  const reset = () => {
    setUsername('ugc_creator');
    setComment('This product literally changed my life! Highly recommend it to everyone. 😍');
    setProfilePic('https://picsum.photos/seed/avatar1/200/200');
    setIsVerified(true);
    setTheme('light');
    setReplyingTo('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900">
          <span className="text-insta-gradient">Instagram</span> Comment Generator
        </h1>
        <p className="mt-2 text-slate-600">Customize and download your Instagram-style comment sticker.</p>
      </div>



      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
        {/* Controls Panel */}
        <div className="lg:col-span-5">
          <ControlsPanel 
            onReset={reset}
            onDownload={() => download('instagram-comment')}
            fields={[
              { label: 'Profile Picture', type: 'upload', value: profilePic, onChange: setProfilePic },
              { 
                label: 'Username', 
                type: 'text', 
                value: username, 
                maxLength: 30,
                onChange: setUsername
              },
              { label: 'Replying to (optional)', type: 'text', value: replyingTo, onChange: setReplyingTo },
              { label: 'Comment', type: 'textarea', value: comment, onChange: setComment },
              { 
                label: 'Badge', 
                type: 'toggle', 
                value: isVerified, 
                onChange: setIsVerified,
                options: [
                  { label: 'None', value: false },
                  { 
                    label: 'Verified', 
                    value: true, 
                    icon: (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        <Check size={10} strokeWidth={4} />
                      </div>
                    ) 
                  }
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
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[32px] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
            
            <div className="relative flex items-center justify-center min-h-[400px] bg-slate-100/50 rounded-[32px] border border-slate-200/60 p-4 sm:p-12 overflow-hidden">
              <StickerFrame
                innerRef={downloadRef}
                theme={theme}
                platform="instagram"
              >
                <CommentPreview 
                  platform="instagram"
                  username={username}
                  comment={comment}
                  profilePic={profilePic}
                  isVerified={isVerified}
                  theme={theme}
                  replyingTo={replyingTo}
                />
              </StickerFrame>
            </div>
          </div>


          
          <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
             <h4 className="font-bold text-indigo-900 text-sm mb-2 uppercase tracking-wide">Usage Tip</h4>
             <p className="text-indigo-700 text-sm leading-relaxed">
               The downloaded image will have a clean sticker-style look. Overlay it in your video editor (CapCut, Premiere, etc.) and set the blending mode or just use it as is for a realistic effect.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

