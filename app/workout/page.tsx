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
import { useWorkoutSession } from "../context/WorkoutSessionContext";
import Loading from "../components/Loading";
import ConfirmDialog from "../components/ConfirmDialog";

export default function WorkoutPage() {


    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [showCancelWorkoutDialog, setShowCancelWorkoutDialog] = useState(false);
    const [showCompleteWorkoutDialog, setShowCompleteWorkoutDialog] = useState(false);
    const {
        started, startTime, workoutName, exercises,
        startWorkout, setWorkoutName, addExercise, updateExercise, removeExercise, resetWorkout,
    } = useWorkoutSession();

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
        startWorkout();
    }

    function handleAddExercise(exercise: Exercise) {
        addExercise({
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            sets: [{ id: crypto.randomUUID(), weight: 0, reps: 0 }],
        });
    }

    function handleExerciseChange(index: number, updated: WorkoutExerciseDraft) {
        updateExercise(index, updated);
    }

    function handleExerciseDelete(index: number) {
        removeExercise(index);
    }

    async function handleWorkoutComplete() {
        if (!user) return;
        setLoading(true);

        try {
            const workoutDate = new Date().toISOString().split('T')[0];
            const workout = await saveWorkout(user.id, workoutName, workoutDate);
            await saveWorkoutExercises(workout.id, exercises);

            resetWorkout();
            router.push('/');
        } catch (error) {
            console.error("Failed to save workout:", error);
        } finally {
            setLoading(false);
            setShowCompleteWorkoutDialog(false);
        }
    }

    function handleWorkoutCancel() {
        resetWorkout();
        setShowCancelWorkoutDialog(false);
    }

    return (
        <main className="flex flex-col items-center gap-4 p-4 pb-32 bg-zinc-50 pink:bg-pink-50 min-h-screen w-full">
            {!started ? (
                <button
                    onClick={handleStart}
                    className="mt-4 h-12 px-8 rounded-full bg-black pink:bg-pink-500 text-white font-semibold shadow-md transition-colors hover:bg-zinc-800 pink:hover:bg-pink-600"
                >
                    Start Workout
                </button>
            ) : (
                <>
                    <section className="w-full max-w-sm bg-white pink:bg-pink-100 rounded-xl shadow p-5 flex flex-col items-center gap-3">
                        <div className="w-full flex justify-between items-center">
                            <input
                                type="text"
                                value={workoutName}
                                onChange={(e) => setWorkoutName(e.target.value)}
                                className="text-xl font-bold text-center text-black pink:text-pink-900 flex-1 bg-transparent border-b border-zinc-200 pink:border-pink-200 focus:outline-none focus:border-black pink:focus:border-pink-400 py-1"
                                placeholder="Workout Name"
                            />
                        </div>
                        <WorkoutTimer isRunning={started} startTime={startTime} />
                        <button
                            onClick={() => setShowCancelWorkoutDialog(true)}
                            className="text-xs text-red-500 pink:text-pink-300 hover:text-red-600 pink:hover:text-rose-400 underline underline-offset-2"
                        >
                            Cancel Workout
                        </button>
                        <ConfirmDialog
                            open={showCancelWorkoutDialog}
                            title="Cancel Workout"
                            message="Are you sure you want to cancel this workout? This action cannot be undone."
                            onConfirm={handleWorkoutCancel}
                            onCancel={() => setShowCancelWorkoutDialog(false)}
                            confirmLabel="Delete"
                            variant="danger"
                        />
                    </section>

                    <div className="w-full max-w-sm">
                        <SearchExercises onSelect={handleAddExercise} />
                    </div>

                    {exercises.map((exercise, index) => (
                        <WorkoutExerciseCard
                            key={index}
                            exercise={exercise}
                            onChange={(updated) => handleExerciseChange(index, updated)}
                            onDelete={() => handleExerciseDelete(index)}
                        />
                    ))}

                    <div className="fixed bottom-24 left-6 right-6 sm:bottom-6 sm:left-auto sm:right-6 sm:w-56 flex flex-col items-center z-20">
                        {
                            loading ? (
                                <Loading />
                            ) :
                                <>
                                    <button
                                        onClick={() => setShowCompleteWorkoutDialog(true)}
                                        className="w-full h-12 rounded-full bg-green-500 pink:bg-pink-400 text-white font-semibold shadow-md transition-colors hover:bg-green-600 pink:hover:bg-pink-500"
                                    >
                                        Complete Workout
                                    </button>
                                    <ConfirmDialog
                                        open={showCompleteWorkoutDialog}
                                        title="Complete Workout"
                                        message="Are you sure you want to complete this workout?"
                                        onConfirm={handleWorkoutComplete}
                                        onCancel={() => setShowCompleteWorkoutDialog(false)}
                                        confirmLabel="Complete"
                                        variant="default"
                                    />
                                </>
                        }

                    </div>
                </>
            )}
        </main>
    )
}