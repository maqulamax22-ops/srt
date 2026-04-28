import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  ShieldCheck, 
  User as UserIcon,
  Calendar,
  ArrowRight,
  Trash2,
  X,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { collection, query, limit, onSnapshot, orderBy, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

export default function UserManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Broadcast state
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);
  
  // Support state
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [fetchingTickets, setFetchingTickets] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(50));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userData);
      setLoading(false);
    });

    // Fetch support tickets
    const qTickets = query(collection(db, 'support_tickets'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribeTickets = onSnapshot(qTickets, (snapshot) => {
      const ticketData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSupportTickets(ticketData);
      setFetchingTickets(false);
    });

    return () => {
      unsubscribe();
      unsubscribeTickets();
    };
  }, []);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change user role to ${newRole}?`)) return;
    
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
    } catch (e) {
      console.error(e);
      alert('Failed to update role.');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you absolutely sure? This user will be permanently deleted from the database. This action cannot be undone.')) return;
    
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (e) {
      console.error(e);
      alert('Failed to delete user.');
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;
    
    setBroadcasting(true);
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnap.size;
      
      // Store the announcement
      await addDoc(collection(db, 'announcements'), {
        title: broadcastTitle,
        content: broadcastMessage,
        createdAt: serverTimestamp(),
        audienceSize: totalUsers,
        status: 'sent'
      });
      
      alert(`Broadcasting content to ${totalUsers} members...`);
      setShowBroadcast(false);
      setBroadcastTitle('');
      setBroadcastMessage('');
    } catch (e) {
      console.error(e);
      alert('Broadcast failed.');
    } finally {
      setBroadcasting(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active User Directory</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage permissions and membership</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 w-full md:w-80 group focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <Search className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                placeholder="Search by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm font-medium w-full" 
              />
            </div>
            <button className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[32px] border border-slate-50">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 text-left">
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Subscriber</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((u, idx) => (
                  <motion.tr 
                    key={u.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl p-[2px] bg-slate-100 group-hover:bg-indigo-100 transition-colors">
                           <img src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} className="w-full h-full rounded-[14px] object-cover" alt="" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{u.displayName || 'Unnamed User'}</p>
                          <p className="text-xs font-medium text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                        u.role === 'admin' 
                          ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                          : 'bg-slate-50 text-slate-500 border border-slate-100'
                      }`}>
                        {u.role === 'admin' ? <ShieldCheck size={12} /> : <UserIcon size={12} />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Calendar size={14} className="text-slate-200" />
                        {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <button 
                            onClick={() => toggleRole(u.id, u.role)}
                            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            title="Manage Role"
                         >
                            <ShieldCheck size={18} />
                         </button>
                         <button 
                            onClick={() => deleteUser(u.id)}
                            className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete User"
                         >
                            <Trash2 size={18} />
                         </button>
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredUsers.length === 0 && !loading && (
          <div className="py-20 text-center bg-slate-50 rounded-[32px] mt-8">
             <Users size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No users found matching your search</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-10 bg-slate-900 rounded-[40px] text-white relative overflow-hidden group">
            <h4 className="text-xl font-black tracking-tight mb-2 relative z-10">Broadcast Announcement</h4>
            <p className="text-white/50 text-sm font-light mb-8 relative z-10 leading-relaxed">Send a push notification or email to all registered community members.</p>
            <button 
              onClick={() => setShowBroadcast(true)}
              className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/50 relative z-10 group/btn"
            >
               Select Audience
               <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-700" />
         </div>

         <div className="p-10 bg-white border border-slate-100 rounded-[40px] shadow-sm relative overflow-hidden">
            <h4 className="text-xl font-black text-slate-900 tracking-tight mb-2">Member Support</h4>
            <p className="text-slate-500 text-sm font-light mb-8 leading-relaxed">View pending inquiries and resolved tickets from the community.</p>
            <div className="flex flex-col gap-4">
               {fetchingTickets ? (
                 <div className="animate-pulse flex gap-2">
                   <div className="h-8 w-24 bg-slate-100 rounded-xl"></div>
                   <div className="h-8 w-24 bg-slate-100 rounded-xl"></div>
                 </div>
               ) : (
                 <>
                   <div className="flex items-center gap-4">
                      <div className="px-4 py-2 bg-indigo-50 rounded-xl text-xs font-bold text-indigo-600 uppercase tracking-widest">
                        {supportTickets.filter(t => t.status === 'pending').length} Pending
                      </div>
                      <button className="text-indigo-600 text-sm font-bold hover:underline">View All Help Desk</button>
                   </div>
                   <div className="space-y-3">
                      {supportTickets.map(ticket => (
                        <div key={ticket.id} className="flex flex-col p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                           <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                 <div className="p-2 bg-white rounded-lg">
                                    <MessageSquare size={14} className="text-slate-400" />
                                 </div>
                                 <span className="text-xs font-bold text-slate-900">{ticket.subject || 'No Subject'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${
                                   ticket.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                }`}>
                                   {ticket.status}
                                </span>
                                {ticket.status === 'pending' && (
                                  <button 
                                    onClick={async () => {
                                      await updateDoc(doc(db, 'support_tickets', ticket.id), { status: 'resolved' });
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Mark Resolved"
                                  >
                                    <ShieldCheck size={14} />
                                  </button>
                                )}
                              </div>
                           </div>
                           <p className="text-[11px] text-slate-500 line-clamp-2 pl-11">{ticket.message}</p>
                           <p className="text-[9px] text-slate-300 mt-2 pl-11 font-medium">{ticket.email} • {ticket.createdAt?.toDate?.().toLocaleString() || 'Recently'}</p>
                        </div>
                      ))}
                      {supportTickets.length === 0 && (
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium italic py-4">
                           <ShieldCheck size={14} />
                           All systems normal. No pending tickets.
                        </div>
                      )}
                   </div>
                 </>
               )}
            </div>
         </div>
      </div>

      <AnimatePresence>
        {showBroadcast && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-20">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBroadcast(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight">New Broadcast</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Reach the whole community</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowBroadcast(false)}
                    className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleBroadcast} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Subject</label>
                    <input 
                      required
                      placeholder="e.g. Major Update Released" 
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Broadcast Message</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Compose your global announcement..." 
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all resize-none"
                    />
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                    <div className="p-2 bg-white rounded-lg h-fit">
                      <AlertCircle className="text-amber-500" size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.05em] text-amber-700">Warning</p>
                      <p className="text-xs font-medium text-amber-600/80 leading-relaxed">This will notify {users.length} members immediately. Ensure your content is accurate before sending.</p>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={broadcasting}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {broadcasting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ArrowRight size={18} />
                        Launch Broadcast
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
