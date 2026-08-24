'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";
import type { User } from "@supabase/supabase-js";
import SearchExercises from "./components/ExerciseSearch";
import { Exercise } from "./types/exercise";



export default function Home() {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();



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
  }, [router])

  if (loading) return null




  return (     
        <div className="flex flex-col gap-4 text-base font-medium items-center">
        <h1 className="text-2xl font-bold">Welcome to Gym Bro!</h1>

        
        </div>
  );
}
