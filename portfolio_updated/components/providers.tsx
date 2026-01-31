"use client";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import StaggeredMenu from "@/components/StaggeredMenu";
import LiquidChrome from "@/components/LiquidChrome";
import { useEffect, useState } from "react";

// Create a separate component that uses the theme
function ThemedLayout({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isNotFound, setIsNotFound] = useState(false);

    useEffect(() => {
        setMounted(true);

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

        return () => observer.disconnect();
    }, []);

    const isDark = resolvedTheme === "dark";

    return (
        <>
            {/* Persistent Animated Background - Only mounts once, hidden on 404 */}
            {mounted && !isNotFound && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 dark:opacity-30 transition-opacity duration-700 z-1">
                    <LiquidChrome
                        baseColor={isDark ? [0.5, 0.4, 0.9] : [0.4, 0.4, 0.4]}
                        speed={isDark ? 0.1 : 0.2}
                        amplitude={0.6}
                        interactive={false}
                    />
                </div>
            )}

            {/* Staggered Menu - Fixed Position with Theme Switch Inside, hidden on 404 */}
            {!isNotFound && (
                <StaggeredMenu
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