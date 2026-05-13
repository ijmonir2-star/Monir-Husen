import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Search, 
  Settings, 
  Tv, 
  Globe, 
  LayoutGrid, 
  ArrowLeft,
  Wifi,
  Clock,
  Battery,
  User
} from 'lucide-react';

// Configuration
const DEFAULT_URL = "http://10.20.30.40/";
const APPS = [
  { id: 'app-site', title: 'Home Services', icon: <Globe className="w-12 h-12" />, url: DEFAULT_URL, color: 'bg-indigo-600', desc: "Access your local dashboard and control center." },
  { id: 'app-tv', title: 'Media Center', icon: <Tv className="w-12 h-12" />, url: '#', color: 'bg-rose-600', desc: "Stream locally hosted movies and live television channels." },
  { id: 'app-grid', title: 'Applications', icon: <LayoutGrid className="w-12 h-12" />, url: '#', color: 'bg-violet-600', desc: "Explore and manage your installed smart TV applications." },
  { id: 'app-search', title: 'Global Search', icon: <Search className="w-12 h-12" />, url: '#', color: 'bg-teal-600', desc: "Search across all services and the open web." },
  { id: 'app-settings', title: 'TV Settings', icon: <Settings className="w-12 h-12" />, url: '#', color: 'bg-zinc-700', desc: "Configure network, display, and advanced system preferences." },
];

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'browser'>('home');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [targetUrl, setTargetUrl] = useState(DEFAULT_URL);
  const [time, setTime] = useState(new Date());

  // Boot sequence
  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Clock update
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle D-Pad Navigation (Keyboard Map)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isBooting) return;
      
      if (activeTab === 'browser') {
        if (e.key === 'Backspace' || e.key === 'Escape') {
          setActiveTab('home');
        }
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'd':
          setSelectedIndex((prev) => Math.min(prev + 1, APPS.length - 1));
          break;
        case 'ArrowLeft':
        case 'a':
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
        case ' ':
          const selectedApp = APPS[selectedIndex];
          if (selectedApp.id === 'app-site') {
            setActiveTab('browser');
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, selectedIndex, isBooting]);

  return (
    <div className="h-screen w-screen bg-[#050505] text-white font-sans overflow-hidden select-none">
      <AnimatePresence>
        {isBooting ? (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-8"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
            />
            <h1 className="font-display text-4xl tracking-[0.5em] uppercase text-white/80">TV Launcher Pro</h1>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeTab === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full flex flex-col justify-end p-20 pb-32"
          >
            {/* Atmospheric Backgrounds */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <div 
                className="absolute top-[-20%] left-[-10%] w-[120%] h-[140%] opacity-40 blur-[120px]"
                style={{
                  background: `radial-gradient(circle at 50% 50%, #171717 0%, #000 70%)`,
                }}
              />
              <motion.div 
                key={selectedIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 1 }}
                className={`absolute inset-0 transition-opacity duration-1000`}
                style={{
                  background: `radial-gradient(circle at 10% 80%, ${APPS[selectedIndex].color.split('-')[1] === 'rose' ? '#fb7185' : APPS[selectedIndex].color.split('-')[1] === 'indigo' ? '#818cf8' : APPS[selectedIndex].color.split('-')[1] === 'violet' ? '#a78bfa' : APPS[selectedIndex].color.split('-')[1] === 'teal' ? '#2dd4bf' : '#71717a'} 0%, transparent 50%)`
                }}
              />
            </div>

            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-12 flex justify-between items-center z-20">
              <div className="flex items-center gap-8">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg flex items-center gap-2 border border-white/5">
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase">User Control</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <Wifi className="w-5 h-5 text-zinc-500 transition-colors group-hover:text-blue-400" />
                  <span className="text-xs font-bold text-zinc-500 tracking-widest group-hover:text-white uppercase transition-colors">Connected</span>
                </div>
                <div className="h-4 w-[1px] bg-white/10" />
                <div className="flex items-center gap-3 bg-white/5 px-4 py-1 rounded-full border border-white/5">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <span className="text-2xl font-mono tracking-tighter text-white/90">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="z-10 mb-16 max-w-4xl">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                   <div className="px-3 py-1 bg-white text-black font-black text-xs tracking-widest uppercase rounded">4K ULTRA HD</div>
                   <div className="px-3 py-1 border border-white/20 text-white/60 font-medium text-xs tracking-widest uppercase rounded">PRO DASHBOARD</div>
                </div>
                <h1 className="font-display text-[10rem] font-bold tracking-tighter leading-[0.8] uppercase">
                  {APPS[selectedIndex].title}
                </h1>
                <p className="text-zinc-500 text-2xl max-w-2xl leading-relaxed font-light">
                  {APPS[selectedIndex].desc}
                </p>
                <div className="flex items-center gap-4 text-white/40 pt-4">
                   <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded border border-white/5">
                      <span className="text-[10px] font-black border border-white/20 px-1 rounded">ENTER</span>
                      <span className="text-xs font-bold tracking-widest uppercase">Select App</span>
                   </div>
                   <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded border border-white/5">
                      <span className="text-[10px] font-black border border-white/20 px-1 rounded">ARROWS</span>
                      <span className="text-xs font-bold tracking-widest uppercase">Navigate</span>
                   </div>
                </div>
              </motion.div>
            </div>

            {/* App Grid / Launcher */}
            <div className="flex gap-8 z-10 overflow-visible h-52 items-end pt-10">
              {APPS.map((app, index) => (
                <motion.button
                  key={app.id}
                  onClick={() => {
                    setSelectedIndex(index);
                    if (app.id === 'app-site') setActiveTab('browser');
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  animate={{
                    scale: selectedIndex === index ? 1.2 : 1,
                    y: selectedIndex === index ? -15 : 0,
                    zIndex: selectedIndex === index ? 20 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`
                    relative group flex flex-col items-center justify-center
                    w-52 h-32 rounded-3xl transition-all duration-400
                    ${selectedIndex === index ? `${app.color} shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]` : 'bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10'}
                  `}
                >
                  <div className={`transition-transform duration-500 ${selectedIndex === index ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}>
                    {app.icon}
                  </div>
                  
                  {/* Focus Glow / Active Marker */}
                  <AnimatePresence>
                    {selectedIndex === index && (
                      <motion.div
                        layoutId="focus-ring"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-[-6px] rounded-[30px] border-4 border-white pointer-events-none"
                      />
                    )}
                  </AnimatePresence>

                  {/* Reflection Effect */}
                  <div className="absolute inset-x-4 bottom-[-20px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="browser"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            {/* Browser Controls */}
            <div className="h-14 bg-zinc-900/80 backdrop-blur-md flex items-center px-8 gap-10 border-b border-white/5">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveTab('home')}
                  className="px-4 py-1.5 bg-white text-black rounded text-xs font-black tracking-widest uppercase hover:bg-zinc-200 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  EXIT WEBSITE
                </button>
              </div>
              <div className="flex-1 bg-black/50 rounded h-10 flex items-center px-6 text-white/50 text-xs font-mono border border-white/10">
                <Globe className="w-4 h-4 mr-3 text-blue-500" />
                {targetUrl}
              </div>
              <div className="hidden md:flex items-center gap-6 text-zinc-500">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded">
                   <span className="text-[10px] font-black border border-white/20 px-1 rounded leading-none">ESC</span>
                   <span className="text-[10px] font-bold uppercase tracking-widest">To Exit</span>
                </div>
                <span className="text-sm font-mono text-white/80">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
              </div>
            </div>

            {/* Iframe content */}
            <div className="flex-1 relative bg-white">
              <iframe 
                src={targetUrl}
                className="absolute inset-0 w-full h-full border-none"
                title="Browser Content"
                allow="autoplay; fullscreen"
                referrerPolicy="no-referrer"
              />
              
              {/* Privacy/Secure Indicator */}
              <div className="absolute top-4 right-4 bg-zinc-900/90 py-1.5 px-4 rounded-full border border-white/10 flex items-center gap-2 pointer-events-none">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">Live Stream Protected</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { cursor: none !important; }
        body { background: black; overflow: hidden; }
        :focus { outline: none; }
      `}</style>
    </div>
  );
}
