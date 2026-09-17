import { supabase } from './supabase';
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

export async function deleteWorkout(workoutId: string) {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', workoutId);
  if (error) {
    throw new Error(error.message);
  }
}

export async function editCompleteWorkoutName(workoutId: string, newName: string) {
  const { error, data } = await supabase
    .from('workouts')
    .update({ name: newName })
    .eq('id', workoutId);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

function getWeekStart(dateStr: string): number {
  const date = new Date(dateStr + "T00:00:00");
  const day = date.getDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat
  const diffToMonday = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diffToMonday);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function calculateWeeklyStreak(workouts: { date: string }[]): number {
  if (workouts.length === 0) return 0;

  const weekStarts = new Set(workouts.map((w) => getWeekStart(w.date)));
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

  let cursor = getWeekStart(new Date().toISOString().split("T")[0]);
  if (!weekStarts.has(cursor)) {
    cursor -= oneWeekMs; // nothing logged yet this week — check last week instead
  }

  let streak = 0;
  while (weekStarts.has(cursor)) {
    streak++;
    cursor -= oneWeekMs;
  }

  return streak;
}


export function calculateFavouriteExercise(workouts: { workout_exercises: { exercises: { name: string } }[] }[]): string {
  const exerciseCount: { [key: string]: number } = {};
  workouts.forEach((workout) => {
    workout.workout_exercises.forEach((workoutExercise) => {
      const exerciseName = workoutExercise.exercises.name;
      exerciseCount[exerciseName] = (exerciseCount[exerciseName] ?? 0) + 1;
    });
  });
  return Object.keys(exerciseCount).reduce((a, b) => exerciseCount[a] > exerciseCount[b] ? a : b, "");
}

export function calculateTotalLoggedWeight(workouts: { workout_exercises: { sets: { weight: number; reps: number }[] }[] }[]): number {
  return workouts.reduce((total, workout) => {
    const workoutWeight = workout.workout_exercises.reduce((exerciseTotal: number, workoutExercise: { sets: { weight: number; reps: number }[] }) => {
      const exerciseWeight = workoutExercise.sets.reduce((setTotal: number, set: { weight: number; reps: number }) => {
        return setTotal + (set.weight * set.reps);
      }, 0);
      return exerciseTotal + exerciseWeight;
    }, 0);
    return total + workoutWeight;
  }, 0);
}