"use client";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import StaggeredMenu from "@/components/StaggeredMenu";
import LiquidChrome from "@/components/LiquidChrome";
import { useEffect, useState, useRef } from "react";

// Create a separate component that uses the theme
function ThemedLayout({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
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
                        { label: "Home", link: "#home", ariaLabel: "Go to homepage" },
                        { label: "About", link: "#about", ariaLabel: "Learn more about me" },
                        { label: "Skills", link: "#skills", ariaLabel: "View my skills" },
                        { label: "Projects", link: "#projects", ariaLabel: "View my projects" },
                        { label: "Contact", link: "#contact", ariaLabel: "Get in touch with me" },
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
                    themeSwitch={<ThemeSwitch />}
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
            <ThemedLayout>{children}</ThemedLayout>
        </NextThemesProvider>
    );
}