export type Language = 'en' | 'sv';

export const LANGUAGES = {
    en: { name: 'English', flag: '🇬🇧' },
    sv: { name: 'Swedish', flag: '🇸🇪' },
} as const;

export const DEFAULT_LANGUAGE: Language = 'en';

export function getLanguageFromNavigator(): Language {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

    const browserLang = navigator.language.toLowerCase();

    if (browserLang.startsWith('sv')) return 'sv';
    if (browserLang.startsWith('en')) return 'en';

    return DEFAULT_LANGUAGE;
}

export function getStoredLanguage(): Language | null {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem('portfolio-language');
    if (stored === 'en' || stored === 'sv') {
        return stored;
    }

    return null;
}

export function setStoredLanguage(lang: Language): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('portfolio-language', lang);
    }
}
