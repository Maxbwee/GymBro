'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function ProfilePage() {

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
    })

    return () => subscription.unsubscribe()
  }, [router]);

  const initials = user?.email?.charAt(0).toUpperCase() ?? "?";

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
        <p className="text-black font-medium">{user?.email}</p>
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