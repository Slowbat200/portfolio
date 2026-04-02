'use client'

import { useState } from 'react'
import { useSystem } from './system-context'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowRight, } from 'lucide-react'

/**
 * LoginScreen - The user authentication interface.
 * Simulates a secure login with a guest profile, leading to the Desktop.
 */
export default function LoginScreen() {
    const { setState } = useSystem()
    const [isLoading, setIsLoading] = useState(false)

    /**
     * Handles the login form submission.
     * Simulates a network delay before transitioning the system to 'desktop' state.
     */
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate a small delay for the login process
        setTimeout(() => {
            sessionStorage.setItem('loggedIn', 'true')
            setState('desktop')
            setIsLoading(false)
        }, 800)
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
            {/* Background decorative elements for a modern glassmorphism look */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/5 dark:bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            {/* Login Card Container */}
            <Card className="w-full max-w-sm bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 backdrop-blur-md shadow-2xl">
                <CardHeader className="flex flex-col items-center gap-4 pt-8">
                    {/* User Avatar */}
                    <Avatar className="w-24 h-24 border-2 border-zinc-200 dark:border-zinc-800 shadow-xl">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="text-center space-y-1">
                        <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Guest</CardTitle>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Welcome back</p>
                    </div>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardFooter className="pb-8">
                        {/* Submit Button with Loading State */}
                        <Button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {/* Version Information Footer */}
            <div className="absolute bottom-6 text-zinc-400 dark:text-zinc-500 text-xs font-mono">
                SlowbatOS v1.0.4-stable
            </div>
        </div>
    )
}
