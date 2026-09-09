'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import { getWorkoutsWithExercises } from "../lib/workouts";

export default function ProfilePage() {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [totalLoggedWeight, setTotalLoggedWeight] = useState<number>(0);
  const [totalWorkouts, setTotalWorkouts] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [lastLoggedDate, setLastLoggedDate] = useState<Date | null>(null);
  const [favouriteExerciseName, setFavouriteExerciseName] = useState<string>("");

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
    })

    return () => subscription.unsubscribe()
  }, [router]);

  useEffect(() => {
    const getUserWorkoutStats = async () => {
      const workouts = await getWorkoutsWithExercises();
      if (user) {
        const totalLoggedWeight = workouts.reduce((total, workout) => {
          const workoutWeight = workout.workout_exercises.reduce((exerciseTotal: number, workoutExercise: { sets: { weight: number; reps: number }[] }) => {
            const exerciseWeight = workoutExercise.sets.reduce((setTotal: number, set: { weight: number; reps: number }) => {
              return setTotal + (set.weight * set.reps);
            }, 0);
            return exerciseTotal + exerciseWeight;
          }, 0);
          return total + workoutWeight;
        }, 0);
        setTotalLoggedWeight(totalLoggedWeight);
        setTotalWorkouts(workouts.length);
        setLastLoggedDate(workouts.date)
      }
        console.log(workouts);
      
    };
    getUserWorkoutStats();
  },[user]);

    useEffect(() => {
    const fetchFavouriteExercise = async () => {
      const name = await favouriteExercise();
      setFavouriteExerciseName(name);
    };
    fetchFavouriteExercise();
  }, [user]);


  const initials = user?.email?.charAt(0).toUpperCase() ?? "?";
  
  const favouriteExercise = async () => {
    const workouts = await getWorkoutsWithExercises();
    const exerciseCount: { [key: string]: number } = {};
    workouts.forEach((workout) => {
      workout.workout_exercises.forEach((workoutExercise) => {
        const exerciseName = workoutExercise.exercises.name;
        if (exerciseCount[exerciseName]) {
          exerciseCount[exerciseName]++;
        } else {
          exerciseCount[exerciseName] = 1;
        }
      });
    });
    return Object.keys(exerciseCount).reduce((a, b) => exerciseCount[a] > exerciseCount[b] ? a : b, "");
  };


  async function handleFeedbackSubmit() {
    if (!feedback.trim()) return;

    setFeedbackStatus("sending");

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: feedback, userEmail: user?.email }),
      });

      if (!response.ok) throw new Error();
      setFeedbackStatus("sent");
      setFeedback("");
    } catch {
      setFeedbackStatus("error");
    }
  }

  return (
    <main className="flex flex-col items-center gap-6 p-6 pb-32 bg-zinc-50 min-h-screen">
      <header className="flex flex-col items-center gap-3 mt-4">
        <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold shadow-md">
          {initials}
        </div>
        <h1 className="text-2xl font-bold text-black">Your Profile</h1>
      </header>

      <section className="w-full max-w-sm bg-white rounded-xl shadow p-5 flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase text-zinc-400 tracking-wide">Email</span>
        <p className="text-zinc-600 font-medium">{user?.email}</p>
      </section>

      <section className="w-full max-w-sm bg-white rounded-xl shadow p-5 flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase text-zinc-400 tracking-wide">Stats</span>
        <p className="text-zinc-600 font-medium p-1">Total workouts logged: {totalWorkouts}</p>
        <p className="text-zinc-600 font-medium p-1">Current streak</p>
        <p className="text-zinc-600 font-medium p-1">Total logged weight: {totalLoggedWeight > 0 ? totalLoggedWeight + " kg" : ""}</p>
        <p className="text-zinc-600 font-medium p-1">Most logged exercise: {favouriteExerciseName}</p>
      </section>

      <section className="w-full max-w-sm bg-white rounded-xl shadow p-5 flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase text-zinc-400 tracking-wide">Feedback</span>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us what you think!"
          rows={3}
          className="text-black border border-zinc-200 rounded p-2 text-sm focus:outline-none focus:border-black resize-none"
        />
        <button
          onClick={handleFeedbackSubmit}
          disabled={feedbackStatus === "sending" || !feedback.trim()}
          className="self-end text-sm font-semibold text-black hover:text-zinc-700 disabled:opacity-30"
        >
          {feedbackStatus === "sending" ? "Sending..." : "Send"}
        </button>
        {feedbackStatus === "sent" && <p className="text-xs text-green-600">Thanks for your feedback!</p>}
        {feedbackStatus === "error" && <p className="text-xs text-red-500">Something went wrong, try again.</p>}
        <p className="text-black font-medium"></p>
      </section>


      <div className="fixed bottom-24 left-6 right-6 sm:bottom-6 sm:left-auto sm:right-6 sm:w-56 flex flex-col items-center">
        <button
          onClick={() => supabase.auth.signOut()}
          className="w-full h-12 rounded-full bg-red-500 text-white font-semibold shadow-md transition-colors hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}