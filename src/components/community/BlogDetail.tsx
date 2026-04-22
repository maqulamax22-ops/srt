import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: any;
}

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, 'blog_posts', id));
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as BlogPost);
        } else {
          navigate('/community');
        }
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 sm:px-10 py-16">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-12"
      >
        <Link 
          to="/community" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
        >
          <ArrowLeft size={14} />
          Back to Community
        </Link>
      </motion.div>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="space-y-8">
          <div className="flex items-center gap-6 text-[10px] text-slate-400 font-black uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-indigo-400" />
              {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Recent'}
            </div>
            <div className="flex items-center gap-2">
              <User size={14} className="text-indigo-400" />
              Admin
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1]">
            {post.title}
          </h1>
        </div>

        {post.image && (
          <div className="aspect-[21/9] rounded-[40px] overflow-hidden border border-slate-100 shadow-2xl relative">
            <img 
              src={post.image} 
              alt="" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <div className="max-w-none">
          <div 
            className="blog-content text-slate-600 text-lg sm:text-xl font-light leading-[1.8]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <style>{`
          .blog-content {
            font-family: inherit;
          }
          .blog-content p { margin-bottom: 1.5em; }
          .blog-content h1 { font-size: 2.5rem; font-weight: 900; margin-top: 2rem; margin-bottom: 1rem; color: #0f172a; line-height: 1.2; }
          .blog-content h2 { font-size: 2rem; font-weight: 800; margin-top: 1.5rem; margin-bottom: 1rem; color: #0f172a; }
          .blog-content h3 { font-size: 1.5rem; font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.75rem; color: #0f172a; }
          .blog-content ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1.5em; }
          .blog-content ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1.5em; }
          .blog-content img { max-width: 100%; height: auto; border-radius: 2rem; margin: 2rem 0; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
          .blog-content a { color: #4f46e5; text-decoration: underline; font-weight: 500; }
          .blog-content strong { font-weight: 700; color: #0f172a; }
        `}</style>

        <div className="pt-16 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-insta-gradient p-[2px]">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-slate-900">
                A
              </div>
            </div>
            <div>
              <p className="font-bold text-slate-900">Commentify Admin</p>
              <p className="text-xs text-slate-400 font-medium">Head of Community</p>
            </div>
          </div>

          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}
            className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all group"
          >
            <Share2 size={24} className="transition-transform group-hover:scale-110" />
          </button>
        </div>
      </motion.article>
    </div>
  );
}
