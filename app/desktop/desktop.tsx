"use client";

import { useState, useRef, useEffect } from "react";
import { useSystem } from "../system/system-context";
import { Button } from "@/components/ui/button";
import { LogOut, Terminal, User, Folder, Settings, X, Minus, Square } from "lucide-react";

interface IconPosition {
  id: string;
  x: number;
  y: number;
  label: string;
  icon: React.ReactNode;
}

interface WindowData {
  id: string;
  title: string;
  isOpen: boolean;
  x: number;
  y: number;
  zIndex: number;
  content: React.ReactNode;
}

export default function Desktop() {
  const { setState } = useSystem();
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [windows, setWindows] = useState<WindowData[]>([
    {
      id: "identity",
      title: "IDENTITY_PROFILE",
      isOpen: false,
      x: 100,
      y: 100,
      zIndex: 10,
      content: (
        <div className="space-y-4 font-mono text-xs text-emerald-500/90">
          <div className="p-3 border border-emerald-500/20 bg-emerald-500/5 rounded">
            <p className="text-emerald-400 font-bold mb-2 uppercase tracking-wider"> Subject_Profile</p>
            <p><span className="text-zinc-500">NAME:</span> Jan Doe</p>
            <p><span className="text-zinc-500">ROLE:</span> Full Stack Developer / Cyber Security Enthusiast</p>
            <p><span className="text-zinc-500">LOCATION:</span> Secure_Node_01</p>
          </div>
          <div className="p-3 border border-emerald-500/20 bg-emerald-500/5 rounded">
            <p className="text-emerald-400 font-bold mb-2 uppercase tracking-wider">Bio_Data</p>
            <p>A passionate developer focused on building secure, scalable, and high-performance applications. Specialized in modern web technologies and defensive security practices.</p>
          </div>
        </div>
      ),
    },
    {
      id: "encrypted",
      title: "PROJECT_ARCHIVES",
      isOpen: false,
      x: 150,
      y: 150,
      zIndex: 10,
      content: (
        <div className="space-y-4 font-mono text-xs text-blue-500/90">
          <div className="p-3 border border-blue-500/20 bg-blue-500/5 rounded">
            <p className="text-blue-400 font-bold mb-2 uppercase tracking-wider"> active_nodes</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-blue-500/10 pb-1">
                <span>Project_Alpha</span>
                <span className="text-[10px] bg-blue-500/20 px-1">DEPLOYED</span>
              </div>
              <div className="flex justify-between items-center border-b border-blue-500/10 pb-1">
                <span>Cyber_Shield</span>
                <span className="text-[10px] bg-emerald-500/20 px-1 text-emerald-400">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center border-b border-blue-500/10 pb-1">
                <span>Neural_Net_v2</span>
                <span className="text-[10px] bg-amber-500/20 px-1 text-amber-400">ENCRYPTED</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "terminal",
      title: "ROOT_TERMINAL",
      isOpen: false,
      x: 200,
      y: 200,
      zIndex: 10,
      content: (
        <div className="bg-black/80 p-4 h-full font-mono text-xs text-emerald-500">
          <p className="mb-2">Last login: {new Date().toLocaleDateString()} on ttys001</p>
          <p className="flex gap-2">
            <span className="text-emerald-400">root@system:~$</span>
            <span className="animate-pulse">_</span>
          </p>
          <div className="mt-4 text-zinc-600">
            <p>Available commands:</p>
            <p>- status : Check system integrity</p>
            <p>- logs   : View security logs</p>
            <p>- bypass : [REDACTED]</p>
          </div>
        </div>
      ),
    },
    {
      id: "settings",
      title: "CORE_SETTINGS",
      isOpen: false,
      x: 250,
      y: 250,
      zIndex: 10,
      content: (
        <div className="space-y-4 font-mono text-xs text-zinc-400">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 border border-zinc-800 rounded">
              <span>Dark_Mode</span>
              <div className="w-8 h-4 bg-emerald-500/20 rounded-full relative">
                <div className="absolute right-1 top-1 w-2 h-2 bg-emerald-500 rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between p-2 border border-zinc-800 rounded">
              <span>Encryption_Level</span>
              <span className="text-emerald-500">AES-256</span>
            </div>
            <div className="flex items-center justify-between p-2 border border-zinc-800 rounded">
              <span>System_Volume</span>
              <div className="w-24 h-1 bg-zinc-800 rounded-full relative">
                <div className="absolute left-0 top-0 w-3/4 h-full bg-blue-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]);

  const [icons, setIcons] = useState<IconPosition[]>([
    {
      id: "identity",
      x: 24,
      y: 24,
      label: "Identity",
      icon: <User className="w-8 h-8 text-emerald-400" />,
    },
    {
      id: "encrypted",
      x: 24,
      y: 144,
      label: "Encrypted projects",
      icon: <Folder className="w-8 h-8 text-blue-400" />,
    },
    {
      id: "terminal",
      x: 24,
      y: 264,
      label: "Root Terminal",
      icon: <Terminal className="w-8 h-8 text-emerald-500" />,
    },
    {
      id: "settings",
      x: 24,
      y: 384,
      label: "Core Settings",
      icon: <Settings className="w-8 h-8 text-zinc-400" />,
    },
  ]);

  const draggingIconId = useRef<string | null>(null);
  const draggingWindowId = useRef<string | null>(null);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const icon = icons.find((i) => i.id === id);
    if (icon) {
      draggingIconId.current = id;
      offset.current = {
        x: e.clientX - icon.x,
        y: e.clientY - icon.y,
      };
    }
  };

  const handleWindowMouseDown = (e: React.MouseEvent, id: string) => {
    const window = windows.find((w) => w.id === id);
    if (window) {
      draggingWindowId.current = id;
      offset.current = {
        x: e.clientX - window.x,
        y: e.clientY - window.y,
      };
      
      // Bring to front
      setWindows((prev) => {
        const maxZ = Math.max(...prev.map((w) => w.zIndex), 10);
        return prev.map((w) => 
          w.id === id ? { ...w, zIndex: maxZ + 1 } : w
        );
      });
    }
  };

  const handleWindowOpen = (id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 10);
      return prev.map((w) =>
        w.id === id ? { ...w, isOpen: true, zIndex: maxZ + 1 } : w
      );
    });
  };

  const handleWindowClose = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w))
    );
  };

  const handleStartMenu = () => {
    setIsStartMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingIconId.current) {
        setIcons((prev) =>
          prev.map((icon) =>
            icon.id === draggingIconId.current
              ? {
                  ...icon,
                  x: e.clientX - offset.current.x,
                  y: e.clientY - offset.current.y,
                }
              : icon
          )
        );
      } else if (draggingWindowId.current) {
        setWindows((prev) =>
          prev.map((window) =>
            window.id === draggingWindowId.current
              ? {
                  ...window,
                  x: e.clientX - offset.current.x,
                  y: e.clientY - offset.current.y,
                }
              : window
          )
        );
      }
    };

    const handleMouseUp = () => {
      draggingIconId.current = null;
      draggingWindowId.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Cybersecurity Background Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Digital Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:128px_128px]" />

        {/* Glowing Accents */}
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[5%] w-[30%] h-[30%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full" />

        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20" />
      </div>

      {/* Desktop Icons Container */}
      <div className="relative flex-1 p-0 overflow-hidden" onClick={() => isStartMenuOpen && setIsStartMenuOpen(false)}>
        {icons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            icon={icon.icon}
            label={icon.label}
            x={icon.x}
            y={icon.y}
            onMouseDown={(e) => handleMouseDown(e, icon.id)}
            onDoubleClick={() => handleWindowOpen(icon.id)}
          />
        ))}

        {/* Windows */}
        {windows.map((window) => (
          <Window
            key={window.id}
            title={window.title}
            isOpen={window.isOpen}
            x={window.x}
            y={window.y}
            zIndex={window.zIndex}
            onClose={() => handleWindowClose(window.id)}
            onMouseDown={(e) => handleWindowMouseDown(e, window.id)}
          >
            {window.content}
          </Window>
        ))}

        {/* Start Menu */}
        {isStartMenuOpen && (
          <div className="absolute bottom-4 left-4 w-64 bg-zinc-900/90 border border-emerald-500/30 backdrop-blur-xl rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.1)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 z-50">
            <div className="p-4 border-b border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-emerald-500/50 flex items-center justify-center bg-zinc-950">
                  <User className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-mono text-emerald-500 font-bold">JD_ADMIN</p>
                  <p className="text-[10px] font-mono text-zinc-500">LEVEL: ROOT</p>
                </div>
              </div>
            </div>
            
            <div className="p-2 py-3 space-y-1">
              <StartMenuItem 
                icon={<Terminal className="w-4 h-4" />} 
                label="System Terminal" 
                onClick={() => {
                  handleWindowOpen("terminal");
                  setIsStartMenuOpen(false);
                }}
              />
              <StartMenuItem 
                icon={<Folder className="w-4 h-4" />} 
                label="File Explorer" 
                onClick={() => {
                  handleWindowOpen("encrypted");
                  setIsStartMenuOpen(false);
                }}
              />
              <StartMenuItem 
                icon={<Settings className="w-4 h-4" />} 
                label="Network Config" 
                onClick={() => {
                  handleWindowOpen("settings");
                  setIsStartMenuOpen(false);
                }}
              />
              <div className="h-px bg-emerald-500/10 my-2" />
              <StartMenuItem 
                icon={<User className="w-4 h-4" />} 
                label="Identity Profile" 
                onClick={() => {
                  handleWindowOpen("identity");
                  setIsStartMenuOpen(false);
                }}
              />
              <div className="h-px bg-emerald-500/10 my-2" />
              <StartMenuItem 
                icon={<LogOut className="w-4 h-4 text-red-400" />} 
                label="Terminate Session" 
                onClick={() => {
                  sessionStorage.removeItem("booted");
                  sessionStorage.removeItem("loggedIn");
                  setState("booting");
                }}
                className="text-red-400/70 hover:text-red-400 hover:bg-red-400/10"
              />
            </div>
            
            <div className="p-2 bg-zinc-950/50 text-[9px] font-mono text-zinc-600 flex justify-between items-center px-4">
              <span>OS_VERSION: 1.0.4</span>
              <span className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500" /> ONLINE
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Taskbar */}
      <div className="relative h-12 bg-zinc-900/80 border-t border-zinc-800 backdrop-blur-md flex items-center px-1 gap-1">
        <Button
          variant="ghost"
          className="h-10 text-emerald-500 font-mono font-bold px-4 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-500/30"
            onClick={handleStartMenu}
        >
          <span className="mr-2">⚡</span> SYSTEM
        </Button>

        <div className="flex-1" />

        <div className="h-10 px-4 bg-zinc-950/50 border border-zinc-800 rounded-md flex items-center gap-4 text-xs font-mono text-emerald-500/70">
          <div className="flex items-center gap-2 border-r border-zinc-800 pr-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SECURE_LINK: ESTABLISHED</span>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem("booted");
              sessionStorage.removeItem("loggedIn");
              setState("booting");
            }}
            className="hover:text-red-500 transition-colors flex items-center gap-2"
            title="Terminate Session"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">EXIT_OS</span>
          </button>
          <span className="text-zinc-500 ml-2">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

