"use client";

import { useState, useRef, useEffect } from "react";
import { useSystem } from "../system/system-context";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LogOut,
  Terminal,
  User,
  Folder,
  Settings,
  X,
  Minus,
  Square,
  RefreshCw,
  Power,
  Trash2,
} from "lucide-react";
import IdentityApp from "./apps/identity";
import ProjectsApp from "./apps/projects";
import TerminalApp from "./apps/terminal";
import SettingsApp from "./apps/settings";
import TrashApp from "./apps/trash";

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
  isMaximized: boolean;
  isMinimized: boolean;
  x: number;
  y: number;
  zIndex: number;
  content: React.ReactNode;
}

/**
 * Desktop component - The primary shell of SlowbatOS.
 * Handles window management, desktop icons, drag-and-drop logic,
 * and responsive layout for mobile and desktop devices.
 */
export default function Desktop() {
  // Global system state and filesystem access
  const { setState, fileSystem, setFileSystem, appToOpen } = useSystem();
  const isMobile = useIsMobile();
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isOverTrash, setIsOverTrash] = useState(false);

  // Core window data management
  const [windows, setWindows] = useState<WindowData[]>([
    {
      id: "identity",
      title: "IDENTITY_PROFILE",
      isOpen: false,
      isMaximized: isMobile,
      isMinimized: false,
      x: isMobile ? 0 : 100,
      y: isMobile ? 0 : 100,
      zIndex: 10,
      content: <IdentityApp />,
    },
    {
      id: "projects",
      title: "PROJECT_ARCHIVES",
      isOpen: false,
      isMaximized: isMobile,
      isMinimized: false,
      x: isMobile ? 0 : 150,
      y: isMobile ? 0 : 150,
      zIndex: 10,
      content: <ProjectsApp />,
    },
    {
      id: "terminal",
      title: "ROOT_TERMINAL",
      isOpen: false,
      isMaximized: isMobile,
      isMinimized: false,
      x: isMobile ? 0 : 200,
      y: isMobile ? 0 : 200,
      zIndex: 10,
      content: <TerminalApp />,
    },
    {
      id: "settings",
      title: "CORE_SETTINGS",
      isOpen: false,
      isMaximized: isMobile,
      isMinimized: false,
      x: isMobile ? 0 : 250,
      y: isMobile ? 0 : 250,
      zIndex: 10,
      content: <SettingsApp />,
    },
    {
      id: "trash",
      title: "TRASH_BIN",
      isOpen: false,
      isMaximized: isMobile,
      isMinimized: false,
      x: isMobile ? 0 : 300,
      y: isMobile ? 0 : 300,
      zIndex: 10,
      content: <TrashApp />,
    },
  ]);

  const [loading, setLoading] = useState(true);

  // Desktop icon positions and metadata
  const [icons, setIcons] = useState<IconPosition[]>([
    {
      id: "identity",
      x: 24,
      y: 24,
      label: "Identity",
      icon: <User className="w-8 h-8 text-emerald-400" />,
    },
    {
      id: "projects",
      x: 24,
      y: 136,
      label: "Projects",
      icon: <Folder className="w-8 h-8 text-blue-400" />,
    },
    {
      id: "terminal",
      x: 24,
      y: 248,
      label: "Terminal",
      icon: <Terminal className="w-8 h-8 text-emerald-500" />,
    },
    {
      id: "settings",
      x: 24,
      y: 360,
      label: "Settings",
      icon: <Settings className="w-8 h-8 text-zinc-500 dark:text-zinc-400" />,
    },
    {
      id: "trash",
      x: 24,
      y: 472,
      label: "Trash",
      icon: <Trash2 className="w-8 h-8 text-zinc-500 dark:text-zinc-400" />,
    },
  ]);

  // Effect to listen for app open requests from SystemContext (e.g., from Terminal)
  useEffect(() => {
    if (appToOpen) {
      handleWindowOpen(appToOpen);
    }
  }, [appToOpen]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  /**
   * Re-arranges icons for mobile or loads saved positions for desktop.
   */
  useEffect(() => {
    if (isMobile) {
      // Re-arrange icons into two columns for mobile
      setIcons((prev) =>
        prev.map((icon, index) => ({
          ...icon,
          x: (index % 3) * 100 + 24,
          y: Math.floor(index / 3) * 100 + 24,
        })),
      );
      return;
    }

    const savedPositions = localStorage.getItem("desktop_icon_positions");
    if (savedPositions) {
      try {
        const positions = JSON.parse(savedPositions);
        setIcons((prev) =>
          prev.map((icon) =>
            positions[icon.id]
              ? { ...icon, x: positions[icon.id].x, y: positions[icon.id].y }
              : icon,
          ),
        );
      } catch (e) {
        console.error("Failed to load icon positions", e);
      }
    }
  }, [isMobile]);

  /**
   * Syncs dynamic icons (folders/files) from the global FileSystem to the desktop.
   */
  useEffect(() => {
    const desktopFolder = (fileSystem["Desktop"] as any) || {};
    const desktopFiles = Object.keys(desktopFolder);

    setIcons((prev) => {
      const systemIconIds = [
        "identity",
        "projects",
        "terminal",
        "settings",
        "trash",
      ];
      
      // Map desktop filenames to system icon IDs to avoid duplicates for built-in apps
      const fileToSystemId: Record<string, string> = {
        "identity.exe": "identity",
        "projects.exe": "projects",
        "terminal.exe": "terminal",
        "settings.exe": "settings",
        "trash.exe": "trash",
      };

      const currentDynamicIcons = prev.filter(
        (icon) => !systemIconIds.includes(icon.id),
      );
      const currentDynamicIds = currentDynamicIcons.map((icon) =>
        icon.id.replace("fs-", ""),
      );

      // Remove icons for deleted files
      let nextIcons = prev.filter((icon) => {
        if (systemIconIds.includes(icon.id)) return true;
        const fileName = icon.id.replace("fs-", "");
        return desktopFiles.includes(fileName);
      });

      // Add icons for new files/folders created via terminal
      desktopFiles.forEach((fileName) => {
        // Skip if it's a system app already represented by a hardcoded icon
        if (fileToSystemId[fileName]) return;
        
        if (!currentDynamicIds.includes(fileName)) {
          const isDir = typeof desktopFolder[fileName] === "object";
          const iconCount = nextIcons.length;

          nextIcons.push({
            id: `fs-${fileName}`,
            label: fileName,
            x: isMobile ? (iconCount % 3) * 100 + 24 : 144,
            y: isMobile
              ? Math.floor(iconCount / 3) * 100 + 24
              : 24 + (nextIcons.length - systemIconIds.length) * 120,
            icon: isDir ? (
              <Folder className="w-8 h-8 text-blue-400" />
            ) : (
              <Terminal className="w-8 h-8 text-zinc-400" />
            ),
          });
        }
      });

      return nextIcons;
    });
  }, [fileSystem, isMobile]);

  /**
   * Persists icon positions to localStorage.
   */
  const saveIconPositions = (updatedIcons: IconPosition[]) => {
    const positions = updatedIcons.reduce((acc, icon) => {
      acc[icon.id] = { x: icon.x, y: icon.y };
      return acc;
    }, {} as any);
    localStorage.setItem("desktop_icon_positions", JSON.stringify(positions));
  };

  const draggingIconId = useRef<string | null>(null);
  const draggingWindowId = useRef<string | null>(null);
  const offset = useRef({ x: 0, y: 0 });
  const touchTimer = useRef<NodeJS.Timeout | null>(null);

  /**
   * Mouse down handler for icons.
   */
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

  /**
   * Touch start handler with long-press logic for dragging on mobile.
   */
  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    const icon = icons.find((i) => i.id === id);
    if (icon) {
      const touch = e.touches[0];
      const startX = touch.clientX;
      const startY = touch.clientY;

      touchTimer.current = setTimeout(() => {
        draggingIconId.current = id;
        offset.current = {
          x: startX - icon.x,
          y: startY - icon.y,
        };
        if (window.navigator.vibrate) window.navigator.vibrate(50);
      }, 500);
    }
  };

  /**
   * Brings a window to the front by increasing its z-index.
   */
  const bringToFront = (id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 10);
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w));
    });
  };

  /**
   * Mouse down handler for windows to start dragging.
   */
  const handleWindowMouseDown = (e: React.MouseEvent, id: string) => {
    const window = windows.find((w) => w.id === id);
    if (window && !window.isMaximized) {
      draggingWindowId.current = id;
      offset.current = {
        x: e.clientX - window.x,
        y: e.clientY - window.y,
      };
      bringToFront(id);
    } else if (window) {
      bringToFront(id);
    }
  };

  /**
   * Opens a window and brings it to focus.
   */
  const handleWindowOpen = (id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 10);
      return prev.map((w) =>
        w.id === id
          ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 }
          : w,
      );
    });
  };

  /**
   * Minimizes a window (hides it from view but keeps it in taskbar/active state).
   */
  const handleWindowMinimize = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
    );
  };

  /**
   * Toggles maximization of a window.
   */
  const handleWindowMaximize = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)),
    );
  };

  /**
   * Closes a window.
   */
  const handleWindowClose = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w)),
    );
  };

  const handleStartMenu = () => {
    setIsStartMenuOpen((prev) => !prev);
  };

  /**
   * Global event listeners for dragging logic (mouse and touch).
   */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (draggingIconId.current || draggingWindowId.current) {
        if ("touches" in e) {
          if (e.cancelable) e.preventDefault();
        }
      }

      if (draggingIconId.current) {
        if (touchTimer.current) clearTimeout(touchTimer.current);
        const currentId = draggingIconId.current;
        
        let newX = clientX - offset.current.x;
        let newY = clientY - offset.current.y;

        setIcons((prev) => {
          return prev.map((icon) => {
            if (icon.id === currentId) {
              return { ...icon, x: newX, y: newY };
            }
            return icon;
          });
        });

        // Collision detection for dragging items over the Trash icon
        const trashIcon = icons.find((i) => i.id === "trash");
        if (trashIcon && currentId !== "trash") {
          const dx = newX - trashIcon.x;
          const dy = newY - trashIcon.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          setIsOverTrash(distance < 60);
        }
      } else if (draggingWindowId.current) {
        setWindows((prev) =>
          prev.map((window) =>
            window.id === draggingWindowId.current
              ? {
                  ...window,
                  x: clientX - offset.current.x,
                  y: clientY - offset.current.y,
                }
              : window,
          ),
        );
      }
    };

    /**
     * Handles dropping an icon or stopping a window drag.
     */
    const handleMouseUp = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? (e.touches[0]?.clientX || e.changedTouches[0]?.clientX) : (e as MouseEvent).clientX;
      const clientY = "touches" in e ? (e.touches[0]?.clientY || e.changedTouches[0]?.clientY) : (e as MouseEvent).clientY;

      if (touchTimer.current) {
        clearTimeout(touchTimer.current);
        touchTimer.current = null;
      }

      if (draggingIconId.current) {
        const currentIconId = draggingIconId.current;
        const trashIcon = icons.find((i) => i.id === "trash");

        if (trashIcon && currentIconId !== "trash") {
          const currentX = clientX - offset.current.x;
          const currentY = clientY - offset.current.y;
          
          const dx = currentX - trashIcon.x;
          const dy = currentY - trashIcon.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // If dropped over trash, move to global Trash folder
          if (distance < 60 && currentIconId.startsWith("fs-")) {
            const fileName = currentIconId.replace("fs-", "");
            const newFs = JSON.parse(JSON.stringify(fileSystem));
            
            const desktopFolder = newFs.Desktop || {};
            const item = desktopFolder[fileName];

            if (item) {
              if (!newFs.Trash) newFs.Trash = {};
              newFs.Trash[fileName] = item;
              delete newFs.Desktop[fileName];
              setFileSystem(newFs);
            }
            setIsOverTrash(false);
            setIcons((prev) => prev.filter((i) => i.id !== currentIconId));
            draggingIconId.current = null;
            draggingWindowId.current = null;
            return;
          }
        }

        saveIconPositions(icons);
        setIsOverTrash(false);
      }
      draggingIconId.current = null;
      draggingWindowId.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleMouseMove, { passive: false });
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [fileSystem, icons, isMobile]);

  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col overflow-hidden font-sans selection:bg-emerald-500/30 transition-colors duration-500">
      {/* Cybersecurity Background Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Digital Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[32px_32px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[128px_128px]" />

        {/* Glowing Accents */}
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[5%] w-[30%] h-[30%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full" />

        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-size[100%_4px] pointer-events-none opacity-20" />
      </div>

      {/* Desktop Icons Container */}
      <div
        className="relative flex-1 p-0 overflow-hidden"
        onClick={() => isStartMenuOpen && setIsStartMenuOpen(false)}
      >
        {icons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            icon={icon.icon}
            label={icon.label}
            x={icon.x}
            y={icon.y}
            isHighlighted={icon.id === "trash" && isOverTrash}
            onMouseDown={(e) => handleMouseDown(e, icon.id)}
            onTouchStart={(e) => handleTouchStart(e, icon.id)}
            onDoubleClick={() => handleWindowOpen(icon.id)}
          />
        ))}

        {/* Windows */}
        {windows.map((window) => {
          if (!window.isOpen) return null;
          return (
            <Window
              key={window.id}
              title={window.title}
              isOpen={window.isOpen}
              isMinimized={window.isMinimized}
              isMaximized={window.isMaximized}
              x={window.x}
              y={window.y}
              zIndex={window.zIndex}
              onClose={() => handleWindowClose(window.id)}
              onMinimize={() => handleWindowMinimize(window.id)}
              onMaximize={() => handleWindowMaximize(window.id)}
              onMouseDown={(e) => handleWindowMouseDown(e, window.id)}
            >
              {window.content}
            </Window>
          );
        })}

        {/* Start Menu */}
        {isStartMenuOpen && (
          <div
            className={`absolute bottom-14 left-0 right-0 mx-auto md:left-4 md:right-auto md:mx-0 w-[95%] md:w-64 bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-emerald-500/30 backdrop-blur-xl rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(16,185,129,0.1)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 z-50`}
          >
            <div className="p-4 border-b border-zinc-100 dark:border-emerald-500/20 bg-zinc-50 dark:bg-emerald-500/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-zinc-200 dark:border-emerald-500/50 flex items-center justify-center bg-white dark:bg-zinc-950">
                  <User className="w-6 h-6 text-zinc-600 dark:text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm md:text-xs font-mono text-zinc-800 dark:text-emerald-500 font-bold">
                    JD_ADMIN
                  </p>
                  <p className="text-[10px] font-mono text-zinc-500">
                    LEVEL: ROOT
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2 py-3 space-y-1">
              <StartMenuItem
                icon={<Terminal className="w-4 h-4" />}
                label="Root Terminal"
                onClick={() => {
                  handleWindowOpen("terminal");
                  setIsStartMenuOpen(false);
                }}
              />
              <StartMenuItem
                icon={<Folder className="w-4 h-4" />}
                label="Projects"
                onClick={() => {
                  handleWindowOpen("projects");
                  setIsStartMenuOpen(false);
                }}
              />
              <StartMenuItem
                icon={<Settings className="w-4 h-4" />}
                label="Core Settings"
                onClick={() => {
                  handleWindowOpen("settings");
                  setIsStartMenuOpen(false);
                }}
              />
              <div className="h-px bg-zinc-100 dark:bg-emerald-500/10 my-2" />
              <StartMenuItem
                icon={<User className="w-4 h-4" />}
                label="Identity Profile"
                onClick={() => {
                  handleWindowOpen("identity");
                  setIsStartMenuOpen(false);
                }}
              />
              <div className="h-px bg-zinc-100 dark:bg-emerald-500/10 my-2" />
              <div className="grid grid-cols-2 gap-2 px-2 pb-2">
                <button
                  onClick={() => {
                    sessionStorage.removeItem("booted");
                    sessionStorage.removeItem("loggedIn");
                    setState("booting");
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-emerald-500/10 text-zinc-600 dark:text-emerald-500/60 hover:text-zinc-900 dark:hover:text-emerald-400 transition-all border border-zinc-200 dark:border-emerald-500/10"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-[9px] font-mono uppercase tracking-tighter">
                    Restart
                  </span>
                </button>
                <button
                  onClick={() => {
                    sessionStorage.removeItem("booted");
                    sessionStorage.removeItem("loggedIn");
                    setState("shutdown");
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500/60 hover:text-red-600 dark:hover:text-red-400 transition-all border border-red-100 dark:border-red-500/10"
                >
                  <Power className="w-4 h-4" />
                  <span className="text-[9px] font-mono uppercase tracking-tighter">
                    Shutdown
                  </span>
                </button>
              </div>
              <div className="h-px bg-zinc-100 dark:bg-emerald-500/10 my-2" />
              <StartMenuItem
                icon={<LogOut className="w-4 h-4 text-zinc-400" />}
                label="Log Out"
                onClick={() => {
                  sessionStorage.removeItem("loggedIn");
                  setState("login");
                }}
                className="text-zinc-400/70 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              />
            </div>

            <div className="p-2 bg-zinc-50/50 dark:bg-zinc-950/50 text-[9px] font-mono text-zinc-500 dark:text-zinc-600 flex justify-between items-center px-4">
              <span>OS_VERSION: 1.0.4</span>
              <span className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500" /> ONLINE
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Taskbar */}
      <div className="relative h-12 bg-white/80 dark:bg-zinc-900/80 border-t border-zinc-200 dark:border-zinc-800 backdrop-blur-md flex items-center px-1 md:px-2 gap-1 shrink-0">
        <Button
          variant="ghost"
          className="h-10 text-zinc-800 dark:text-emerald-500 font-mono font-bold px-2 md:px-4 hover:bg-zinc-100 dark:hover:bg-emerald-500/10 hover:text-zinc-900 dark:hover:text-emerald-400 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-emerald-500/30"
          onClick={handleStartMenu}
        >
          <span className="md:mr-2">⚡</span>{" "}
          <span className="hidden md:inline">SYSTEM</span>
        </Button>

        {/* Taskbar Icons */}
        <div className="flex-1 flex items-center gap-1 md:gap-2 px-1 md:px-4 overflow-x-auto no-scrollbar">
          {windows
            .filter((w) => w.isOpen)
            .map((window) => (
              <button
                key={window.id}
                onClick={() => {
                  if (window.isMinimized) {
                    handleWindowOpen(window.id);
                  } else {
                    bringToFront(window.id);
                  }
                }}
                className={`h-8 px-2 md:px-3 rounded border font-mono text-[9px] md:text-[10px] flex items-center gap-1 md:gap-2 transition-all shrink-0 max-w-[100px] md:max-w-none ${
                  !window.isMinimized
                    ? "bg-zinc-100 dark:bg-emerald-500/10 border-zinc-300 dark:border-emerald-500/30 text-zinc-800 dark:text-emerald-400"
                    : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-400"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${!window.isMinimized ? "bg-emerald-500 animate-pulse" : "bg-zinc-300 dark:bg-zinc-700"}`}
                />
                <span className="truncate">{window.title}</span>
              </button>
            ))}
        </div>

        {/* System Controls */}
        <div className="flex items-center gap-2 md:gap-4 px-1 md:px-4 border-l border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-800 dark:text-emerald-500/70">
          <div className="hidden lg:flex items-center gap-2 border-r border-zinc-200 dark:border-zinc-800 pr-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">SECURE_LINK: ESTABLISHED</span>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem("loggedIn");
              setState("login");
            }}
            className="p-2 md:p-0 hover:text-amber-600 dark:hover:text-amber-500 transition-colors flex items-center gap-2"
            title="Log Out"
          >
            <LogOut className="w-4 h-4 dark:text-emerald-500" />
            <span className="hidden xl:inline">LOG_OUT</span>
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("booted");
              sessionStorage.removeItem("loggedIn");
              setState("shutdown");
            }}
            className="p-2 md:p-0 hover:text-red-600 dark:hover:text-red-500 transition-colors flex items-center gap-2"
            title="Shutdown System"
          >
            <Power className="w-4 h-4" />
            <span className="hidden xl:inline">SHUTDOWN</span>
          </button>
          <span className="text-[10px] md:text-xs text-zinc-400 dark:text-zinc-500 ml-1 md:ml-2">
            {time || "--:--"}
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
  isMinimized,
  isMaximized,
  x,
  y,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onMouseDown,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
}) {
  if (!isOpen) return null;
  const isMobile = useIsMobile();
  const maximized = isMaximized || isMobile;

  return (
    <div
      className={`absolute transition-transform bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xl flex flex-col backdrop-blur-xl animate-in zoom-in-95 fade-in duration-200 overflow-hidden ${
        maximized
          ? "inset-0 md:inset-2 z-100 rounded-none md:rounded-lg"
          : "min-w-[320px] min-h-[200px]"
      } ${isMinimized ? "invisible pointer-events-none scale-95 opacity-0" : "visible scale-100 opacity-100"}`}
      style={{
        left: maximized ? 0 : x,
        top: maximized ? 0 : y,
        width: maximized ? "100%" : "600px",
        height: maximized ? "calc(100% - 48px)" : "400px",
        zIndex: maximized ? 100 : zIndex,
        transform: maximized ? "none" : undefined,
      }}
    >
      {/* Window Header */}
      <div
        className="h-10 md:h-9 bg-zinc-50/50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-3 cursor-move select-none"
        onMouseDown={!maximized ? onMouseDown : undefined}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
          <span className="text-[10px] md:text-[11px] font-mono text-zinc-600 dark:text-zinc-400 font-bold tracking-widest uppercase truncate max-w-[150px] md:max-w-none">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="p-2 md:p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors group"
          >
            <Minus className="w-4 h-4 md:w-3 md:h-3 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-400" />
          </button>
          {!isMobile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMaximize();
              }}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors group"
            >
              <Square className="w-3 h-3 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-400" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 md:p-1 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded transition-colors group"
          >
            <X className="w-4 h-4 md:w-3 md:h-3 text-zinc-400 dark:text-zinc-600 group-hover:text-red-600 dark:group-hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white dark:bg-transparent">
        {children}
      </div>

      {/* Status Bar */}
      <div className="h-7 md:h-6 bg-zinc-50/30 dark:bg-zinc-950/30 border-t border-zinc-200 dark:border-zinc-800/50 flex items-center px-3 justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[8px] md:text-[9px] font-mono text-zinc-400 dark:text-zinc-600 uppercase">
            Status:{" "}
          </span>
          <span className="text-[8px] md:text-[9px] font-mono text-emerald-600 dark:text-emerald-500/70 uppercase animate-pulse">
            Synced
          </span>
        </div>
        <span className="text-[8px] md:text-[9px] font-mono text-zinc-400 dark:text-zinc-600">
          SECURE_ENV
        </span>
      </div>
    </div>
  );
}

