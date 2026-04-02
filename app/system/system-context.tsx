"use client";

import { createContext, useContext, useEffect, useState } from "react";

/**
 * SystemContext - Central state management for SlowbatOS.
 * Provides access to the simulated filesystem, system boot state,
 * and application management (opening/closing windows).
 */

export type FileSystem = {
  [key: string]: string | FileSystem;
};

/**
 * Default initial filesystem structure.
 */
export const initialFileSystem: FileSystem = {
  Desktop: {
    "identity.exe": "SYSTEM_APPLICATION: identity_profile",
    "projects.exe": "SYSTEM_APPLICATION: project_archives",
    "terminal.exe": "SYSTEM_APPLICATION: root_terminal",
    "settings.exe": "SYSTEM_APPLICATION: core_settings",
    "trash.exe": "SYSTEM_APPLICATION: trash_bin",
  },
  Trash: {},
};

type SystemState = "initializing" | "booting" | "login" | "desktop" | "shutdown";

type SystemContextType = {
  state: SystemState;
  setState: (s: SystemState) => void;
  fileSystem: FileSystem;
  setFileSystem: (fs: FileSystem) => void;
  openApp: (id: string) => void;
  appToOpen: string | null; // Used to trigger window opening in Desktop component
};

const SystemContext = createContext<SystemContextType | null>(null);

/**
 * SystemProvider - Wraps the application to provide OS-level state.
 * Handles persistence of the filesystem to localStorage.
 */
export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SystemState>("initializing");
  const [fileSystem, setFileSystem] = useState<FileSystem>(initialFileSystem);
  const [appToOpen, setAppToOpen] = useState<string | null>(null);

  /**
   * Effect to load initial state and saved filesystem on boot.
   */
  useEffect(() =>{
    const booted = sessionStorage.getItem("booted");
    const loggedIn = sessionStorage.getItem("loggedIn");
    const savedFs = localStorage.getItem("fs_v2");
    
    if (savedFs) {
      try {
        setFileSystem(JSON.parse(savedFs));
      } catch (e) {
        console.error("Failed to parse saved FS", e);
      }
    }

    if (loggedIn) {
      setState("desktop");
    } else if (booted) {
      setState("login");
    } else {
      setState("booting");
    }
  }, []);

  /**
   * Updates the global filesystem and persists it to localStorage.
   */
  const updateFileSystem = (newFs: FileSystem) => {
    setFileSystem(newFs);
    localStorage.setItem("fs_v2", JSON.stringify(newFs));
  };

  /**
   * Triggers an application window to open.
   */
  const openApp = (id: string) => {
    setAppToOpen(id);
    // Reset after a short delay so it can be triggered again for the same app
    setTimeout(() => setAppToOpen(null), 100);
  };

  return (
    <SystemContext.Provider value={{ state, setState, fileSystem, setFileSystem: updateFileSystem, openApp, appToOpen } as any}>
      {children}
    </SystemContext.Provider>
  );
}

/**
 * Custom hook to use the system context.
 */
export const useSystem = () => {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error("useSystem must be used inside provider");
  return ctx;
};
