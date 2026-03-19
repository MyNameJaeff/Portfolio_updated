'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Language, DEFAULT_LANGUAGE, getLanguageFromNavigator, getStoredLanguage, setStoredLanguage } from '@/lib/i18n';
import type en from '@/data/translations-en.json';

type Translations = typeof en;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, defaultValue?: string) => string;
    translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
    const [translations, setTranslations] = useState<Translations | null>(null);

    const loadTranslations = useCallback(async (lang: Language) => {
        try {
            // eslint-disable-next-line @next/next/no-assign-module-variable
            const module = await import(`@/data/translations-${lang}.json`);
            setTranslations(module.default);
        } catch (error) {
            console.error(`Failed to load translations for ${lang}:`, error);
            // Fallback to English
            const fallback = await import(`@/data/translations-en.json`);
            setTranslations(fallback.default);
        }
    }, []);

    useEffect(() => {
        // Get language preference
        const storedLang = getStoredLanguage();
        const detectedLang = getLanguageFromNavigator();
        const initialLang = storedLang || detectedLang;

        setLanguageState(initialLang);
        loadTranslations(initialLang);
    }, [loadTranslations]);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        setStoredLanguage(lang);
        void loadTranslations(lang);

        // Update document lang attribute
        if (typeof document !== 'undefined') {
            document.documentElement.lang = lang;
        }
    }, [loadTranslations]);

    const t = useCallback((key: string, defaultValue: string = key): string => {
        if (!translations) return defaultValue;

        const keys = key.split('.');
        let current: unknown = translations;

        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = (current as Record<string, unknown>)[k];
            } else {
                return defaultValue;
            }
        }

        return typeof current === 'string' ? current : defaultValue;
    }, [translations]);

    // Always provide a context value, even before mounted
    const contextValue: LanguageContextType = useMemo(() => ({
        language,
        setLanguage,
        t,
        translations: translations || {} as Translations
    }), [language, setLanguage, t, translations]);

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}
