"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { LANGUAGES } from "@/lib/i18n";

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div
            className="inline-flex w-full rounded-full bg-secondary/50 backdrop-blur-sm p-1 shadow-sm border border-border/50"
            role="radiogroup"
            aria-label="Language selector"
        >
            {Object.entries(LANGUAGES).map(([value, { name, flag }], index) => {
                const isActive = language === value;
                const langValue = value as keyof typeof LANGUAGES;

                return (
                    <button
                        key={value}
                        onClick={() => setLanguage(langValue)}
                        role="radio"
                        aria-checked={isActive}
                        aria-label={`${name} language`}
                        className={`
                            relative flex items-center justify-center flex-1 gap-2 px-2 py-1
                            ${index === 0 ? "rounded-l-full" : ""}
                            ${index === Object.entries(LANGUAGES).length - 1 ? "rounded-r-full" : ""} 
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
                        <span className="text-lg">{flag}</span>
                        <span className="whitespace-nowrap">{name}</span>

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
