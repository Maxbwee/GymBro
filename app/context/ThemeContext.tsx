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
    const [theme, setTheme] = useState<Theme>("default");

    useEffect(() => {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === "pink") {
            setTheme("pink");
        }
    }, []);

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
