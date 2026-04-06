"use client";

import { useState } from "react";
import { useSystem } from "../../system/system-context";
import { Folder, File, RotateCcw, Trash2, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * TrashApp - System component for managing deleted files.
 * Provides functionality to view, restore, or permanently delete items 
 * from the global Trash folder.
 */
export default function TrashApp() {
  const { fileSystem, setFileSystem } = useSystem();
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isConfirmingEmpty, setIsConfirmingEmpty] = useState(false);
  
  // Access the Trash folder from the global filesystem
  const trashItems = (fileSystem["Trash"] as any) || {};
  const fileNames = Object.keys(trashItems);

  /**
   * Restores a file from the Trash back to the Desktop.
   */
  const handleRestore = (name: string) => {
    const newFs = JSON.parse(JSON.stringify(fileSystem));
    if (!newFs.Trash) return;
    const item = newFs.Trash[name];
    
    if (!newFs.Desktop) newFs.Desktop = {};
    newFs.Desktop[name] = item;
    delete newFs.Trash[name];
    setFileSystem(newFs);
  };

  /**
   * Permanently removes a single file from the Trash.
   */
  const handlePermanentDelete = () => {
    if (!itemToDelete) return;
    const newFs = JSON.parse(JSON.stringify(fileSystem));
    if (newFs.Trash) {
      delete newFs.Trash[itemToDelete];
      setFileSystem(newFs);
    }
    setItemToDelete(null);
  };

  /**
   * Permanently removes all items from the Trash folder.
   */
  const handleEmptyTrash = () => {
    const newFs = JSON.parse(JSON.stringify(fileSystem));
    newFs.Trash = {};
    setFileSystem(newFs);
    setIsConfirmingEmpty(false);
  };

  return (
    <div className="flex flex-col h-full font-mono text-xs text-zinc-400 p-4 relative transition-transform">
      {/* Confirmation Dialogs for permanent deletion actions */}
      {(itemToDelete || isConfirmingEmpty) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-[280px] bg-zinc-900 border border-red-500/30 rounded-lg shadow-[0_0_30px_rgba(239,68,68,0.1)] p-5 space-y-4">
            <div className="flex items-center gap-3 text-red-500 dark:text-red-400">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <span className="font-bold tracking-widest uppercase text-[10px]">Security_Warning</span>
            </div>
            
            <p className="text-[10px] leading-relaxed text-zinc-300 dark:text-zinc-200">
              {isConfirmingEmpty 
                ? "Are you sure you want to permanently delete all items in the Trash? This action cannot be undone."
                : `Are you sure you want to permanently delete '${itemToDelete}'? This action cannot be undone.`
              }
            </p>

            <div className="flex gap-2 pt-2">
              <Button
                variant="ghost"
                className="flex-1 h-8 text-[9px] border border-zinc-800 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-400 dark:text-zinc-300"
                onClick={() => {
                  setItemToDelete(null);
                  setIsConfirmingEmpty(false);
                }}
              >
                CANCEL
              </Button>
              <Button
                variant="ghost"
                className="flex-1 h-8 text-[9px] border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                onClick={isConfirmingEmpty ? handleEmptyTrash : handlePermanentDelete}
              >
                CONFIRM_DELETE
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* App Header with Trash Stats and Empty Action */}
      <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          <span className="uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Trash_Bin</span>
        </div>
        {fileNames.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsConfirmingEmpty(true)}
            className="text-[10px] text-red-500/70 hover:text-red-400 hover:bg-red-500/10 h-6 px-2 border border-red-500/20"
          >
            EMPTY_TRASH
          </Button>
        )}
      </div>

      {/* Grid of items currently in the Trash */}
      {fileNames.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 opacity-30">
          <Trash2 className="w-12 h-12 text-zinc-500 dark:text-zinc-400" />
          <p className="uppercase tracking-tighter text-[10px] text-zinc-500 dark:text-zinc-400">Trash_is_empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 overflow-y-auto custom-scrollbar p-1">
          {fileNames.map((name) => {
            const isDir = typeof trashItems[name] === "object";
            return (
              <div 
                key={name}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-transparent hover:border-zinc-800 hover:bg-zinc-900/50 transition-all group relative"
              >
                <div className="relative">
                  {isDir ? (
                    <Folder className="w-10 h-10 text-blue-400/60 drop-shadow-lg dark:text-blue-400" />
                  ) : (
                    <File className="w-10 h-10 text-zinc-400 drop-shadow-lg dark:text-zinc-100" />
                  )}
                  
                  {/* Action Overlay for items in trash */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950/40 rounded-md backdrop-blur-[1px]">
                    <button
                      onClick={() => handleRestore(name)}
                      className="p-1.5 bg-emerald-500/80 hover:bg-emerald-400 text-zinc-950 rounded-full transition-colors shadow-lg"
                      title="Restore"
                    >
                      <RotateCcw className="w-3 h-3 font-bold text-zinc-950" />
                    </button>
                    <button
                      onClick={() => setItemToDelete(name)}
                      className="p-1.5 bg-red-500/80 hover:bg-red-400 text-zinc-950 rounded-full transition-colors shadow-lg"
                      title="Delete Permanently"
                    >
                      <X className="w-3 h-3 font-bold text-zinc-950" />
                    </button>
                  </div>
                </div>
                
                <span className="text-[10px] text-zinc-400 dark:text-zinc-200 text-center truncate w-full group-hover:text-zinc-200">
                  {name}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer with Metadata */}
      <div className="mt-auto pt-4 border-t border-zinc-800/50 flex justify-between text-[10px] text-zinc-600 dark:text-zinc-400">
        <span>ITEMS: {fileNames.length}</span>
        <span>TRASH_ROOT: /system/trash</span>
      </div>
    </div>
  );
}
