'use client'

import dynamic from 'next/dynamic'
import { useSystem } from './system/system-context'
import { Power } from 'lucide-react'

// Use dynamic imports with ssr: false for OS components to prevent hydration errors
const BootScreen = dynamic(() => import('./system/boot-screen'), { ssr: false })
const LoginScreen = dynamic(() => import('./system/login-screen'), { ssr: false })
const Desktop = dynamic(() => import('./desktop/desktop'), { ssr: false })

export default function Home() {
  const { state, setState } = useSystem()

  if (state === 'initializing') {
    return <div className="fixed inset-0 bg-black" />
  }

  if (state === 'shutdown') {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <button 
          onClick={() => setState('booting')}
          className="group flex flex-col items-center gap-4 transition-all"
        >
          <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <Power className="w-6 h-6 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
          </div>
          <span className="text-[10px] font-mono text-zinc-600 group-hover:text-emerald-500/70 tracking-[0.2em] uppercase transition-colors">
            Power On
          </span>
        </button>
      </div>
    )
  }

  if (state === 'booting') {
    return <BootScreen />
  }

  if (state === 'login') {
    return <LoginScreen />
  }

  if (state === 'desktop') {
    return <Desktop />
  }

  return null
}
