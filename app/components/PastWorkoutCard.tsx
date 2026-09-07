'use client';

import type { WorkoutWithExercises } from "../types/workoutType";

type PastWorkoutCardProps = {
    workout: WorkoutWithExercises;
    onClick?: () => void;
};

export default function PastWorkoutCard({ workout, onClick }: PastWorkoutCardProps) {
    return (
        <div
            onClick={onClick}
            className="w-full bg-white rounded-xl shadow p-5 flex flex-col gap-2 cursor-pointer hover:bg-zinc-50 transition-colors"
        >
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-black">{workout.name || "Workout"}</h3>
                <p className="text-xs text-zinc-400">{workout.date}</p>
            </div>

            {workout.workout_exercises.length > 0 && (
                <ul className="list-disc list-inside text-sm text-black flex flex-col gap-1">
                    {workout.workout_exercises.map((workout) => (
                        <li key={workout.id}>
                            {workout.exercises.name} — {workout.sets.length} {workout.sets.length === 1 ? "set" : "sets"}
                            {workout.sets.length > 0 && (
                                <ul className="list-inside indent-1 text-xs text-zinc-500 p-2">
                                    {workout.sets.map((set, index) => (
                                        <li key={index}>
                                            Set {set.set_number}: {set.weight}kg x {set.reps} reps
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}