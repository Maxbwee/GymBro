'use client';

import type { WorkoutWithExercises } from "../types/workoutType";
import { deleteWorkout } from "../lib/workouts";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

type PastWorkoutCardProps = {
    workout: WorkoutWithExercises;
    onClick?: () => void;
    onDelete?: () => void;
};

export default function PastWorkoutCard({ workout, onClick, onDelete }: PastWorkoutCardProps) {

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleConfirmDelete = async () => {
        try {
            await deleteWorkout(workout.id);
            onDelete?.();
        } catch (error) {
            console.error("Error deleting workout:", error);
        } finally {
            setShowConfirmDialog(false);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmDialog(false);
    };

    const formattedDate = new Date(workout.date).toLocaleDateString("en-GB");

    return (
        <div
            onClick={onClick}
            className="w-full bg-white pink:bg-pink-100 rounded-xl shadow p-5 flex flex-col gap-2 cursor-pointer hover:bg-zinc-50 pink:hover:bg-pink-200 transition-colors"
        >
            <p className="text-xs text-zinc-400 pink:text-pink-400">{formattedDate}</p>
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-black pink:text-pink-900">{workout.name || "Workout"}</h3>
                <button onClick={(e) => { e.stopPropagation(); setShowConfirmDialog(true); }} className="text-sm text-red-500 pink:text-rose-400 hover:text-red-600 pink:hover:text-rose-500">
                    Delete
                </button>
                <ConfirmDialog
                    open={showConfirmDialog}
                    title="Delete Workout"
                    message="Are you sure you want to delete this workout? This action cannot be undone."
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            </div>

            {workout.workout_exercises.length > 0 && (
                <ul className="list-disc list-inside text-sm text-black pink:text-pink-900 flex flex-col gap-1">
                    {workout.workout_exercises.map((workout) => (
                        <li key={workout.id}>
                            {workout.exercises.name} — {workout.sets.length} {workout.sets.length === 1 ? "set" : "sets"}
                            {workout.sets.length > 0 && (
                                <ul className="list-inside indent-1 text-xs text-zinc-500 pink:text-pink-500 p-2">
                                    {workout.sets.map((set, index) => (
                                        <li key={index}>
                                            Set {set.set_number}: {set.reps} reps x {set.weight}kg
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