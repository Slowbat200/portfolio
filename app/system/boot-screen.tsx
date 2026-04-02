'use client'

import { useEffect, useState } from "react"
import { useSystem } from "./system-context"

const LOGS = [
    'Initializing SlowbatOS kernel...',
    'Loading core modules...',
    'Mounting virtual filesystem...',
    'Starting window manager...',
    'System ready',
];

/**
 * BootScreen - Simulates the OS kernel initialization sequence.
 * Displays a series of fake kernel logs and transitions to the login screen.
 */
export default function BootScreen() {
    const {setState} = useSystem();
    const [line, setLine] = useState(0)

    /**
     * Effect to cycle through the boot logs at a set interval.
     * Transitions to the login screen once all logs are "displayed".
     */
    useEffect(() => {
        if(line < LOGS.length) {
         const t = setTimeout(() => setLine(line + 1), 450);
         return () => clearTimeout(t);
        }else{
            // End of boot sequence - transition to login screen
            setTimeout(() => {
                sessionStorage.setItem('booted', 'true');
                setState('login');
            }, 600)
        }
    }, [line, setLine])

    return(
        <div className="fixed inset-0 bg-black text-green-500 font-mono p-6">
            {/* Display logs up to current line index */}
            {LOGS.slice(0, line).map((log, i) =>(
                <p key={i}>[ OK ] {log}</p>
            ))}

            {/* Skip button for convenience */}
            <button onClick={() => {
                sessionStorage.setItem('booted', 'true')
                setState('login');
            }} className="absolute bottom-4 right-4 text-xs opacity-60 hover:opacity-100">Skip boot</button>
        </div>
    )
}