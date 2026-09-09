'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "default" | "pink";

type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
};

const THEME_STORAGE_KEY = "gymbro-theme";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    // Lazy initializer reads localStorage once, synchronously, during the first render
    // instead of via an effect + setState (which would cause an extra cascading render).
    // Guarded for SSR, where `window`/`localStorage` don't exist.
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === "undefined") return "default";
        return localStorage.getItem(THEME_STORAGE_KEY) === "pink" ? "pink" : "default";
    });

    // Keeps the DOM's `theme-pink` class in sync with React state — this is the
    // "update an external system with the latest state from React" effect pattern.
    useEffect(() => {
        document.documentElement.classList.toggle("theme-pink", theme === "pink");
    }, [theme]);

    function toggleTheme() {
        setTheme((prev) => {
            const next = prev === "pink" ? "default" : "pink";
            localStorage.setItem(THEME_STORAGE_KEY, next);
            return next;
        });
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
