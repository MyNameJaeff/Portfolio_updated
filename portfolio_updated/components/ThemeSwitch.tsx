"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeSwitch() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return (
            <div className="flex gap-1 rounded-full bg-secondary p-1">
                <div className="w-[180px] h-10" />
            </div>
        );
    }

    const themes = [
        { value: "light", label: "Light", icon: Sun },
        { value: "dark", label: "Dark", icon: Moon },
        { value: "system", label: "System", icon: Monitor },
    ];

    return (
        <div
            className="inline-flex w-full rounded-full bg-secondary/50 backdrop-blur-sm p-1 shadow-sm border border-border/50"
            role="radiogroup"
            aria-label="Theme selector"
        >
            {themes.map(({ value, label, icon: Icon }, index) => {
                const isActive = theme === value;
                return (
                    <button
                        key={value}
                        onClick={() => setTheme(value)}
                        role="radio"
                        aria-checked={isActive}
                        aria-label={`${label} theme`}
                        className={`
                            relative flex items-center justify-center flex-1 gap-2 px-2 py-2
                            ${index === 0 ? "rounded-l-full" : ""}
                            ${index === themes.length - 1 ? "rounded-r-full" : ""} 
                            text-sm font-medium
                            transition-all duration-200 ease-in-out
                            ${isActive
                                ? "bg-card shadow-md text-card-foreground scale-105 border border-border"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                            active:scale-95
                        `}
                    >
                        <Icon
                            className={`w-4 h-4 transition-transform duration-200 ${isActive ? "rotate-0" : ""
                                }`}
                        />
                        <span className="whitespace-nowrap">{label}</span>

                        {/* Active indicator dot */}
                        {isActive && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}