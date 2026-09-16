'use client';

import ExercisesByMuscleGroup from "../components/ExercisesByMuscleGroup";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";


export default function ExercisesPage() {

      const router = useRouter();
      const [user, setUser] = useState<User | null>(null);
      const [loading, setLoading] = useState(true);

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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4">Exercises</h1>
            <ExercisesByMuscleGroup />
        </div>
    );
}