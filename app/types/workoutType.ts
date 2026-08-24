export type Workout = {
    id: string;
    user_id: string;
    name: string;
    date: string;
    created_at: string;
}
export type WorkoutExercise = {
    id: string;
     workout_id: string;
    exercise_id: string;
    order: number;
};

export type Set = {
    id: string;
    workout_exercise_id: string;
    set_number: number;
    weight: number;
    reps: number;
    completed: boolean;
};

export type SetDraft = Pick<Set, "weight" | "reps">;

export type WorkoutExerciseDraft = {
    exerciseId: string;
    exerciseName: string;
    sets: SetDraft[];
};