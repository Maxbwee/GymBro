'use client'

import Image from "next/image";
import { useState, useRef } from "react";
import { getExerciseByName } from "../lib/exercises";
import { Exercise } from "../types/exercise";

const PAGE_SIZE = 10;

type ExerciseSearchProps = {
    onSelect: (exercise: Exercise) => void;
};

export default function ExerciseSearch({ onSelect }: ExerciseSearchProps) {

    const [search, setSearch] = useState("");
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const latestQuery = useRef("");
    const listContainerRef = useRef<HTMLDivElement>(null);

    async function runSearch(value: string, pageToLoad: number) {
        latestQuery.current = value;

        if (!value) {
            setExercises([]);
            setTotalCount(0);
            return;
        }

        const { data, count } = await getExerciseByName(value, pageToLoad);

        if (latestQuery.current !== value) return;

        setExercises(data || []);
        setTotalCount(count);
    }

    function handleExerciseSearch(value: string) {
        setSearch(value);
        setPage(0);
        runSearch(value, 0);
    }

    function handleSelect(exercise: Exercise) {
        onSelect(exercise);
        setSearch("");
        setExercises([]);
        setPage(0);
        setTotalCount(0);
    }

    function scrollListToTop() {
        if (listContainerRef.current) {
            listContainerRef.current.scrollTop = 0;
        }
    }

    function goToNextPage() {
        const nextPage = page + 1;
        setPage(nextPage);
        runSearch(search, nextPage);
        scrollListToTop();
    }

    function goToPrevPage() {
        const prevPage = Math.max(page - 1, 0);
        setPage(prevPage);
        runSearch(search, prevPage);
        scrollListToTop();
    }

    const hasNextPage = (page + 1) * PAGE_SIZE < totalCount;
    const hasPrevPage = page > 0;

    return (
        <div className="relative w-full bg-black text-white rounded-full px-6 py-3">
            <input
                type="text"
                value={search}
                onChange={(e) => handleExerciseSearch(e.target.value)}
                placeholder="Search exercises..."
                className="border p-2 rounded w-full text-white"
            />

            {exercises.length > 0 && (
                <div
                    ref={listContainerRef}
                    className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border rounded shadow-lg max-h-80 overflow-y-auto"
                >
                    <ul className="list-none p-0 m-0 flex flex-col">
                        {exercises.map((exercise) => (
                            <li
                                key={exercise.id}
                                className="flex items-center gap-3 p-2 hover:bg-zinc-100 cursor-pointer"
                                onClick={() => handleSelect(exercise)}
                            >
                                {exercise.images?.[0] && (
                                    <div className="relative w-20 h-20 shrink-0">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_EXERCISE_IMAGE_URL}/${exercise.images[0]}`}
                                            alt={exercise.name}
                                            fill
                                            style={{ objectFit: "contain" }}
                                            unoptimized
                                        />
                                    </div>
                                )}
                                <span className="text-black text-sm">{exercise.name}</span>
                            </li>
                        ))}
                    </ul>

                    {(hasPrevPage || hasNextPage) && (
                        <div className="flex justify-between items-center p-2 border-t text-black text-sm">
                            <button
                                onClick={goToPrevPage}
                                disabled={!hasPrevPage}
                                className="disabled:opacity-30"
                            >
                                Previous
                            </button>
                            <span className="text-zinc-500">Page {page + 1}</span>
                            <button
                                onClick={goToNextPage}
                                disabled={!hasNextPage}
                                className="disabled:opacity-30"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}