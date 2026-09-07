'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { WorkoutWithExercises } from "./types/workoutType";
import PastWorkoutCard from "./components/PastWorkoutCard";
import { getWorkoutsWithExercises } from "./lib/workouts";




export default function Home() {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([]);



    useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
      }
    });

    return () => subscription.unsubscribe()
  }, [router]);

    useEffect(() => {
    if(user) {
      getWorkoutsWithExercises().then(setWorkouts)
    }
  }, [user]);

  if (loading) return null


  return (
        <main className="flex flex-col items-center gap-6 p-6 pb-32 bg-zinc-50 min-h-screen">
          <header className="flex flex-col items-center gap-1 mt-4 text-center">
            <h1 className="text-2xl font-bold text-black">Welcome to Gym Bro!</h1>
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Your Past Workouts</h2>
          </header>

          <section className="w-full max-w-sm flex flex-col gap-4">
            {workouts.length === 0 && (
              <p className="text-center text-zinc-400 text-sm">No past workouts found.</p>
            )}
            {workouts.map((workout) => (
              <PastWorkoutCard key={workout.id} workout={workout} />
            ))}
          </section>
        </main>
  );
}
