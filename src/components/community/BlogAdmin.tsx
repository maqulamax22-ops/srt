import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { db, auth } from '../../lib/firebase';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import RichTextEditor from './RichTextEditor';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image?: string;
  status: 'published' | 'draft';
  createdAt: any;
}

const ADMIN_EMAIL = 'wazooshop@gmail.com';

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribePosts: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setPermissionError(null);
      
      // Case-insensitive check
      if (u && u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        if (unsubscribePosts) unsubscribePosts();
        
        const q = query(collection(db, 'blog_posts'));
        unsubscribePosts = onSnapshot(q, (snapshot) => {
          const postsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as BlogPost[];
          
          const sorted = postsData.sort((a,b) => {
            const tA = (a.createdAt as any)?.seconds || 0;
            const tB = (b.createdAt as any)?.seconds || 0;
            return tB - tA;
          });

          setPosts(sorted);
          setLoading(false);
          setPermissionError(null);
        }, (error) => {
          console.error("Firestore error:", error);
          if (error.message.includes('permission')) {
            setPermissionError(`Firestore Permission Denied: Your account (${u.email}) is not authorized by the security rules.`);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
        setPosts([]);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribePosts) (unsubscribePosts as () => void)();
    };
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => auth.signOut();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost?.title || !currentPost?.content) return;
    if (user?.email !== ADMIN_EMAIL) return alert("Unauthorized");

    // Check size limit (approx 800KB to be safe with other fields)
    if (currentPost.image && currentPost.image.length > 800000) {
      alert("The image is too large! Please use a smaller file or a URL. (Firestore limit: 1MB per post including text)");
      return;
    }

    // Clean data for Firestore (exclude id and undefined values)
    const { id, ...data } = currentPost;
    const postData = {
      ...data,
      updatedAt: serverTimestamp(),
      status: currentPost.status || 'draft',
      image: currentPost.image || ''
    };

    try {
      if (id) {
        await updateDoc(doc(db, 'blog_posts', id), postData);
      } else {
        await addDoc(collection(db, 'blog_posts'), {
          ...postData,
          createdAt: serverTimestamp()
        });
      }
      setIsEditing(false);
      setCurrentPost(null);
    } catch (error: any) {
      console.error("Error saving post:", error);
      if (error.message?.includes('size')) {
        alert("CRITICAL ERROR: This post is too large to save! Try removing the image or reducing the text length. Firestore has a 1MB total limit per post.");
      } else if (error.message?.includes('permission')) {
        alert("PERMISSION ERROR: You are not authorized to save this post. Check if you are correctly logged in as " + ADMIN_EMAIL);
      } else {
        alert("Failed to save post. Error: " + (error.message || "Unknown error"));
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2000000) { // 2MB raw file limit 
        alert("Original file is too large! Please choose an image smaller than 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Max dimensions for compression
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Export with lower quality to stay way under 1MB
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
          setCurrentPost({ ...currentPost, image: compressedBase64 });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (user?.email !== ADMIN_EMAIL) return alert("Unauthorized");
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deleteDoc(doc(db, 'blog_posts', id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const toggleStatus = async (post: BlogPost) => {
    if (user?.email !== ADMIN_EMAIL) return alert("Unauthorized");
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      await updateDoc(doc(db, 'blog_posts', post.id), { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
    </div>
  );

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-2xl text-center max-w-md w-full space-y-8">
          <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto text-indigo-600">
            <LogIn size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Only</h1>
            {permissionError ? (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-mono text-left leading-relaxed">
                {permissionError}
              </div>
            ) : (
              <p className="text-slate-500 font-light leading-relaxed">
                Please sign in with <span className="font-bold text-indigo-600">{ADMIN_EMAIL}</span> to manage the community blog.
              </p>
            )}
          </div>
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="" />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10 py-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Blog CMS</h1>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Admin</span>
          </div>
          <p className="text-slate-500 font-light flex items-center gap-2">
            Logged in as <span className="font-medium text-slate-900">{user.email}</span>
            <button onClick={logout} className="text-red-500 hover:underline flex items-center gap-1 ml-2">
              <LogOut size={14} />
              Logout
            </button>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            onClick={() => {
              setCurrentPost({ title: '', content: '', status: 'draft', image: '' });
              setIsEditing(true);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus size={20} />
            Create New Post
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden text-sm sm:text-base">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Article</th>
                <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
                <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Created</th>
                <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt="" 
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <span className="font-bold text-slate-900 line-clamp-1">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <button
                      onClick={() => toggleStatus(post)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        post.status === 'published' 
                          ? 'bg-green-50 text-green-600' 
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {post.status === 'published' ? <Eye size={12} /> : <EyeOff size={12} />}
                      {post.status}
                    </button>
                  </td>
                  <td className="px-8 py-5 text-slate-400 tabular-nums">
                    {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Pending'}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setCurrentPost(post);
                          setIsEditing(true);
                        }}
                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-light">
                    No articles found. Start by creating one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Overlay */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl p-8 sm:p-12 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {currentPost?.id ? 'Edit Story' : 'New Story'}
                </h2>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                  <input
                    required
                    value={currentPost?.title || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-bold text-lg"
                    placeholder="Enter article title..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Featured Image</label>
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 border border-slate-100 rounded-[24px]">
                    <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {currentPost?.image ? (
                        <img src={currentPost.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Plus size={24} className="text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 space-y-3 w-full">
                      <input
                        type="text"
                        value={currentPost?.image || ''}
                        onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                        placeholder="Paste image URL here..."
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="blog-image-upload"
                        />
                        <label
                          htmlFor="blog-image-upload"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-900 transition-all"
                        >
                          <Plus size={14} />
                          Upload from Device
                        </label>
                        {currentPost?.image && (
                          <button
                            type="button"
                            onClick={() => setCurrentPost({ ...currentPost, image: '' })}
                            className="ml-3 text-xs font-bold text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Article Content</label>
                  <RichTextEditor 
                    content={currentPost?.content || ''} 
                    onChange={(html) => setCurrentPost(prev => ({ ...prev, content: html }))}
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100"
                  >
                    <Save size={20} />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
