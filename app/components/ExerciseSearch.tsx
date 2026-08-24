'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import { getExercises, getExerciseByName, getExercisesByEquipment } from "../lib/exercises";
import { Exercise } from "../types/exercise";

type ExerciseSearchProps = {
    onSelect: (exercise: Exercise) => void;
};

export default function ExerciseSearch({ onSelect }: ExerciseSearchProps) {

    const [search, setSearch] = useState("");
    const [exercises, setExercises] = useState<Exercise[]>([]);

    async function handleExerciseSearch(value: string) {
        setSearch(value);
        if (value) {
            const exercisesByName = await getExerciseByName(value);
            setExercises(exercisesByName || []);
        } else {
            const allExercises = await getExercises();
            setExercises(allExercises);
        }
    }

    function handleSelect(exercise: Exercise) {
        onSelect(exercise);
        setSearch("");
        setExercises([]);
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <input
                type="text"
                value={search}
                onChange={(e) => handleExerciseSearch(e.target.value)}
                placeholder="Search exercises..."
            />
            <ul className="list-none p-0 m-0 flex flex-col items-center gap-4 w-full">
                {exercises.map((exercise) => (
                    <li 
                    key={exercise.id} 
                    className="flex flex-col items-center"
                    onClick={() => handleSelect(exercise)}
                    >
                        <div className="flex flex-col items-center gap-2">
                            {exercise.name}
                            {exercise.images?.map((image: string, idx: number) => (
                                <div key={idx} className="relative w-[200px] h-[200px]">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_EXERCISE_IMAGE_URL}/${image}`}
                                        alt={exercise.name}
                                        fill
                                        style={{ objectFit: "contain" }}
                                        unoptimized
                                    />
                                </div>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}