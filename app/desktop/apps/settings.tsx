import { ModeToggle } from "@/components/mode-toggle";
import { Slider } from "@/components/ui/slider";

export default function SettingsApp() {
  return (
    <div className="space-y-4 font-mono text-sm text-zinc-600 dark:text-zinc-400 p-4 transition-colors">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-900/50">
          <span className="text-zinc-800 dark:text-zinc-200">Dark_Mode</span>
          <ModeToggle />
        </div>
        <div className="flex items-center justify-between p-2 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-900/50">
          <span className="text-zinc-800 dark:text-zinc-200">
            Encryption_Level
          </span>
          <span className="text-emerald-600 dark:text-emerald-500 font-bold">
            AES-256
          </span>
        </div>
        <div className="flex items-center justify-between p-2 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-900/50">
          <span className="text-zinc-800 dark:text-zinc-200">
            System_Volume
          </span>
          <div className="w-24 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full relative">
            <Slider defaultValue={[33]} max={100} step={1} />
          </div>
        </div>
      </div>
    </div>
  );
}
