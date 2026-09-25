'use client';

import { useState, useEffect, useRef } from "react";


export default function WorkoutTimer({ isRunning, startTime }: { isRunning: boolean, startTime: number }) {
    const [elapsed, setElapsed] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);


    useEffect(() => {
        function tick() {
            setElapsed(Math.floor((Date.now() - startTime) / 1000));
        }
        if (isRunning) {
            tick(); // update immediately on resume/mount
            intervalRef.current = setInterval(tick, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, startTime]);

    // Recalculate immediately when the app comes back to the foreground
    useEffect(() => {
        function handleVisibilityChange() {
            if (document.visibilityState === "visible" && isRunning) {
                setElapsed(Math.floor((Date.now() - startTime) / 1000));
            }
        }
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [isRunning, startTime]);

    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;

    return (
        <div className="text-2xl font-mono text-black pink:text-pink-900">
            {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
        </div>
    )

}