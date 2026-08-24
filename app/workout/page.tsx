'use client';

import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import WorkoutTimer from "../components/WorkoutTimer";
export default function WorkoutPage() {



    const [started, setStarted] = useState(false);
    const [startTime, setStartTime] = useState<number>(0);


    function handleStart() {
        setStartTime(Date.now());
        setStarted(true);
    }

    return (
        <div className="flex flex-col items-center gap-4 p-4 w-full">
            {!started ? (
                <button
                    onClick={handleStart}
                    className="bg-black text-white rounded-full px-6 py-3"
                >
                    Start Workout
                </button>
            ) : (
                <>
                    <WorkoutTimer isRunning={started} startTime={startTime} />
                </>
            )}



        </div>
    )
}