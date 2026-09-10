'use client';

import type { Set } from '../types/workoutType';
import { useState } from 'react';


type SetRowProps = {
    setNumber: number;
    weight: Set['weight'];
    reps: Set['reps'];
    onChange: (weight: number, reps: number) => void;
    onRemove: () => void;
};

export default function SetRow({ setNumber, weight, reps, onChange, onRemove }: SetRowProps) {

    const [weightInput, setWeightInput] = useState(weight === 0 ? '' : weight.toString());
    const [repsInput, setRepsInput] = useState(reps === 0 ? '' : reps.toString());


    function handleWeightChange(value: string) {
        if (value !== '' && !/^\d*\.?\d{0,2}$/.test(value)) return;
        setWeightInput(value);
        const numericValue = value === '' || value === '.' ? 0 : Number(value);
        onChange(numericValue, reps);
    }

    function handleRepsChange(value: string) {
        if (value !== '' && !/^\d+$/.test(value)) return;
        setRepsInput(value);
        onChange(weight, value === '' ? 0 : Number(value));
    }

    return (
        <div className="grid grid-cols-[2rem_1fr_1fr_2rem] items-center gap-2">
            <span className="font-bold text-sm text-black pink:text-pink-900 text-center">{setNumber}</span>
            <input
                type="text"
                inputMode="decimal"
                value={weightInput}
                onChange={(e) => handleWeightChange(e.target.value)}
                placeholder="Kg"
                className="border border-zinc-300 pink:border-pink-200 rounded px-2 py-1 w-full text-black pink:text-pink-900 focus:outline-none focus:border-black pink:focus:border-pink-400"
            />
            <input
                type="text"
                inputMode="numeric"
                value={repsInput}
                onChange={(e) => handleRepsChange(e.target.value)}
                placeholder="Reps"
                className="border border-zinc-300 pink:border-pink-200 rounded px-2 py-1 w-full text-black pink:text-pink-900 focus:outline-none focus:border-black pink:focus:border-pink-400"
            />
            <button
                type="button"
                onClick={onRemove}
                className="text-red-500 pink:text-rose-400 hover:text-red-600 pink:hover:text-rose-500 text-sm justify-self-center"
            >
                ✕
            </button>
        </div>
    );

}