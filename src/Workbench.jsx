import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Shield, Folder, File, HardDrive, Box, Activity, Clock, Lock, Unlock, AlertTriangle, ArrowRight } from 'lucide-react';
import axios from 'axios';

const Workbench = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('telemetry');
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState({ cpu: 0, memory: 0, uptime: 0, load: 0, latency: 0 });
  const [workspace, setWorkspace] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', { password });
      localStorage.setItem('meep_token', res.data.token);
      setIsAuthenticated(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'ACCESS_DENIED');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('meep_token');
    if (token) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem('meep_token');
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    const fetchData = async () => {
      try {
        const [statsRes, workspaceRes] = await Promise.all([
          axios.get('/api/stats', authHeaders),
          axios.get('/api/workspace', authHeaders)
        ]);
        setMetrics(statsRes.data);
        setWorkspace(workspaceRes.data.items);
      } catch (e) {
        if (e.response?.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem('meep_token');
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="w-screen h-screen bg-[#020617] text-slate-400 font-mono text-[10px] uppercase tracking-widest flex items-center justify-center p-6 italic overflow-hidden">
        <div className="noise fixed top-0 left-0 w-full h-full opacity-5 pointer-events-none" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm space-y-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 bg-red-500 shadow-[0_0_15px_red] rounded-[1px]"></div>
              <span className="text-sm font-black text-slate-100 tracking-tighter">MEEP.SECURED</span>
            </div>
            <p className="text-[9px] text-slate-600 tracking-[0.3em]">Access Restricted // Unit_075C4</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600 group-focus-within:text-cyan-500 transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ENTER_PROTOCOL_KEY" 
                className="w-full bg-slate-950 border border-white/5 py-5 pl-12 pr-6 text-slate-100 outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-800"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-cyan-500 transition-colors">
                <ArrowRight size={16} />
              </button>
            </div>
            {error && (
              <div className="flex items-center space-x-2 text-red-500/60 animate-pulse">
                <AlertTriangle size={10} />
                <span className="text-[8px] font-black tracking-[0.2em]">{error}</span>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-[#020617] text-slate-400 font-mono text-[10px] uppercase tracking-widest selection:bg-cyan-500/20 flex flex-col overflow-hidden">
      <nav className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-2xl z-50">
        <div className="flex items-center space-x-6">
          <span className="text-sm font-black text-slate-100 tracking-tighter italic">MEEP.WORKBENCH // V2.1</span>
          <span className="text-[8px] text-slate-800 bg-white px-2 py-0.5 font-black hidden lg:block">ENCRYPTED</span>
        </div>
        
        <div className="flex items-center space-x-12">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[8px] text-slate-600 font-black">LATENCY</span>
            <span className="text-cyan-500 font-bold tabular-nums">{metrics.latency}MS</span>
          </div>
          <button onClick={() => { localStorage.removeItem('meep_token'); setIsAuthenticated(false); }} className="p-2 hover:text-white transition-colors border border-white/5 bg-white/5">
            <Unlock size={14} />
          </button>
        </div>
      </nav>

      <div className="flex-grow flex overflow-hidden">
        <aside className="w-56 border-r border-white/5 flex flex-col p-4 bg-black/10">
          {[
            { id: 'telemetry', icon: Activity },
            { id: 'workspace', icon: Folder },
            { id: 'security', icon: Shield }
          ].map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full text-left px-5 py-4 flex items-center space-x-4 transition-all duration-300 ${
                activeTab === id ? 'bg-white text-slate-900 font-black' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon size={12} strokeWidth={2.5} />
              <span>{id}</span>
            </button>
          ))}
        </aside>

        <main className="flex-grow relative overflow-y-auto p-10">
          <AnimatePresence mode="wait">
            {activeTab === 'telemetry' && (
              <motion.div key="telemetry" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                <header>
                    <h1 className="text-5xl font-black text-slate-100 tracking-tighter italic uppercase underline decoration-cyan-500/20 underline-offset-8">SYSTEM_CORE<span className="text-cyan-500">.</span></h1>
                </header>
                <div className="grid grid-cols-2 gap-10">
                  <div className="p-8 border border-white/5 bg-slate-900/10">
                    <span className="text-[8px] text-slate-700 block mb-4">Core_Saturation</span>
                    <div className="h-40 flex items-end space-x-1 grayscale opacity-50">
                      {[...Array(20)].map((_, i) => (
                        <motion.div key={i} animate={{ height: Math.random() * 100 + '%' }} transition={{ repeat: Infinity, duration: 2 }} className="flex-grow bg-cyan-500" />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="p-8 border border-white/5 bg-slate-900/10">
                      <span className="text-[8px] text-slate-700 block mb-2 tracking-[0.2em]">MEM_UTILIZATION</span>
                      <p className="text-2xl font-black text-slate-100 tabular-nums">{metrics.memory}<span className="text-[10px] ml-2 text-cyan-500/50">MB</span></p>
                    </div>
                    <div className="p-8 border border-white/5 bg-slate-900/10 flex items-center justify-between">
                      <span className="text-[8px] text-slate-700 block tracking-[0.2em]">UPTIME_REF</span>
                      <p className="text-xl font-bold text-slate-500 tabular-nums lowercase tracking-tighter">{metrics.uptime}S</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'workspace' && (
              <motion.div key="workspace" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <h1 className="text-3xl font-black text-slate-100 tracking-tighter uppercase italic">Filesystem_Nexus</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {workspace.map((item, i) => (
                    <div key={i} className="p-5 bg-slate-950/40 border border-white/5 flex items-center space-x-4 hover:border-cyan-500/20 transition-colors">
                      <item.isDirectory ? <Folder size={12} className="text-cyan-500" /> : <File size={12} className="text-slate-600" />}
                      <span className="text-[9px] font-bold text-slate-300 truncate tracking-widest">{item.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <footer className="h-12 border-t border-white/5 flex items-center px-10 text-[8px] text-slate-800 font-black tracking-[0.5em] space-x-12 opacity-50 grayscale">
          <span>PROTO: MEEP_KRNL_V2</span>
          <span>SYNC: GitHub_Active</span>
          <span>UNIT: 075C4</span>
      </footer>
    </div>
  );
};

export default Workbench;
