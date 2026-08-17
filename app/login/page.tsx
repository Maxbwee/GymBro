'use client';

import {useState} from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold" style={{color: 'black'}}>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded text-black"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 p-2 rounded"
        >
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </button>

      </form>
    </div>
  );
}