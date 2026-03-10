export default function ProjectsApp() {
  return (
    <div className="space-y-4 font-mono text-xs text-zinc-600 dark:text-blue-500/90 p-4">
      <div className="p-3 border border-zinc-200 dark:border-blue-500/20 bg-zinc-50 dark:bg-blue-500/5 rounded">
        <p className="text-zinc-800 dark:text-blue-400 font-bold mb-2 uppercase tracking-wider"> active_nodes</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-blue-500/10 pb-1">
            <span className="text-zinc-700 dark:text-blue-300">Project_Alpha</span>
            <span className="text-[10px] bg-zinc-200 dark:bg-blue-500/20 px-1 text-zinc-600 dark:text-blue-400">DEPLOYED</span>
          </div>
          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-blue-500/10 pb-1">
            <span className="text-zinc-700 dark:text-blue-300">Cyber_Shield</span>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 px-1 text-emerald-700 dark:text-emerald-400">ACTIVE</span>
          </div>
          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-blue-500/10 pb-1">
            <span className="text-zinc-700 dark:text-blue-300">Neural_Net_v2</span>
            <span className="text-[10px] bg-amber-100 dark:bg-amber-500/20 px-1 text-amber-700 dark:text-amber-400">ENCRYPTED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
