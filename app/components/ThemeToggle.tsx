'use client';

import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isPink = theme === "pink";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-pressed={isPink}
            aria-label="Toggle pink theme"
            suppressHydrationWarning
            className={`relative w-14 h-8 rounded-full shrink-0 transition-colors ${isPink ? "bg-pink-400" : "bg-zinc-300"}`}
        >
            <span
                suppressHydrationWarning
                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center text-xs ${isPink ? "translate-x-6" : "translate-x-0"}`}
            >
                {isPink ? "🎀" : "⚪"}
            </span>
        </button>
    );
}
