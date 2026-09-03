'use client';

import { WorkoutExerciseDraft } from "../types/workoutType";
import SetRow from "./SetRow";

type WorkoutExerciseCardProps = {
    exercise: WorkoutExerciseDraft;
    onChange: (updatedExercise: WorkoutExerciseDraft) => void;
    onDelete: () => void;
}

export default function WorkoutExerciseCard({ exercise, onChange, onDelete }: WorkoutExerciseCardProps) {

    const handleSetChange = (index: number, weight: number, reps: number) => {
        const updatedSets = [...exercise.sets];
        updatedSets[index] = { ...updatedSets[index], weight, reps };
        onChange({ ...exercise, sets: updatedSets });
    };

    const handleAddSet = () => {
        const updatedSets = [...exercise.sets, { id: crypto.randomUUID(), weight: 0, reps: 0 }];
        onChange({ ...exercise, sets: updatedSets });
    }

    const handleRemoveSet = (index: number) => {
        const updatedSets = exercise.sets.filter((_, i) => i !== index);
        onChange({ ...exercise, sets: updatedSets });
    }

    return (
        <div className="border rounded p-4 flex flex-col gap-3 w-full">
            <div className="flex justify-between items-center">
                <h3 className="font-bold">{exercise.exerciseName}</h3>
                <button className="text-sm text-red-500" onClick={onDelete}>Delete</button>
            </div>

            <div className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 text-xs font-semibold text-zinc-500 px-1">
                <span className="text-center">Set</span>
                <span className="text-center">Kg</span>
                <span className="text-center">Reps</span>
                <span></span>
            </div>

            {exercise.sets.map((set, index) => (
                <SetRow
                    key={set.id}
                    setNumber={index + 1}
                    weight={set.weight}
                    reps={set.reps}
                    onChange={(weight, reps) => handleSetChange(index, weight, reps)}
                    onRemove={() => handleRemoveSet(index)}
                />
            ))}

            <button onClick={handleAddSet} className="text-sm text-blue-500 self-start">
                + Add Set
            </button>
        </div>
    );
};