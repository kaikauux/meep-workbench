import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Zap, Activity, Shield, Hash, Search, Save } from 'lucide-react';

const MeepWorkbench = () => {
  const [activeTab, setActiveTab] = useState('telemetry');
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState({ cpu: 0, ram: 0 });

  useEffect(() => {
    const logInterval = setInterval(() => {
      const messages = [
        "KERNEL_ESTABLISHED // SYNC_OK",
        "DETECTING HIGH_TASTE_INPUT...",
        "AUTONOMY_CELLS_LIVE",
        "PROTOCOL_V5_ENABLED",
        "RESOURCE_SATURATION: 1.2%"
      ];
      setLogs(prev => [messages[Math.floor(Math.random() * messages.length)], ...prev].slice(0, 10));
    }, 3000);

    const metricsInterval = setInterval(() => {
      setMetrics({
        cpu: (Math.random() * 20 + 2).toFixed(1),
        ram: (Math.random() * 50 + 128).toFixed(0)
      });
    }, 2000);

    return () => {
      clearInterval(logInterval);
      clearInterval(metricsInterval);
    };
  }, []);

  return (
    <div className="flex-grow flex flex-col font-mono text-[11px] uppercase tracking-wider text-slate-400 p-6 lg:p-12 relative overflow-hidden selection:bg-cyan-500/20 w-screen h-screen">
      <div className="mb-12 flex justify-between items-end border-b border-white/5 pb-8">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
            <h1 className="text-xl font-black text-slate-100 italic tracking-tighter">MEEP.WORKBENCH // V1.0</h1>
          </div>
          <p className="text-[9px] text-slate-600 tracking-[0.3em]">Industrial Execution Instance</p>
        </div>
        <div className="flex space-x-12">
          <div className="text-right">
            <span className="block text-[8px] text-slate-700">CORE_LOAD</span>
            <span className="text-cyan-500 font-bold tabular-nums">{metrics.cpu}%</span>
          </div>
          <div className="text-right border-l border-white/5 pl-12">
            <span className="block text-[8px] text-slate-700">MEM_UTIL</span>
            <span className="text-slate-100 font-bold tabular-nums">{metrics.ram}MB</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
        <aside className="space-y-2 lg:col-span-1">
          {['telemetry', 'fabrication', 'terminal', 'security'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-6 py-4 transition-all duration-200 border border-transparent flex items-center justify-between group ${
                activeTab === tab ? 'bg-white text-slate-950 font-black' : 'hover:border-white/10'
              }`}
            >
              <span>{tab}</span>
              <span className={activeTab === tab ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}>-></span>
            </button>
          ))}
        </aside>

        <main className="lg:col-span-3 bg-slate-900/10 border border-white/5 p-8 relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'telemetry' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h3 className="text-[9px] font-black text-slate-700 tracking-[0.4em]">Signal_Flow</h3>
                    <div className="h-24 flex items-end space-x-1">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: Math.random() * 100 + '%' }}
                          className="flex-grow bg-cyan-500/20"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-[9px] font-black text-slate-700 tracking-[0.4em]">Auth_Status</h3>
                    <div className="p-4 bg-slate-950/50 border border-white/5 flex items-center space-x-4">
                      <Shield className="text-cyan-500 w-4 h-4" />
                      <span className="text-slate-100 text-xs italic">Encrypted_Sync_Active</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[9px] font-black text-slate-700 tracking-[0.4em]">Protocol_Output</h3>
                  <div className="bg-black/20 p-6 h-64 overflow-hidden space-y-2 border border-white/5">
                    {logs.map((log, i) => (
                      <p key={i} className="text-[10px] text-cyan-500/50 italic tracking-widest leading-relaxed">> {log}</p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute top-0 right-0 p-8 flex space-x-4 text-slate-800">
             <Hash className="w-3 h-3" />
             <Cpu className="w-3 h-3" />
             <Activity className="w-3 h-3" />
          </div>
        </main>
      </div>

      <footer className="mt-12 flex justify-between items-center text-[9px] border-t border-white/5 pt-8 opacity-40 grayscale hover:opacity-100 transition-all duration-700">
        <div className="flex space-x-12">
          <span>HOST: RAILWAY_PLATFORM</span>
          <span>SYNC: GITHUB_MODULAR</span>
          <span>ENGINE: VITE_REACT</span>
        </div>
        <span className="font-black italic">AUTO_UNIT_Workbench-X8</span>
      </footer>
      
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
    </div>
  );
};

export default MeepWorkbench;
