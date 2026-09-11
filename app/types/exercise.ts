export type Exercise = {
    id: string;
    name: string;
    force: string | null;
    level: string | null;
    mechanic: string | null;
    equipment: string | null;
    category: string | null;
    primary_muscles: string[];
    secondary_muscles: string[] | null;
    instructions: string[] | null;
    images: string[] | null;
};

export const MUSCLE_GROUPS = [
    "abdominals", "abductors", "adductors", "biceps", "calves", "chest",
    "forearms", "glutes", "hamstrings", "lats", "lower back", "middle back",
    "neck", "quadriceps", "shoulders", "traps", "triceps",
] as const;

export type MuscleGroups = (typeof MUSCLE_GROUPS)[number];
export type MuscleGroupFilter = MuscleGroups | "all";