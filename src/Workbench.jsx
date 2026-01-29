import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Shield, Folder, File, HardDrive, Layout, Activity, Clock, Box } from 'lucide-react';
import axios from 'axios';

const Workbench = () => {
  const [activeTab, setActiveTab] = useState('telemetry');
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState({ cpu: 0, memory: 0, uptime: 0, load: 0, latency: 0 });
  const [workspace, setWorkspace] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, workspaceRes] = await Promise.all([
          axios.get('/api/stats'),
          axios.get('/api/workspace')
        ]);
        setMetrics(statsRes.data);
        setWorkspace(workspaceRes.data.items);
      } catch (e) {
        console.error("DATA_SYNC_ERROR");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    
    setLogs([
      "BOOT_SEQUENCE_COMPLETE",
      "CORE_INTERFACE_STABLE",
      "WORKSPACE_MOUNTED: /data/workspace",
      "SYNC_ENGINE: GITHUB_PUSH_READY"
    ]);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen bg-[#020617] text-slate-400 font-mono text-[10px] uppercase tracking-widest selection:bg-cyan-500/20 flex flex-col overflow-hidden">
      {/* Top Protocol Bar */}
      <nav className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-2xl z-50">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 bg-cyan-500 shadow-[0_0_15px_cyan] rounded-[1px]"></div>
            <span className="text-sm font-black text-slate-100 tracking-tighter italic">MEEP.WORKBENCH v2.0</span>
          </div>
          <span className="text-slate-700 font-bold border-l border-white/10 pl-6">INST_075C4 // LIVE</span>
        </div>
        
        <div className="flex items-center space-x-12">
          <div className="flex flex-col items-end space-y-0.5">
            <span className="text-[8px] text-slate-600 font-black">LATENCY</span>
            <span className="text-cyan-500 font-bold tabular-nums">{metrics.latency}MS</span>
          </div>
          <div className="w-px h-6 bg-white/5"></div>
          <div className="flex flex-col items-end space-y-0.5">
            <span className="text-[8px] text-slate-600 font-black">UPTIME</span>
            <span className="text-slate-100 font-bold tabular-nums">{metrics.uptime}S</span>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 border-r border-white/5 flex flex-col p-4 space-y-1 bg-black/10">
          {[
            { id: 'telemetry', icon: Activity },
            { id: 'workspace', icon: Folder },
            { id: 'terminal', icon: Terminal },
            { id: 'security', icon: Shield }
          ].map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full text-left px-5 py-4 flex items-center justify-between group transition-all duration-300 ${
                activeTab === id ? 'bg-white text-slate-900 font-black' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-4">
                <Icon size={14} strokeWidth={2.5} />
                <span>{id}</span>
              </div>
              <div className={`w-1 h-3 bg-cyan-500 scale-y-0 group-hover:scale-y-100 transition-transform ${activeTab === id ? 'hidden' : ''}`} />
            </button>
          ))}
          
          <div className="mt-auto p-4 border border-white/5 space-y-4">
            <div className="space-y-2 text-[8px] font-black tracking-widest text-slate-600 uppercase">
              <span>Core Saturation</span>
              <div className="w-full h-[1px] bg-slate-900 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: metrics.cpu + '%' }}
                  className="h-full bg-cyan-500 absolute left-0"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Interface Layout */}
        <main className="flex-grow relative overflow-y-auto p-10 bg-grid-slate-900/[0.04]">
          <AnimatePresence mode="wait">
            {activeTab === 'telemetry' && (
              <motion.div
                key="telemetry"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="grid grid-cols-12 gap-10 h-full content-start"
              >
                <div className="col-span-12">
                  <header className="mb-8">
                    <h2 className="text-[9px] font-black text-cyan-500 tracking-[0.5em] mb-4">Industrial_Strength_Intelligence</h2>
                    <h1 className="text-6xl font-black text-slate-100 tracking-tighter leading-none italic uppercase">System_State<span className="text-cyan-500">.</span></h1>
                  </header>
                </div>

                <div className="col-span-8 space-y-10">
                  <div className="p-10 bg-slate-900/20 border border-white/5 relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-12 h-px bg-cyan-500/50"></div>
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-[9px] font-black text-slate-600 tracking-[0.3em]">Ambient_Signal_Load</h3>
                      <Box className="w-3 h-3 text-cyan-500/30" />
                    </div>
                    <div className="h-32 flex items-end space-x-1.5 grayscale opacity-50 contrast-125">
                      {[...Array(40)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: Math.random() * 100 + '%' }}
                          transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
                          className="flex-grow bg-cyan-500/40 border-t border-cyan-400/20"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 sticky bottom-0">
                    <div className="p-8 border border-white/5 bg-slate-950/40 relative">
                       <Clock size={12} className="absolute top-4 right-4 text-slate-800" />
                       <span className="text-[8px] font-black text-slate-700 mb-2 block tracking-widest uppercase">System_Load</span>
                       <p className="text-lg font-bold text-slate-300 tabular-nums italic lowercase tracking-tighter tracking-widest">{metrics.load}<span className="text-cyan-500 opacity-50 ml-1 italic font-black text-[10px]">AVG</span></p>
                    </div>
                    <div className="p-8 border border-white/5 bg-slate-950/40 relative">
                       <HardDrive size={12} className="absolute top-4 right-4 text-slate-800" />
                       <span className="text-[8px] font-black text-slate-700 mb-2 block tracking-widest uppercase">Mem_Allocation</span>
                       <p className="text-lg font-bold text-slate-300 tabular-nums italic text-slate-100">{metrics.memory}<span className="text-cyan-500/50 ml-1 italic font-black text-[10px]">MB</span></p>
                    </div>
                  </div>
                </div>

                <div className="col-span-4 p-8 border border-white/5 bg-slate-950/20 flex flex-col">
                  <span className="text-[8px] font-black text-slate-700 tracking-[0.4em] mb-8">Core_Protocol_Logs</span>
                  <div className="space-y-4 font-mono text-[9px] text-cyan-500/40 tracking-widest">
                    {logs.map((log, i) => (
                      <p key={i} className="animate-in fade-in slide-in-from-left duration-500 leading-relaxed border-l-2 border-cyan-500/10 pl-4 uppercase">> {log}</p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'workspace' && (
              <motion.div
                key="workspace"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <header>
                  <h2 className="text-[9px] font-black text-cyan-500 tracking-[0.5em] mb-4">Workspace_Mapping</h2>
                  <h1 className="text-5xl font-black text-slate-100 tracking-tighter italic">DIRECT_FILESYSTEM<span className="text-cyan-500">.</span></h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workspace.map((item, i) => (
                    <div key={i} className="p-6 bg-slate-900/20 border border-white/5 flex items-center space-x-5 hover:border-white/20 transition-all cursor-crosshair group">
                      {item.isDirectory ? <Folder className="text-cyan-500 w-5 h-5 shadow-[0_0_10px_rgba(34,211,238,0.2)]" /> : <File className="text-slate-600 w-5 h-5 group-hover:text-slate-400" />}
                      <div className="overflow-hidden">
                        <p className="text-slate-200 font-bold truncate tracking-widest leading-none mb-1">{item.name}</p>
                        <p className="text-[8px] text-slate-700 italic tracking-[0.2em]">{(item.size / 1024).toFixed(1)}KB // {(new Date(item.mtime)).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Extreme Footer */}
      <footer className="h-14 border-t border-white/5 bg-black px-12 flex justify-between items-center text-[8px] font-black tracking-[0.4em] text-slate-800">
        <div className="flex space-x-12 italic">
          <span className="text-slate-700">OS: MEEP_KERNEL_V2</span>
          <span>PLATFORM: RAILWAY</span>
          <span>DEPLOY: GITHUB_AUTO</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-ping"></div>
          <span>AUTONOMY_LEVEL: ABSOLUTE</span>
        </div>
      </footer>
      
      {/* Atmospheric Glow */}
      <div className="fixed -bottom-64 -right-64 w-[800px] h-[800px] bg-cyan-500/5 blur-[160px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
    </div>
  );
};

export default Workbench;
