import {supabase} from './supabase';
import { WorkoutExerciseDraft } from '../types/workoutType';

export async function getWorkouts() {
    const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .order('date', { ascending: false });
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function getWorkoutsWithExercises() {
    const { data, error } = await supabase
    .from('workouts')
    .select(`
        *,
        workout_exercises (
            *,
            exercises (name),
            sets (*)
        )
    `)
    .order('date', { ascending: false });
    if (error) {
        throw new Error(error.message);
    }
    return data;
}


export async function saveWorkout(userId: string, name: string, date: string) {
    const { data, error } = await supabase
    .from('workouts')
    .insert([{ user_id: userId, name, date }])
    .select()
    .single();
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function saveWorkoutExercises(workoutId: string, exercises: WorkoutExerciseDraft[]) {
    for (let i = 0; i < exercises.length; i++) {
        const { exerciseId, sets } = exercises[i];

        const { data: workoutExercise, error: weError } = await supabase
            .from('workout_exercises')
            .insert({ workout_id: workoutId, exercise_id: exerciseId, order: i })
            .select()
            .single();

        if (weError) throw new Error(weError.message);

        const setsPayload = sets.map((set, index) => ({
            workout_exercise_id: workoutExercise.id,
            set_number: index + 1,
            weight: set.weight,
            reps: set.reps,
        }));

        const { error: setsError } = await supabase.from('sets').insert(setsPayload);
        if (setsError) throw new Error(setsError.message);
    }
}