function Window({
  title,
  children,
  isOpen,
  x,
  y,
  zIndex,
  onClose,
  onMouseDown,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  x: number;
  y: number;
  zIndex: number;
  onClose: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute transition-transform min-w-[320px] min-h-[200px] bg-zinc-900/90 border border-zinc-800 rounded-lg shadow-2xl flex flex-col backdrop-blur-xl animate-in zoom-in-95 fade-in duration-200 overflow-hidden"
      style={{ left: x, top: y, zIndex }}
    >
      {/* Window Header */}
      <div
        className="h-9 bg-zinc-950/50 border-b border-zinc-800 flex items-center justify-between px-3 cursor-move select-none"
        onMouseDown={onMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
          <span className="text-[10px] font-mono text-zinc-400 font-bold tracking-widest uppercase">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-zinc-800 rounded transition-colors group">
            <Minus className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
          </button>
          <button className="p-1 hover:bg-zinc-800 rounded transition-colors group">
            <Square className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 hover:bg-red-500/20 rounded transition-colors group"
          >
            <X className="w-3 h-3 text-zinc-600 group-hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        {children}
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-zinc-950/30 border-t border-zinc-800/50 flex items-center px-3 justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono text-zinc-600 uppercase">Status: </span>
          <span className="text-[8px] font-mono text-emerald-500/70 uppercase animate-pulse">Synced</span>
        </div>
        <span className="text-[8px] font-mono text-zinc-600">SECURE_ENV</span>
      </div>
    </div>
  );
}

function StartMenuItem({ 
  icon, 
  label, 
  onClick, 
  className 
}: { 
  icon: React.ReactNode, 
  label: string, 
  onClick?: () => void,
  className?: string
}) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-mono text-emerald-500/80 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-all group ${className}`}
    >
      <span className="group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

function DesktopIcon({ 
  icon, 
  label, 
  x, 
  y, 
  onMouseDown,
  onDoubleClick
}: { 
  icon: React.ReactNode, 
  label: string, 
  x: number, 
  y: number, 
  onMouseDown: (e: React.MouseEvent) => void,
  onDoubleClick: () => void
}) {
  return (
    <button
      className="absolute flex flex-col items-center gap-2 group w-24 transition-transform hover:scale-105 active:scale-95 active:cursor-grabbing select-none"
      style={{ left: x, top: y }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all duration-300 shadow-2xl group-hover:shadow-emerald-500/10">
        {icon}
      </div>
      <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all">
        {label}
      </span>
    </button>
  );
}
