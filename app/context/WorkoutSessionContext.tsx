'use client';

import { createContext, useContext, useEffect, useState, useSyncExternalStore, ReactNode } from "react";
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

function subscribeNoop() {
    return () => {};
}

export function WorkoutSessionProvider({ children }: { children: ReactNode }) {
    // Always start from defaultState so the very first client render (hydration)
    // matches what the server rendered — no hydration mismatch.
    const [state, setState] = useState<WorkoutSessionState>(defaultState);
    const [isRestored, setIsRestored] = useState(false);

    // Tells us once the client has finished hydrating. useSyncExternalStore returns
    // the server snapshot (false) during SSR *and* the hydrating client render — so
    // they always match — then re-renders once on the client with the real value
    // (true) right after mount, via React's own update mechanism. This never calls
    // setState inside a useEffect body, so it doesn't trigger the
    // react-hooks/set-state-in-effect rule.
    const isHydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);

    // Restore once, directly during render (guarded by the isRestored state itself,
    // so it only ever runs a single time) instead of inside an effect — this is
    // React's documented pattern for adjusting state in response to newly available
    // information without an extra effect-driven render, and it avoids the lint rule
    // entirely since nothing is set inside useEffect here.
    if (isHydrated && !isRestored) {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setState({ ...defaultState, ...JSON.parse(stored) });
            }
        } catch {
            // ignore malformed storage
        }
        setIsRestored(true);
    }

    // Keeps localStorage in sync with the latest in-progress workout so it
    // survives full page reloads / the app being backgrounded and reopened.
    // Guarded on isRestored so we never wipe existing storage with defaultState
    // before the restore above has had a chance to run.
    useEffect(() => {
        if (!isRestored) return;
        if (state.started) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [state, isRestored]);

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