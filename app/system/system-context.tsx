"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type FileSystem = {
  [key: string]: string | FileSystem;
};

export const initialFileSystem: FileSystem = {
  "Desktop": {
    "identity.exe": "SYSTEM_APPLICATION: identity_profile",
    },
};

type SystemState = "initializing" | "booting" | "login" | "desktop" | "shutdown";

type SystemContextType = {
  state: SystemState;
  setState: (s: SystemState) => void;
  fileSystem: FileSystem;
  setFileSystem: (fs: FileSystem) => void;
  openApp: (id: string) => void;
  appToOpen: string | null;
};

const SystemContext = createContext<SystemContextType | null>(null);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SystemState>("initializing");
  const [fileSystem, setFileSystem] = useState<FileSystem>(initialFileSystem);
  const [appToOpen, setAppToOpen] = useState<string | null>(null);

  useEffect(() =>{
    const booted = sessionStorage.getItem("booted");
    const loggedIn = sessionStorage.getItem("loggedIn");
    const savedFs = localStorage.getItem("fs_v1");
    
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

  const updateFileSystem = (newFs: FileSystem) => {
    setFileSystem(newFs);
    localStorage.setItem("fs_v1", JSON.stringify(newFs));
  };

  const openApp = (id: string) => {
    setAppToOpen(id);
    // Reset after a short delay so it can be triggered again
    setTimeout(() => setAppToOpen(null), 100);
  };

  return (
    <SystemContext.Provider value={{ state, setState, fileSystem, setFileSystem: updateFileSystem, openApp, appToOpen } as any}>
      {children}
    </SystemContext.Provider>
  );
}

export const useSystem = () => {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error("useSystem must be used inside provider");
  return ctx;
};
