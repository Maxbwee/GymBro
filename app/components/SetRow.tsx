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
        setWeightInput(value);
        onChange(value === '' ? 0 : Number(value), reps);
    }

    function handleRepsChange(value: string) {
        setRepsInput(value);
        onChange(weight, value === '' ? 0 : Number(value));
    }

return(
    <div className="grid grid-cols-[2rem_1fr_1fr_2rem] items-center gap-2">
        <span className="font-bold text-sm text-black text-center">{setNumber}</span>
        <input
            type="number"
            value={weightInput}
            min={1}
            step={1}
            onChange={(e) => handleWeightChange(e.target.value)}
            placeholder="Kg"
            className="border border-zinc-300 rounded px-2 py-1 w-full text-black focus:outline-none focus:border-black"
        />
        <input
            type="number"
            value={repsInput}
            min={1}
            step={1}
            onChange={(e) => handleRepsChange(e.target.value)}
            placeholder="Reps"
            className="border border-zinc-300 rounded px-2 py-1 w-full text-black focus:outline-none focus:border-black"
        />
        <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-600 text-sm justify-self-center"
        >
            ✕
        </button>
    </div>
);

}