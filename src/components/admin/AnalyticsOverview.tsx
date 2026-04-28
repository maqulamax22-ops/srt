import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  MousePointer2, 
  Clock, 
  Globe, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  Download,
  BarChart3,
  Activity
} from 'lucide-react';
import { collection, query, limit, onSnapshot, orderBy, where, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'motion/react';

export default function AnalyticsOverview() {
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [referralData, setReferralData] = useState<any[]>([]);
  const [countryData, setCountryData] = useState<any[]>([]);
  const [browserData, setBrowserData] = useState<any[]>([]);
  const [activityStream, setActivityStream] = useState<any[]>([]);
  const [toolConversions, setToolConversions] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState(7); // days
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    activeNow: 0,
    avgDuration: '0s',
    interaction: '0%',
    bounceRate: '0%'
  });

  const COLORS = ['#6366f1', '#60a5fa', '#34d399', '#f472b6', '#8b5cf6'];

  useEffect(() => {
    setIsLoading(true);
    // 1. Live Sessions (Real-time updates)
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const sessionsQ = query(
      collection(db, 'active_sessions'),
      where('lastActive', '>=', Timestamp.fromDate(fifteenMinsAgo)),
      orderBy('lastActive', 'desc')
    );

    const unsubscribeSessions = onSnapshot(sessionsQ, (snapshot) => {
      const sessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setActiveSessions(sessions);
      setStats(prev => ({ ...prev, activeNow: sessions.length }));
    }, (err) => {
      console.error("Sessions snapshot error:", err);
      setError("Failed to stream live visitors");
    });

    // 2. Aggregate Data based on Time Range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeRange);
    
    const eventsQ = query(
      collection(db, 'analytics_events'),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      orderBy('timestamp', 'asc')
    );

    const unsubscribeEvents = onSnapshot(eventsQ, (snapshot) => {
      try {
        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Calculate Base Metrics
        const totalVisits = events.length;
        const uniqueSessions = new Set(events.map((e: any) => e.sessionId)).size;
        const uniqueVisitors = new Set(events.map((e: any) => e.userId)).size;
        
        // GROUP BY SESSION for advanced metrics
        const sessionsMap: any = {};
        events.forEach((event: any) => {
          const sid = event.sessionId || event.userId || event.id; // fallback
          if (!sessionsMap[sid]) sessionsMap[sid] = [];
          sessionsMap[sid].push(event);
        });

        const sessionList = Object.values(sessionsMap);
        
        // Bounce Rate: sessions with only 1 page view / total sessions
        const singlePageSessions = sessionList.filter((s: any) => s.length === 1).length;
        const bounceRate = uniqueSessions > 0 ? (singlePageSessions / uniqueSessions * 100).toFixed(1) : 0;

        // Avg Duration
        let totalDurationMs = 0;
        sessionList.forEach((s: any) => {
          if (s.length > 1) {
            const firstEvent = s[0];
            const lastEvent = s[s.length - 1];
            const start = firstEvent.timestamp?.toMillis() || 0;
            const end = lastEvent.timestamp?.toMillis() || 0;
            if (start && end) {
              totalDurationMs += (end - start);
            }
          }
        });
        const avgDurationSec = uniqueSessions > 0 ? (totalDurationMs / uniqueSessions / 1000) : 0;
        const formatDuration = (sec: number) => {
          if (sec < 60) return `${Math.round(sec)}s`;
          const mins = Math.floor(sec / 60);
          const rem = Math.round(sec % 60);
          return `${mins}m ${rem}s`;
        };

        // Engagement Rate: (total sessions - bounce sessions) / total sessions
        const engagementRate = uniqueSessions > 0 ? ((uniqueSessions - singlePageSessions) / uniqueSessions * 100).toFixed(1) : 0;

        setStats(prev => ({ 
          ...prev, 
          totalVisits, 
          uniqueVisitors,
          bounceRate: `${bounceRate}%`,
          avgDuration: formatDuration(avgDurationSec),
          interaction: `${engagementRate}%`
        }));

        // Process Time-Series Chart Data
        const timeData: any = {};
        // Initialize time slots
        for (let i = timeRange - 1; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          timeData[label] = { visits: 0, unique: 0 };
        }

        events.forEach((event: any) => {
          const date = event.timestamp?.toDate();
          if (date) {
            const label = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            if (timeData[label]) {
              timeData[label].visits++;
            }
          }
        });
        
        // Mark unique per day (simplified)
        const daySessions: any = {};
        events.forEach((event: any) => {
           const date = event.timestamp?.toDate();
           if (date) {
             const label = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
             if (!daySessions[label]) daySessions[label] = new Set();
             daySessions[label].add(event.sessionId);
           }
        });
        Object.keys(daySessions).forEach(label => {
          if (timeData[label]) timeData[label].unique = daySessions[label].size;
        });

        const formattedTimeSeries = Object.keys(timeData).map(label => ({
          name: label,
          visits: timeData[label].visits,
          unique: timeData[label].unique
        }));
        setChartData(formattedTimeSeries);

        // Process Device Distribution
        const devicesGroup: any = { Desktop: 0, Mobile: 0, Tablet: 0 };
        events.forEach((e: any) => {
          const dev = e.device || 'Desktop';
          devicesGroup[dev] = (devicesGroup[dev] || 0) + 1;
        });
        setDeviceData(Object.keys(devicesGroup).map(name => ({ name, value: devicesGroup[name] })));

        // Process Referral Sources
        const referrals: any = {};
        events.forEach((e: any) => {
          const ref = e.referrer || 'Direct';
          let cleanRef = 'Direct';
          if (ref !== 'Direct') {
            try {
              const url = new URL(ref);
              cleanRef = url.hostname;
              if (cleanRef.includes('localhost')) cleanRef = 'Development';
            } catch {
              cleanRef = ref;
            }
          }
          referrals[cleanRef] = (referrals[cleanRef] || 0) + 1;
        });
        setReferralData(Object.keys(referrals).sort((a,b) => referrals[b] - referrals[a]).slice(0, 5).map(name => ({ name, value: referrals[name] })));

        // Process Countries
        const countries: any = {};
        events.forEach((e: any) => {
          const c = e.location?.country || 'Unknown';
          countries[c] = (countries[c] || 0) + 1;
        });
        setCountryData(Object.keys(countries).sort((a,b) => countries[b] - countries[a]).slice(0, 5).map(name => ({ name, value: countries[name] })));

        // Process Browser Distribution
        const browsers: any = {};
        events.forEach((e: any) => {
          const b = e.browser || 'Unknown';
          browsers[b] = (browsers[b] || 0) + 1;
        });
        setBrowserData(Object.keys(browsers).sort((a,b) => browsers[b] - browsers[a]).slice(0, 5).map(name => ({ name, value: browsers[name] })));

        // Process Tool Conversions
        const conversions: any = { instagram: 0, tiktok: 0, 'text-box': 0, other: 0 };
        events.forEach((e: any) => {
          if (e.type === 'conversion' && e.tool) {
            conversions[e.tool] = (conversions[e.tool] || 0) + 1;
          }
        });
        setToolConversions(Object.keys(conversions).map(name => ({ name, value: conversions[name] })));

        // Process Activity Stream (Last 10 events)
        const recentEvents = events
          .filter((e: any) => e.type !== 'heartbeat')
          .sort((a: any, b: any) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0))
          .slice(0, 10);
        setActivityStream(recentEvents);

        // Process Page performance (Tool usage)
        const toolMap: any = {};
        events.forEach((event: any) => {
          const path = event.path || 'Unknown';
          if (event.type === 'page_view') {
            toolMap[path] = (toolMap[path] || 0) + 1;
          }
        });

        const formattedPie = Object.keys(toolMap)
          .sort((a, b) => toolMap[b] - toolMap[a])
          .slice(0, 5)
          .map(name => ({
            name: name === '/' ? 'Home' : name.replace('/', ''),
            value: toolMap[name]
          }));
        setPieData(formattedPie);
        setIsLoading(false);
      } catch (err) {
        console.error("Events processing error:", err);
        setError("Error processing analytics data");
        setIsLoading(false);
      }
    }, (err) => {
      console.error("Events snapshot error:", err);
      setError("Failed to load historical data");
      setIsLoading(false);
    });

    return () => {
      unsubscribeSessions();
      unsubscribeEvents();
    };
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Compiling Live Intelligence...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-8 rounded-[40px] border border-red-100 text-center">
        <p className="text-red-600 font-bold mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm gap-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-indigo-600" size={20} />
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Admin Matrix v1.4</h2>
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-2xl">
          {[7, 30, 90].map(days => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                timeRange === days 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Visits', value: stats.totalVisits.toLocaleString(), trend: stats.uniqueVisitors, subLabel: 'Unique Sessions', icon: Users, color: 'indigo' },
          { label: 'Live Visitors', value: stats.activeNow, trend: 'Real-time', subLabel: 'Active Now', icon: Zap, color: 'green' },
          { label: 'Avg Duration', value: stats.avgDuration, trend: stats.bounceRate, subLabel: 'Bounce Rate', icon: Clock, color: 'blue' },
          { label: 'Engagement', value: stats.interaction, trend: 'Optimal', subLabel: 'Interaction Rate', icon: MousePointer2, color: 'purple' },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${item.color}-50 text-${item.color}-600 group-hover:scale-110 transition-transform`}>
                <item.icon size={24} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.subLabel}</p>
                <p className="text-xs font-black text-indigo-600">{item.trend}</p>
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{item.value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="xl:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Traffic Projections</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Frequency vs Intensity</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-indigo-600" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Page Views</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-indigo-200" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unique Sessions</span>
               </div>
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', padding: '20px'}}
                  itemStyle={{fontWeight: 800, fontSize: '14px'}}
                />
                <Area type="monotone" dataKey="unique" stroke="#c7d2fe" strokeWidth={2} fillOpacity={0} strokeDasharray="5 5" />
                <Area type="monotone" dataKey="visits" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Visitor Nodes */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="text-indigo-600" size={24} />
              Network Nodes
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Active Session Telemetry</p>
          </div>

          <div className="flex-1 min-h-[300px] bg-slate-50/50 rounded-[32px] overflow-hidden border border-slate-100 p-6">
            <div className="space-y-4">
              {activeSessions.length > 0 ? (
                activeSessions.slice(0, 6).map((session, idx) => (
                  <motion.div 
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <div>
                        <p className="text-xs font-black text-slate-900 font-mono">{session.id.substring(0, 8)}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{session.location?.city || 'Unknown'}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-1 rounded-lg">
                      {session.device || 'Desktop'}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-xs font-bold text-slate-300 uppercase italic">No active nodes detected</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 p-4 bg-indigo-50 rounded-[24px] border border-indigo-100">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Channels</p>
                   <p className="text-2xl font-black text-indigo-600">{activeSessions.length}</p>
                </div>
                <div className="p-3 bg-white rounded-2xl text-indigo-600 shadow-sm">
                   <Users size={20} />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Distribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
           <h3 className="text-lg font-black text-slate-900 mb-6">Top Access Nodes</h3>
           <div className="space-y-4">
              {pieData.map((item, idx) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500 truncate max-w-[120px]">{item.name}</span>
                    <span className="text-indigo-600">{item.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <motion.div initial={{width: 0}} animate={{width: `${(item.value / stats.totalVisits) * 100}%`}} className="h-full bg-indigo-600 rounded-full" />
                  </div>
                </div>
              ))}
              {pieData.length === 0 && <p className="text-slate-300 text-xs italic">Scanning system logs...</p>}
           </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
           <h3 className="text-lg font-black text-slate-900 mb-6">Referral Inbound</h3>
           <div className="space-y-4">
              {referralData.map((item, idx) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500 truncate max-w-[120px]">{item.name}</span>
                    <span className="text-slate-400">{item.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <motion.div initial={{width: 0}} animate={{width: `${(item.value / stats.totalVisits) * 100}%`}} className="h-full bg-blue-500 rounded-full" />
                  </div>
                </div>
              ))}
              {referralData.length === 0 && <p className="text-slate-300 text-xs italic">Analyzing traffic sources...</p>}
           </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
           <h3 className="text-lg font-black text-slate-900 mb-6">Region Hotspots</h3>
           <div className="space-y-4">
              {countryData.map((item, idx) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500 truncate max-w-[120px]">{item.name}</span>
                    <span className="text-slate-400">{item.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <motion.div initial={{width: 0}} animate={{width: `${(item.value / stats.totalVisits) * 100}%`}} className="h-full bg-green-500 rounded-full" />
                  </div>
                </div>
              ))}
              {countryData.length === 0 && <p className="text-slate-300 text-xs italic">Mapping global coordinates...</p>}
           </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
           <h3 className="text-lg font-black text-slate-900 mb-6">Browsers</h3>
           <div className="space-y-4">
              {browserData.map((item, idx) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500 truncate max-w-[120px]">{item.name}</span>
                    <span className="text-slate-400">{item.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <motion.div initial={{width: 0}} animate={{width: `${(item.value / stats.totalVisits) * 100}%`}} className="h-full bg-purple-500 rounded-full" />
                  </div>
                </div>
              ))}
              {browserData.length === 0 && <p className="text-slate-300 text-xs italic">Analyzing interface logs...</p>}
           </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
           <h3 className="text-lg font-black text-slate-900 mb-4">Device Matrix</h3>
           <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="flex flex-wrap gap-2 mt-4">
              {deviceData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[idx]}} />
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{item.name}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
         <div className="flex items-center justify-between mb-8">
            <div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight">System Conversions</h3>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Asset Export Performance</p>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
               <Download size={20} />
            </div>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {toolConversions.map((tool) => (
               <div key={tool.name} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-2xl font-black text-slate-900">{tool.value}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{tool.name}</p>
               </div>
            ))}
         </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
         <div className="flex items-center justify-between mb-8">
            <div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity Log</h3>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Historical event sequence</p>
            </div>
            <div className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase">
               Archived Events
            </div>
         </div>
         <div className="space-y-3">
            {activityStream.map((event, idx) => (
               <div key={event.id || idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50 group hover:border-indigo-200 transition-all">
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs uppercase ${
                        event.type === 'conversion' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'
                     }`}>
                        {event.type === 'conversion' ? 'CV' : 'PV'}
                     </div>
                     <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest">
                           {event.type === 'conversion' ? `${event.tool} Export` : `Viewed ${event.path}`}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                           {event.location?.city || 'Unknown'}, {event.location?.countryCode || 'UN'} • {event.timestamp?.toDate?.().toLocaleTimeString() || 'Just now'}
                        </p>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-white px-2 py-1 rounded-lg border border-slate-100">
                        {event.sessionId?.substring(0, 8)}
                     </span>
                  </div>
               </div>
            ))}
            {activityStream.length === 0 && (
               <div className="py-12 text-center">
                  <p className="text-xs font-bold text-slate-300 uppercase italic">No activity logs recorded in this period</p>
               </div>
            )}
         </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
         <div className="flex items-center justify-between mb-8">
            <div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Live Activity Terminal</h3>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Real-time Node Telemetry</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Signal Stable
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="text-left border-b border-slate-100">
                     <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-black">Node Identifier</th>
                     <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-black">Geolocation</th>
                     <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-black">Interface</th>
                     <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-black">Active Route</th>
                     <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-black">Last Sync</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {activeSessions.map(session => (
                    <tr key={session.id} className="group hover:bg-slate-50 transition-colors">
                       <td className="py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs uppercase">
                                {session.id.substring(0, 1)}
                             </div>
                             <span className="text-xs font-bold text-slate-600 font-mono tracking-tight">{session.id.substring(0, 12)}</span>
                          </div>
                       </td>
                       <td className="py-4">
                          <div className="flex items-center gap-2">
                             <span className="text-xs font-black text-slate-900 tracking-tight">{session.location?.city || 'Unknown'}</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase">{session.location?.countryCode || 'UN'}</span>
                          </div>
                       </td>
                       <td className="py-4 text-xs font-black text-slate-500 uppercase">{session.device || 'Desktop'}</td>
                       <td className="py-4">
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg border border-indigo-100 font-mono">
                             {session.path || '/'}
                          </span>
                       </td>
                       <td className="py-4 text-xs font-medium text-slate-400">
                          {session.lastActive?.toDate?.().toLocaleTimeString() || 'Active'}
                       </td>
                    </tr>
                  ))}
                  {activeSessions.length === 0 && (
                    <tr>
                       <td colSpan={5} className="py-20 text-center">
                          <p className="text-xs font-bold text-slate-300 uppercase italic">Awaiting node authentication...</p>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

