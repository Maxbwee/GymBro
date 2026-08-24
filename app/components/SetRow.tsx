'use client';

import type { Set } from '../types/workoutType';


type SetRowProps = {
    setNumber: number;
    weight: Set['weight'];
    reps: Set['reps'];
    onChange: (weight: number, reps: number) => void;
};

export default function SetRow({ setNumber, weight, reps, onChange }: SetRowProps) {

    return(
        <div className="flex items-center gap-4">
            <span className="font-bold">Set {setNumber}</span>
            <input
                type="number"
                value={weight}
                onChange= {(e) => onChange(Number(e.target.value), reps)}
                placeholder="Kg"
                className="border border-gray-300 rounded px-2 py-1 w-20"
            />
            <input
                type="number"
                value={reps}
                onChange={(e) => onChange(weight, Number(e.target.value))}
                placeholder="Reps"
                className="border border-gray-300 rounded px-2 py-1 w-20"
            />
        </div>
    );

}