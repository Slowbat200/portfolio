"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSystem, FileSystem } from "../../system/system-context";

type HistoryItem = {
  type: "input" | "output";
  content: string;
  cwd?: string;
};

export default function TerminalApp() {
  const { fileSystem, setFileSystem } = useSystem();
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      type: "output",
      content: "Welcome to Terminal v1.0.0\nType 'help' for a list of available commands.",
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cwd, setCwd] = useState<string[]>([]); // Empty array means root ~
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Focus input on click
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // Scroll to bottom when history changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

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

  const getDirectory = (path: string[]): FileSystem | undefined => {
    const target = resolvePath(path);
    return typeof target === "object" ? target : undefined;
  };

  const formatCwd = (path: string[]) => {
    return path.length === 0 ? "~" : "~/" + path.join("/");
  };

  const handleCommand = (cmdString: string) => {
    const trimmedCmd = cmdString.trim();
    if (!trimmedCmd) {
      setHistory((prev) => [...prev, { type: "input", content: "", cwd: formatCwd(cwd) }]);
      return;
    }

    const [cmd, ...args] = trimmedCmd.split(/\s+/);
    
    // Add to command history
    setCommandHistory(prev => [...prev, cmdString]);
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
  rm [file] - Remove a file or directory (use -r for dir)
  rmdir [dir]- Remove an empty directory`;
        break;

      case "rm":
        if (args.length === 0) {
          output = "rm: missing operand";
        } else {
          let target = "";
          let recursive = false;
          
          if (args[0] === "-r" || args[0] === "-rf") {
            recursive = true;
            target = args[1];
          } else {
            target = args[0];
          }

          if (!target) {
            output = "rm: missing operand";
            break;
          }

          const currentDir = getDirectory(cwd);
          if (currentDir && target in currentDir) {
            const isDir = typeof currentDir[target] === "object";
            if (isDir && !recursive) {
              output = `rm: cannot remove '${target}': Is a directory (use -r)`;
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
            output = `rm: cannot remove '${target}': No such file or directory`;
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
            // Support simple relative paths for now
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
                // We need to update fileSystem state deeply. 
                // Since this is a simple mock, we can clone and update.
                // However, 'getDirectory' returns a reference to the nested object in 'fileSystem' state?
                // No, state updates must be immutable.
                
                // Deep clone helper
                const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
                let ptr = newFileSystem;
                for (const segment of cwd) {
                  ptr = ptr[segment];
                }
                ptr[dirName] = {};
                setFileSystem(newFileSystem);
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
              // Deep clone and update
              const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
              let ptr = newFileSystem;
              for (const segment of cwd) {
                ptr = ptr[segment];
              }
              // Only create if it doesn't exist, or update timestamp (mocked by doing nothing if exists)
              if (!ptr[fileName]) {
                 ptr[fileName] = "";
                 setFileSystem(newFileSystem);
              }
           }
        }
        break;

      default:
        output = `${cmd}: command not found`;
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
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
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
      className="bg-black/90 p-2 h-full w-full font-mono text-sm text-emerald-500 overflow-hidden flex flex-col"
      onClick={handleContainerClick}
    >
      <ScrollArea className="flex-1 w-full h-full">
        <div className="space-y-1 p-2">
          {history.map((item, index) => (
            <div key={index} className="break-words">
              {item.type === "input" ? (
                <div className="flex gap-2 text-emerald-400 font-bold">
                  <span>root@system:{item.cwd}$</span>
                  <span className="text-zinc-100">{item.content}</span>
                </div>
              ) : (
                <div className="text-zinc-300 whitespace-pre-wrap pl-4 mb-2">
                  {item.content}
                </div>
              )}
            </div>
          ))}
          
          <div className="flex gap-2 text-emerald-400 font-bold items-center">
            <span>root@system:{formatCwd(cwd)}$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none flex-1 text-zinc-100 focus:ring-0 p-0"
              autoFocus
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
