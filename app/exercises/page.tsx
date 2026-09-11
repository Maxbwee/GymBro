'use client';

import ExercisesByMuscleGroup from "../components/ExercisesByMuscleGroup";


export default function ExercisesPage() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4">Exercises</h1>
            <ExercisesByMuscleGroup />
        </div>
    );
}