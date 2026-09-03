'use client';

import { useState } from "react";
import SearchExercises from "../components/ExerciseSearch";
import WorkoutTimer from "../components/WorkoutTimer";
import { Exercise } from "../types/exercise";
import WorkoutExerciseCard from "../components/WorkoutExerciseCard";
import { WorkoutExerciseDraft } from "../types/workoutType";
export default function WorkoutPage() {


    const [started, setStarted] = useState(false);
    const [startTime, setStartTime] = useState<number>(0);
    const [exercises, setExercises] = useState<WorkoutExerciseDraft[]>([]);


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
                    <SearchExercises onSelect={handleAddExercise} />
                    {exercises.map((exercise, index) => (
                        <WorkoutExerciseCard
                            key={index}
                            exercise= {exercise}
                            onChange={(updated) => handleExerciseChange(index, updated)}
                            onDelete={() => handleExerciseDelete(index)}
                        />
                    ))}
                </>
            )}
        </div>
    )
}