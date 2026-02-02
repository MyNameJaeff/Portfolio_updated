"use client";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import StaggeredMenu from "@/components/StaggeredMenu";
import LiquidChrome from "@/components/LiquidChrome";
import { useEffect, useState, useRef } from "react";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";

// Create a separate component that uses the theme
function ThemedLayout({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    const { t } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [isNotFound, setIsNotFound] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const menuRef = useRef<{ closeMenu: () => void } | null>(null);

    useEffect(() => {
        setMounted(true);

        // Check if mobile device
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Check if body has not-found attribute
        const checkNotFound = () => {
            setIsNotFound(document.body.hasAttribute('data-not-found'));
        };

        checkNotFound();

        // Watch for changes to the attribute
        const observer = new MutationObserver(checkNotFound);
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-not-found']
        });

        // Set loading to false after a short delay to ensure smooth transition
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);

        // Add click handler for mobile navigation links
        const handleLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a[href^="#"]');
            if (link && window.innerWidth < 768 && menuRef.current) {
                menuRef.current.closeMenu();
            }
        };

        document.addEventListener('click', handleLinkClick);

        return () => {
            observer.disconnect();
            clearTimeout(timer);
            window.removeEventListener('resize', checkMobile);
            document.removeEventListener('click', handleLinkClick);
        };
    }, []);

    const isDark = resolvedTheme === "dark";

    return (
        <>
            {/* Loading Skeleton */}
            {isLoading && !isNotFound && (
                <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-muted-foreground animate-pulse">Loading...</p>
                    </div>
                </div>
            )}

            {/* Persistent Animated Background - Only mounts once, hidden on 404 */}
            {mounted && !isNotFound && !isLoading && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 dark:opacity-30 transition-opacity duration-700 z-1">
                    <LiquidChrome
                        baseColor={isDark ? [0.5, 0.4, 0.9] : [0.4, 0.4, 0.4]}
                        speed={isMobile ? 0.15 : 0.1}
                        amplitude={0.6}
                        frequencyX={3}
                        frequencyY={2}
                        interactive={false}
                    />
                </div>
            )}

            {/* Staggered Menu - Fixed Position with Theme Switch Inside, hidden on 404 */}
            {!isNotFound && !isLoading && (
                <StaggeredMenu
                    ref={menuRef}
                    items={[
                        { label: t('nav.home', 'Home'), link: "#home", ariaLabel: t('nav.home', 'Go to homepage') },
                        { label: t('nav.about', 'About'), link: "#about", ariaLabel: t('nav.about', 'Learn more about me') },
                        { label: t('nav.skills', 'Skills'), link: "#skills", ariaLabel: t('nav.skills', 'View my skills') },
                        { label: t('nav.projects', 'Projects'), link: "#projects", ariaLabel: t('nav.projects', 'View my projects') },
                        { label: t('nav.contact', 'Contact'), link: "#contact", ariaLabel: t('nav.contact', 'Get in touch with me') },
                    ]}
                    isFixed
                    accentColor="var(--chart-4)"
                    colors={[
                        'var(--secondary)',
                        'var(--primary)'
                    ]}
                    menuButtonColor="var(--foreground)"
                    openMenuButtonColor="var(--foreground)"
                    changeMenuColorOnOpen={true}
                    closeOnClickAway={true}
                    themeSwitch={
                        <div className="flex flex-col gap-3">
                            <ThemeSwitch />
                            <LanguageSwitcher />
                        </div>
                    }
                />
            )}

            {/* Page content */}
            {children}
        </>
    );
}

export function Providers({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            {...props}
        >
            <LanguageProvider>
                <ThemedLayout>
                    {children}
                </ThemedLayout>
            </LanguageProvider>
        </NextThemesProvider>
    );
}