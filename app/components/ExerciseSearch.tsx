'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import { getExercises, getExerciseByName, getExercisesByEquipment } from "../lib/exercises";

export default function ExerciseSearch() {

    const [search, setSearch] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [exercises, setExercises] = useState<any[]>([]);

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

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <input
                type="text"
                value={search}
                onChange={(e) => handleExerciseSearch(e.target.value)}
                placeholder="Search exercises..."
            />
            <ul className="list-none p-0 m-0 flex flex-col items-center gap-4 w-full">
                {exercises.map((exercises) => (
                    <li key={exercises.id} className="flex flex-col items-center">
                        <div className="flex flex-col items-center gap-2">
                            {exercises.name}
                            {exercises.images?.map((image: string, idx: number) => (
                                <div key={idx} className="relative w-[200px] h-[200px]">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_EXERCISE_IMAGE_URL}/${image}`}
                                        alt={exercises.name}
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