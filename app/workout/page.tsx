'use client';

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import SearchExercises from "../components/ExerciseSearch";
import WorkoutTimer from "../components/WorkoutTimer";
import { Exercise } from "../types/exercise";
import WorkoutExerciseCard from "../components/WorkoutExerciseCard";
import { WorkoutExerciseDraft } from "../types/workoutType";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/dist/client/components/navigation";
import { saveWorkout, saveWorkoutExercises } from "../lib/workouts";

export default function WorkoutPage() {


    const [started, setStarted] = useState(false);
    const [startTime, setStartTime] = useState<number>(0);
    const [exercises, setExercises] = useState<WorkoutExerciseDraft[]>([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [workoutName, setWorkoutName] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.push('/login')
            } else {
                setUser(session.user)
                setLoading(false)
            }
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.push('/login')
            } else {
                setUser(session.user)
            }
        })

        return () => subscription.unsubscribe()
    }, [router]);

    function handleStart() {
        setStartTime(Date.now());
        setStarted(true);
    }

    function handleAddExercise(exercise: Exercise) {
        const newDraft: WorkoutExerciseDraft = {
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            sets: [{ id: crypto.randomUUID(), weight: 0, reps: 0 }],
        };
        setExercises((prev) => [...prev, newDraft]);
    }

    function handleExerciseChange(index: number, updated: WorkoutExerciseDraft) {
        setExercises((prev) => prev.map((ex, i) => (i === index ? updated : ex)));
    }

    function handleExerciseDelete(index: number) {
        setExercises((prev) => prev.filter((_, i) => i !== index));
    }

    async function handleWorkoutComplete() {
        if (!user) return;
        setLoading(true);

        try {
            const workoutDate = new Date().toISOString().split('T')[0];
            const workout = await saveWorkout(user.id, workoutName, workoutDate);  
            await saveWorkoutExercises(workout.id, exercises);

            setStarted(false);
            setExercises([]);
            setWorkoutName("");
            router.push('/');
        } catch (error) {
            console.error("Failed to save workout:", error);
        } finally {
            setLoading(false);
        }
    }
 
    return (
        <div className="flex flex-col items-center gap-4 p-4 pb-32 w-full">
            {!started ? (
                <button
                    onClick={handleStart}
                    className="bg-black text-white rounded-full px-6 py-3"
                >
                    Start Workout
                </button>
            ) : (
                <>
                    <input 
                    type="text" 
                    value={workoutName} 
                    onChange={(e) => setWorkoutName(e.target.value)} 
                    className="text-xl font-bold text-center w-full bg-transparent border-b border-gray-300 focus:outline-none" 
                    placeholder="Workout Name"
                    />
                    <WorkoutTimer isRunning={started} startTime={startTime} />
                    <SearchExercises onSelect={handleAddExercise} />
                    {exercises.map((exercise, index) => (
                        <WorkoutExerciseCard
                            key={index}
                            exercise={exercise}
                            onChange={(updated) => handleExerciseChange(index, updated)}
                            onDelete={() => handleExerciseDelete(index)}
                        />
                    ))}
                    <button onClick={handleWorkoutComplete} className="bg-green-500 text-white rounded-full px-6 py-3 fixed bottom-25 left-1/2 -translate-x-1/2 z-20 sm:bottom-6">
                        Complete Workout
                    </button>
                </>
            )}
        </div>
    )
}