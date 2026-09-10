'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { WorkoutExerciseDraft } from "../types/workoutType";

type WorkoutSessionState = {
    started: boolean;
    startTime: number;
    workoutName: string;
    exercises: WorkoutExerciseDraft[];
};

type WorkoutSessionContextType = WorkoutSessionState & {
    startWorkout: () => void;
    setWorkoutName: (name: string) => void;
    addExercise: (exercise: WorkoutExerciseDraft) => void;
    updateExercise: (index: number, updated: WorkoutExerciseDraft) => void;
    removeExercise: (index: number) => void;
    resetWorkout: () => void;
};

const STORAGE_KEY = "gymbro-active-workout";

const defaultState: WorkoutSessionState = {
    started: false,
    startTime: 0,
    workoutName: "",
    exercises: [],
};

const WorkoutSessionContext = createContext<WorkoutSessionContextType | undefined>(undefined);

export function WorkoutSessionProvider({ children }: { children: ReactNode }) {
    // Lazy initializer reads localStorage once, synchronously, on first render
    // instead of via an effect + setState (avoids an extra cascading render).
    const [state, setState] = useState<WorkoutSessionState>(() => {
        if (typeof window === "undefined") return defaultState;
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
        } catch {
            return defaultState;
        }
    });

    // Keeps localStorage in sync with the latest in-progress workout so it
    // survives full page reloads / the app being backgrounded and reopened.
    useEffect(() => {
        if (state.started) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [state]);

    function startWorkout() {
        setState({ started: true, startTime: Date.now(), workoutName: "", exercises: [] });
    }

    function setWorkoutName(name: string) {
        setState((prev) => ({ ...prev, workoutName: name }));
    }

    function addExercise(exercise: WorkoutExerciseDraft) {
        setState((prev) => ({ ...prev, exercises: [...prev.exercises, exercise] }));
    }

    function updateExercise(index: number, updated: WorkoutExerciseDraft) {
        setState((prev) => ({
            ...prev,
            exercises: prev.exercises.map((ex, i) => (i === index ? updated : ex)),
        }));
    }

    function removeExercise(index: number) {
        setState((prev) => ({
            ...prev,
            exercises: prev.exercises.filter((_, i) => i !== index),
        }));
    }

    function resetWorkout() {
        setState(defaultState);
    }

    return (
        <WorkoutSessionContext.Provider
            value={{ ...state, startWorkout, setWorkoutName, addExercise, updateExercise, removeExercise, resetWorkout }}
        >
            {children}
        </WorkoutSessionContext.Provider>
    );
}

export function useWorkoutSession() {
    const context = useContext(WorkoutSessionContext);
    if (!context) {
        throw new Error("useWorkoutSession must be used within a WorkoutSessionProvider");
    }
    return context;
}