export default function ProjectsApp() {
  return (
    <div className="space-y-4 font-mono text-xs text-blue-500/90">
      <div className="p-3 border border-blue-500/20 bg-blue-500/5 rounded">
        <p className="text-blue-400 font-bold mb-2 uppercase tracking-wider">
          {" "}
          active_nodes
        </p>
        <div className="space-y-2">
          <div className="flex justify-between items-center border-b border-blue-500/10 pb-1">
            <span>Project_Alpha</span>
            <span className="text-[10px] bg-blue-500/20 px-1">DEPLOYED</span>
          </div>
          <div className="flex justify-between items-center border-b border-blue-500/10 pb-1">
            <span>Cyber_Shield</span>
            <span className="text-[10px] bg-emerald-500/20 px-1 text-emerald-400">
              ACTIVE
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-blue-500/10 pb-1">
            <span>Neural_Net_v2</span>
            <span className="text-[10px] bg-amber-500/20 px-1 text-amber-400">
              ENCRYPTED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
