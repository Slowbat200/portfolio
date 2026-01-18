export default function TerminalApp() {
  return (
    <div className="bg-black/80 p-4 h-full font-mono text-xs text-emerald-500">
      <p className="mb-2">
        Last login: {new Date().toLocaleDateString()} on ttys001
      </p>
      <p className="flex gap-2">
        <span className="text-emerald-400">root@system:~$</span>
        <span className="animate-pulse">_</span>
      </p>
      <div className="mt-4 text-zinc-600">
        <p>Available commands:</p>
        <p>- status : Check system integrity</p>
        <p>- logs : View security logs</p>
        <p>- bypass : [REDACTED]</p>
      </div>
    </div>
  );
}
