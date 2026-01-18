
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type SystemState = "initializing" | "booting" | "login" | "desktop" | "shutdown";

type SystemContextType = {
  state: SystemState;
  setState: (s: SystemState) => void;
};

const SystemContext = createContext<SystemContextType | null>(null);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SystemState>("initializing");

  useEffect(() =>{
    const booted = sessionStorage.getItem("booted");
    const loggedIn = sessionStorage.getItem("loggedIn");
    
    if (loggedIn) {
      setState("desktop");
    } else if (booted) {
      setState("login");
    } else {
      setState("booting");
    }
  }, []);

  return (
    <SystemContext.Provider value={{ state, setState }}>
      {children}
    </SystemContext.Provider>
  );
}

export const useSystem = () => {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error("useSystem must be used inside provider");
  return ctx;
};
