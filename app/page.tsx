'use client'

import { useSystem } from './system/system-context'
import BootScreen from './system/boot-screen'
import LoginScreen from './system/login-screen'
import Desktop from './desktop/desktop'

export default function Home() {
  const { state } = useSystem()

  if (state === 'initializing') {
    return <div className="fixed inset-0 bg-black" />
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