function StartMenuItem({
  icon,
  label,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-mono text-zinc-600 dark:text-emerald-500/80 hover:text-zinc-900 dark:hover:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-emerald-500/10 rounded-md transition-all group ${className}`}
    >
      <span className="group-hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.1)] dark:group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all">
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
  isHighlighted,
  onMouseDown,
  onTouchStart,
  onDoubleClick,
}: {
  icon: React.ReactNode;
  label: string;
  x: number;
  y: number;
  isHighlighted?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onDoubleClick: () => void;
}) {
  const isMobile = useIsMobile();

  return (
    <button
      className={`absolute flex flex-col items-center gap-1 md:gap-2 group w-20 md:w-24 transition-transform hover:scale-105 active:scale-95 active:cursor-grabbing select-none ${isHighlighted ? "scale-110" : ""}`}
      style={{ left: x, top: y }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onDoubleClick={onDoubleClick}
      onClick={() => {
        if (isMobile) onDoubleClick();
      }}
    >
      <div
        className={`p-3 md:p-4 rounded-xl border transition-all duration-300 shadow-2xl ${isHighlighted ? "bg-red-500/20 border-red-500 shadow-red-500/40 animate-pulse" : "bg-white/80 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 group-hover:shadow-emerald-500/10"}`}
      >
        <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <span
        className={`text-[9px] md:text-[10px] font-mono tracking-widest uppercase transition-all truncate w-full px-1 ${isHighlighted ? "text-red-600 dark:text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "text-white dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"}`}
      >
        {label}
      </span>
    </button>
  );
}
