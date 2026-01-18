export default function SettingsApp() {
  return (
    <div className="space-y-4 font-mono text-xs text-zinc-400">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 border border-zinc-800 rounded">
          <span>Dark_Mode</span>
          <div className="w-8 h-4 bg-emerald-500/20 rounded-full relative">
            <div className="absolute right-1 top-1 w-2 h-2 bg-emerald-500 rounded-full" />
          </div>
        </div>
        <div className="flex items-center justify-between p-2 border border-zinc-800 rounded">
          <span>Encryption_Level</span>
          <span className="text-emerald-500">AES-256</span>
        </div>
        <div className="flex items-center justify-between p-2 border border-zinc-800 rounded">
          <span>System_Volume</span>
          <div className="w-24 h-1 bg-zinc-800 rounded-full relative">
            <div className="absolute left-0 top-0 w-3/4 h-full bg-blue-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
