import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image?: string;
  status: 'published' | 'draft';
  createdAt: any;
}

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We only query by status to avoid needing a composite index for orderBy
    const q = query(
      collection(db, 'blog_posts'),
      where('status', '==', 'published')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      
      // Sort in memory by createdAt desc
      const sortedPosts = postsData.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setPosts(sortedPosts);
      setLoading(false);
    }, (error) => {
      console.error("Blog fetch error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 pt-16 pb-12 sm:pt-24 sm:pb-20 px-6 sm:px-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="mx-auto max-w-7xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 border border-white/10">
              Community News
            </div>
            <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white leading-tight">
              Community <span className="text-indigo-500 italic">Blog</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 font-light leading-relaxed">
              Updates, tips, and news from the Commentify team. Learn how to grow your social presence with better content.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 sm:px-10 py-20">

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100 shadow-sm">
          <p className="text-slate-400">No community stories published yet. Stay tuned!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all group flex flex-col"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-100">
                {post.image ? (
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <span className="font-bold text-4xl italic opacity-20">Commentify</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-widest shadow-sm">
                    Article
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-indigo-400" />
                    {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Recent'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={12} className="text-indigo-400" />
                    Admin
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-slate-500 text-sm font-light leading-relaxed line-clamp-3 mb-8 flex-1">
                  {post.content.replace(/<[^>]*>/g, ' ').substring(0, 160)}...
                </p>

                <Link
                  to={`/community/${post.id}`}
                  className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm group/btn"
                >
                  Read Full Story
                  <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
