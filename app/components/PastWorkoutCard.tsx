'use client';

import type { WorkoutWithExercises } from "../types/workoutType";

type PastWorkoutCardProps = {
    workout: WorkoutWithExercises;
    onClick?: () => void;
};

export default function PastWorkoutCard({ workout, onClick }: PastWorkoutCardProps) {
    return (
        <div className="p-4 w-full">
            <div
                onClick={onClick}
                className="border rounded p-2 w-full flex flex-col gap-2 cursor-pointer hover:bg-zinc-50"
            >
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white">{workout.name || "Workout"}</h3>
                    <p className="text-sm text-white">{workout.date}</p>
                </div>

                {workout.workout_exercises.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-white">
                        {workout.workout_exercises.map((workout) => (
                            <li key={workout.id}>
                                {workout.exercises.name} — {workout.sets.length} {workout.sets.length === 1 ? "set" : "sets"}

                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}