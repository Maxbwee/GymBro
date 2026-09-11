import { getExercisesByMuscleGroup } from "../lib/exercises";
import { Exercise } from "../types/exercise";
import { useState, useEffect, useRef } from "react";
import type { MuscleGroupFilter } from "../types/exercise";
import { MUSCLE_GROUPS } from "../types/exercise";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function ExercisesByMuscleGroup({ primaryMuscle = "all" }: { primaryMuscle?: MuscleGroupFilter }) {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroupFilter>(primaryMuscle);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const listContainerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const PAGE_SIZE = 10;


    useEffect(() => {
        async function fetchExercises() {
            const { data, count } = await getExercisesByMuscleGroup(selectedMuscleGroup, page);
            setExercises(data || []);
            setTotalCount(count ?? 0);
        }
        fetchExercises();
    }, [selectedMuscleGroup, page]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleSelectMuscleGroup(muscle: MuscleGroupFilter) {
        setSelectedMuscleGroup(muscle);
        setPage(0);
        setIsDropdownOpen(false);
    }

    function scrollListToTop() {
        if (listContainerRef.current) {
            listContainerRef.current.scrollTop = 0;
        }
    }

    function goToNextPage() {
        const nextPage = page + 1;
        setPage(nextPage);

        scrollListToTop();
    }

    function goToPrevPage() {
        const prevPage = Math.max(page - 1, 0);
        setPage(prevPage);
        scrollListToTop();
    }

    const hasNextPage = (page + 1) * PAGE_SIZE < totalCount;
    const hasPrevPage = page > 0;

    return (
        <div className="w-full max-w-sm flex flex-col gap-4">
            <div ref={dropdownRef} className="relative">
                <button
                    type="button"
                    onClick={() => setIsDropdownOpen((open) => !open)}
                    className="w-full h-12 px-4 flex items-center justify-between rounded-full bg-white pink:bg-pink-100 border border-zinc-200 pink:border-pink-200 text-black pink:text-pink-900 text-base shadow-sm focus:outline-none focus:border-black pink:focus:border-pink-400"
                >
                    <span className="capitalize">{selectedMuscleGroup === "all" ? "All Muscle Groups" : selectedMuscleGroup}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 pink:text-pink-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {isDropdownOpen && (
                    <ul className="absolute top-full left-0 right-0 z-10 mt-1 bg-white pink:bg-pink-100 border border-zinc-200 pink:border-pink-200 rounded-xl shadow-lg max-h-64 overflow-y-auto py-1">
                        <li
                            onClick={() => handleSelectMuscleGroup("all")}
                            className="px-4 py-2 text-base text-black pink:text-pink-900 hover:bg-zinc-100 pink:hover:bg-pink-200 cursor-pointer"
                        >
                            All Muscle Groups
                        </li>
                        {MUSCLE_GROUPS.map((muscle) => (
                            <li
                                key={muscle}
                                onClick={() => handleSelectMuscleGroup(muscle)}
                                className="px-4 py-2 text-base capitalize text-black pink:text-pink-900 hover:bg-zinc-100 pink:hover:bg-pink-200 cursor-pointer"
                            >
                                {muscle}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <ul className="flex flex-col gap-3">
                {exercises.map((exercise) => (
                    <li
                        key={exercise.id}
                        className="bg-white pink:bg-pink-100 rounded-xl shadow p-4 flex flex-col gap-1"
                    >
                        <h3 className="text-lg font-semibold text-black pink:text-pink-900">{exercise.name}</h3>
                        <p className="text-sm text-zinc-500 pink:text-pink-400">Equipment: {exercise.equipment}</p>
                        <p className="text-sm text-zinc-500 pink:text-pink-400">Force: {exercise.force}</p>
                        <p className="text-sm text-zinc-500 pink:text-pink-400">Mechanics: {exercise.mechanic}</p>
                        <p className="text-sm text-zinc-500 pink:text-pink-400">Primary Muscles: {exercise.primary_muscles.join(", ")}</p>
                        {exercise.images && exercise.images.length > 0 && (
                            <div className="flex gap-2 mt-1">
                                {exercise.images.slice(0, 2).map((image, idx) => (
                                    <div key={idx} className="relative w-36 h-36 shrink-0 bg-zinc-50 pink:bg-pink-50 rounded-lg overflow-hidden">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_EXERCISE_IMAGE_URL}/${image}`}
                                            alt={`${exercise.name} ${idx + 1}`}
                                            fill
                                            style={{ objectFit: "contain" }}
                                            unoptimized
                                        />
                                    </div>
                                ))}
                            </div>

                        )}
                    </li>
                ))}
            </ul>
            {(hasPrevPage || hasNextPage) && (
                <div className="flex justify-between items-center p-4 border-t border-zinc-200 pink:border-pink-200 text-black pink:text-pink-900 text-sm">
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
    );

}