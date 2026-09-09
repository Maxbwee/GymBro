'use client'

import Image from "next/image";
import { Search } from "lucide-react";
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
        <div className="relative w-full">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pink:text-pink-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => handleExerciseSearch(e.target.value)}
                    placeholder="Search exercises..."
                    className="w-full h-12 pl-11 pr-5 rounded-full bg-white pink:bg-pink-100 border border-zinc-200 pink:border-pink-200 text-black pink:text-pink-900 placeholder:text-zinc-400 placeholder:pink:text-pink-300 shadow-sm focus:outline-none focus:border-black pink:focus:border-pink-400"
                />
            </div>

            {exercises.length > 0 && (
                <div
                    ref={listContainerRef}
                    className="absolute top-full left-0 right-0 z-10 mt-1 bg-white pink:bg-pink-100 border pink:border-pink-200 rounded shadow-lg max-h-80 overflow-y-auto"
                >
                    <ul className="list-none p-0 m-0 flex flex-col">
                        {exercises.map((exercise) => (
                            <li
                                key={exercise.id}
                                className="flex items-center gap-3 p-2 hover:bg-zinc-100 pink:hover:bg-pink-200 cursor-pointer"
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
                                <span className="text-black pink:text-pink-900 text-sm">{exercise.name}</span>
                            </li>
                        ))}
                    </ul>

                    {(hasPrevPage || hasNextPage) && (
                        <div className="flex justify-between items-center p-2 border-t pink:border-pink-200 text-black pink:text-pink-900 text-sm">
                            <button
                                onClick={goToPrevPage}
                                disabled={!hasPrevPage}
                                className="disabled:opacity-30"
                            >
                                Previous
                            </button>
                            <span className="text-zinc-500 pink:text-pink-400">Page {page + 1}</span>
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