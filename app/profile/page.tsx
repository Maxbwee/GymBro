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

    return(
        <div className="flex flex-col gap-4 text-base font-medium items-center">
        <button
            onClick={() => supabase.auth.signOut()}
            className="h-12 w-full gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
          >
            Sign Out
          </button>
          </div>
    );
}