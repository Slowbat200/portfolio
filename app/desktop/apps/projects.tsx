/**
 * ProjectsApp - Component for displaying a list of active projects.
 * Lists projects with their current deployment status in a styled grid.
 */
export default function ProjectsApp() {
  return (
    <div className="space-y-4 font-mono text-xs text-zinc-600 dark:text-blue-500/90 p-4">
      {/* Active Nodes / Projects List */}
      <div className="p-3 border border-zinc-200 dark:border-blue-500/20 bg-zinc-50 dark:bg-blue-500/5 rounded">
        <p className="text-zinc-800 dark:text-blue-400 font-bold mb-2 uppercase tracking-wider"> active_projects</p>
      </div>
        <div className="space-y-2">
          {/* Project Item: Alpha */}
          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-blue-500/10 pb-1">
            <span className="text-zinc-700 dark:text-blue-300">Project_Alpha</span>
          </div>
          {/* Project Item: Cyber Shield */}
          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-blue-500/10 pb-1">
            <span className="text-zinc-700 dark:text-blue-300">Cyber_Shield</span>
          </div>
          {/* Project Item: Neural Net */}
          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-blue-500/10 pb-1">
            <span className="text-zinc-700 dark:text-blue-300">Neural_Net_v2</span>
          </div>
        </div>
    </div>
  );
}
