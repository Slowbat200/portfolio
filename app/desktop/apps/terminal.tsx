"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSystem } from "../../system/system-context";

// Define local FileSystem type
export type FileSystem = {
  [key: string]: string | FileSystem;
};

type HistoryItem = {
  type: "input" | "output";
  content: string;
  cwd?: string;
};

/**
 * TerminalApp component - A functional terminal emulator for SlowbatOS.
 * Integrates with the global system context to provide filesystem access,
 * command execution, and application launching.
 * 
 * @returns {JSX.Element} The terminal application UI
 */
export default function TerminalApp() {
  const { openApp, fileSystem, setFileSystem } = useSystem();

  // Terminal command history and output management
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      type: "output",
      content:
        "Welcome to Terminal v1.0.0\nType 'help' for a list of available commands.",
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cwd, setCwd] = useState<string[]>(["Desktop"]); // Default working directory
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Focus input on click
  const handleContainerClick = () => {
    inputRef.current?.focus({ preventScroll: true });
  };

  // Initial focus
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Scroll to bottom when history changes
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto", block: "nearest" });
    }
  }, [history]);

  /**
   * Resolves a path array to an object or string in the filesystem.
   * 
   * @param {string[]} path - The filesystem path segments to resolve
   */
  const resolvePath = (path: string[]): string | FileSystem | undefined => {
    let current: string | FileSystem | undefined = fileSystem;
    for (const segment of path) {
      if (typeof current === "object" && current !== null) {
        current = current[segment];
      } else {
        return undefined;
      }
    }
    return current;
  };

  /**
   * Helper to get a directory object from a path.
   */
  const getDirectory = (path: string[]): FileSystem | undefined => {
    const target = resolvePath(path);
    return typeof target === "object" ? target : undefined;
  };

  /**
   * Formats the current working directory for display in the prompt.
   */
  const formatCwd = (path: string[]) => {
    return path.length === 0 ? "~" : "~/" + path.join("/");
  };

  /**
   * Main command handler for the terminal.
   * 
   * @param {string} cmdString - The raw command string input by the user
   */
  const handleCommand = (cmdString: string) => {
    const trimmedCmd = cmdString.trim();
    if (!trimmedCmd) {
      setHistory((prev) => [
        ...prev,
        { type: "input", content: "", cwd: formatCwd(cwd) },
      ]);
      return;
    }

    const [cmd, ...args] = trimmedCmd.split(/\s+/);

    setCommandHistory((prev) => [...prev, cmdString]);
    setHistoryIndex(-1);

    const newHistory: HistoryItem[] = [
      ...history,
      { type: "input", content: cmdString, cwd: formatCwd(cwd) },
    ];

    let output = "";

    switch (cmd) {
      case "help":
        output = `Available commands:
  help      - Show this help message
  clear     - Clear terminal history
  ls        - List directory contents
  cd [dir]  - Change directory
  cat [file]- Display file content
  pwd       - Print working directory
  whoami    - Display current user
  echo [txt]- Print text to stdout
  mkdir [dir]- Create a directory
  touch [file]- Create a file
  rm [file] - Remove a file
  rmdir [dir]- Remove an empty directory
  [app].exe - Launch system applications`;
        break;

      case "clear":
        setHistory([]);
        return;

      case "whoami":
        output = "root";
        break;

      case "pwd":
        output = "/home/root" + (cwd.length ? "/" + cwd.join("/") : "");
        break;

      case "echo":
        output = args.join(" ");
        break;

      case "ls":
        const targetDir = getDirectory(cwd);
        if (targetDir) {
          output = Object.entries(targetDir)
            .map(([name, content]) => {
              const isDir = typeof content === "object";
              return isDir ? `${name}/` : name;
            })
            .join("  ");
        } else {
          output = "Error: Current directory not found.";
        }
        break;

      case "cd":
        if (args.length === 0) {
          setCwd([]);
        } else {
          const target = args[0];
          if (target === "..") {
            setCwd((prev) => prev.slice(0, -1));
          } else if (target === "~") {
            setCwd([]);
          } else {
            const pathParts = target.split("/").filter(Boolean);
            let newCwd = [...cwd];
            let isValid = true;

            for (const part of pathParts) {
              if (part === "..") {
                if (newCwd.length > 0) newCwd.pop();
              } else if (part === ".") {
                continue;
              } else {
                const currentDir = getDirectory(newCwd);
                if (currentDir && typeof currentDir[part] === "object") {
                  newCwd.push(part);
                } else {
                  output = `cd: ${target}: No such directory`;
                  isValid = false;
                  break;
                }
              }
            }
            if (isValid) setCwd(newCwd);
          }
        }
        break;

        case "rmdir":
        if (args.length === 0) {
          output = "rmdir: missing operand";
        } else {
          const target = args[0];
          const currentDir = getDirectory(cwd);
          if (currentDir && target in currentDir) {
            const content = currentDir[target];
            if (typeof content !== "object") {
              output = `rmdir: failed to remove '${target}': Not a directory`;
            } else if (Object.keys(content).length > 0) {
              output = `rmdir: failed to remove '${target}': Directory not empty`;
            } else {
              const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
              let ptr = newFileSystem;
              for (const segment of cwd) {
                ptr = ptr[segment];
              }
              delete ptr[target];
              setFileSystem(newFileSystem);
              output = "";
            }
          } else {
            output = `rmdir: failed to remove '${target}': No such file or directory`;
          }
        }
        break;

      case "cat":
        if (args.length === 0) {
          output = "cat: missing operand";
        } else {
          const fileName = args[0];
          const currentDir = getDirectory(cwd);
          if (currentDir && fileName in currentDir) {
            const content = currentDir[fileName];
            if (typeof content === "string") {
              output = content;
            } else {
              output = `cat: ${fileName}: Is a directory`;
            }
          } else {
            output = `cat: ${fileName}: No such file or directory`;
          }
        }
        break;

      case "mkdir":
        if (args.length === 0) {
          output = "mkdir: missing operand";
        } else {
          const dirName = args[0];
          const currentDir = getDirectory(cwd);
          if (currentDir) {
            if (currentDir[dirName]) {
              output = `mkdir: cannot create directory '${dirName}': File exists`;
            } else {
              const newFS = JSON.parse(JSON.stringify(fileSystem));
              let ptr = newFS;
              for (const segment of cwd) {
                ptr = ptr[segment];
              }
              ptr[dirName] = {};
              setFileSystem(newFS);
              output = "";
            }
          }
        }
        break;

      case "touch":
        if (args.length === 0) {
          output = "touch: missing operand";
        } else {
          const fileName = args[0];
          const currentDir = getDirectory(cwd);
          if (currentDir) {
            const newFS = JSON.parse(JSON.stringify(fileSystem));
            let ptr = newFS;
            for (const segment of cwd) {
              ptr = ptr[segment];
            }
            if (!ptr[fileName]) {
              ptr[fileName] = "";
              setFileSystem(newFS);
            }
          }
        }
        break;

      case "rm":
        if (args.length === 0) {
          output = "rm: missing operand";
        } else {
          const target = args[0];
          const currentDir = getDirectory(cwd);
          if (currentDir && target in currentDir) {
            const newFS = JSON.parse(JSON.stringify(fileSystem));
            let ptr = newFS;
            for (const segment of cwd) {
              ptr = ptr[segment];
            }
            delete ptr[target];
            setFileSystem(newFS);
            output = "";
          } else {
            output = `rm: cannot remove '${target}': No such file or directory`;
          }
        }
        break;

      default:
        // Check for .exe launch
        const currentDir = getDirectory(cwd);
        if (currentDir && cmd in currentDir && cmd.endsWith(".exe")) {
          const appId = cmd.replace(".exe", "");
          openApp(appId);
          output = `Launching ${appId}...`;
        } else {
          output = `${cmd}: command not found`;
        }
    }

    if (output) {
      newHistory.push({ type: "output", content: output });
    }
    setHistory(newHistory);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(currentInput);
      setCurrentInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div
      className="bg-white dark:bg-black/80 h-full w-full font-mono text-xs text-zinc-800 dark:text-emerald-500 transition-colors overflow-hidden flex flex-col"
      onClick={handleContainerClick}
    >
      <ScrollArea className="flex-1 w-full h-full">
        <div className="p-4 space-y-1">
          {history.map((item, index) => (
            <div key={index} className="whitespace-pre-wrap break-all">
              {item.type === "input" ? (
                <div className="flex gap-2 text-zinc-500 dark:text-emerald-400">
                  <span className="font-bold">
                    root@system:{item.cwd || "~"}$
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100">
                    {item.content}
                  </span>
                </div>
              ) : (
                <div className="text-zinc-700 dark:text-emerald-500/90 whitespace-pre-wrap pl-4 mb-2">
                  {item.content}
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-2 items-center">
            <span className="text-zinc-500 dark:text-emerald-400 font-bold shrink-0">
              root@system:{formatCwd(cwd)}$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none flex-1 text-zinc-900 dark:text-zinc-100 focus:ring-0 p-0"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
