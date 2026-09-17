'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { WorkoutWithExercises } from "./types/workoutType";
import PastWorkoutCard from "./components/PastWorkoutCard";
import { getWorkoutsWithExercises } from "./lib/workouts";
import Loading from "./components/Loading";



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
    const fetchWorkouts = async () => {
      setLoading(true);
      if(user) {
        await getWorkoutsWithExercises().then(setWorkouts);
      }
      setLoading(false);
    }
    fetchWorkouts();
    
  }, [user]);

  if (loading) return <Loading />;

  const handleWorkoutDelete = async () => {
    try {
      setLoading(true);
      await getWorkoutsWithExercises().then(setWorkouts);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutUpdate = async () => {
    try {
      setLoading(true);
      await getWorkoutsWithExercises().then(setWorkouts);
    } finally {
      setLoading(false);
    }
  };

  return (
        <main className="flex flex-col items-center gap-6 p-6 pb-32 bg-zinc-50 pink:bg-pink-50 min-h-screen">
          <header className="flex flex-col items-center gap-1 mt-4 text-center">
            <h1 className="text-2xl font-bold text-black pink:text-pink-900">Welcome to Gym Bro!</h1>
            <h2 className="text-sm font-semibold text-zinc-400 pink:text-pink-400 uppercase tracking-wide">Your Past Workouts</h2>
          </header>

          <section className="w-full max-w-sm flex flex-col gap-4">
            {workouts.map((workout) => (
              <PastWorkoutCard key={workout.id} workout={workout} onDelete={handleWorkoutDelete} onUpdate={handleWorkoutUpdate} />
            ))}
          </section>
        </main>
  );
}
