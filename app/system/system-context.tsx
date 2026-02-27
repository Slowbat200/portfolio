"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type FileSystem = {
  [key: string]: string | FileSystem;
};

export const initialFileSystem: FileSystem = {
  "about.txt": "I am a full-stack developer with a passion for building beautiful and functional applications.",
  "contact.txt": "Email: user@example.com\nGitHub: github.com/user\nLinkedIn: linkedin.com/in/user",
  "projects": {
    "portfolio.txt": "This very portfolio! Built with Next.js and Tailwind CSS.",
    "ecommerce.txt": "A full-featured e-commerce platform built with React and Node.js.",
    "ai-chat.txt": "An AI-powered chat application using OpenAI API.",
  },
  "skills": {
    "frontend.txt": "React, Next.js, TypeScript, Tailwind CSS, Framer Motion",
    "backend.txt": "Node.js, Express, PostgreSQL, MongoDB, Supabase",
    "tools.txt": "Git, Docker, AWS, Vercel",
  },
  "Desktop": {
    "welcome.txt": "Welcome to my interactive desktop environment!",
  },
  "readme.md": "# Welcome to my interactive terminal portfolio!\n\nType 'help' to see available commands.",
};

type SystemState = "initializing" | "booting" | "login" | "desktop" | "shutdown";

type SystemContextType = {
  state: SystemState;
  setState: (s: SystemState) => void;
  fileSystem: FileSystem;
  setFileSystem: (fs: FileSystem) => void;
};

const SystemContext = createContext<SystemContextType | null>(null);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SystemState>("initializing");
  const [fileSystem, setFileSystem] = useState<FileSystem>(initialFileSystem);

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

  return (
    <SystemContext.Provider value={{ state, setState, fileSystem, setFileSystem: updateFileSystem }}>
      {children}
    </SystemContext.Provider>
  );
}

export const useSystem = () => {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error("useSystem must be used inside provider");
  return ctx;
};
